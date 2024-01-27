document.addEventListener("DOMContentLoaded", function () {
  const bookForm = document.getElementById("bookForm");
  bookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

const books = [];
const RENDER_EVENT = "render-book";

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function addBook() {
  const bookName = document.getElementById("bookName").value;
  const bookAuthor = document.getElementById("bookAuthor").value;
  const bookYear = parseInt(document.getElementById("bookYear").value);
  const isComplete = document.getElementById("checkBox").checked;

  if (!bookName || !bookAuthor || isNaN(bookYear)) {
    alert("Mohon isi semua kolom yang diperlukan!");
    return;
  }

  const generatedId = generateId();
  const bookObject = generateBookObject(generatedId, bookName, bookAuthor, bookYear, isComplete);

  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function readBook(bookObject) {
  const textTitle = document.createElement("h2");
  textTitle.innerText = bookObject.title;
  textTitle.classList.add("text-xl", "mb-2", "font-semibold");

  const textAuthor = document.createElement("p");
  textAuthor.innerText = bookObject.author;
  textAuthor.classList.add("text-slate-500");

  const textYear = document.createElement("p");
  textYear.innerText = bookObject.year;
  textYear.classList.add("mb-3", "text-slate-500");

  const textContainer = document.createElement("div");
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement("div");
  container.append(textContainer);
  container.setAttribute("id", `book-${bookObject.id}`);
  container.classList.add("bg-white", "px-5", "py-3", "rounded-md", "mb-3");

  if (bookObject.isComplete) {
    const undoBtn = document.createElement("button");
    undoBtn.classList.add("mr-3", "bg-slate-100", "px-4", "py-2", "rounded-lg", "hover:bg-slate-200", "transition", "duration-400");
    const svgUndo = document.createElement("img");
    svgUndo.src =
      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'><path d='M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z'/></svg>";
    undoBtn.appendChild(svgUndo);
    undoBtn.addEventListener("click", function () {
      undoBookFromCompleted(bookObject.id);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("mr-3", "bg-slate-100", "px-4", "py-2", "rounded-lg", "hover:bg-slate-200", "transition", "duration-400");
    const svgDelete = document.createElement("img");
    svgDelete.src =
      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'><path d='M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z'/></svg>";
    deleteBtn.appendChild(svgDelete);
    deleteBtn.addEventListener("click", function () {
      removeBookFromCompleted(bookObject.id);
    });

    const editbtn = document.createElement("button");
    editbtn.classList.add("bg-slate-100", "px-4", "py-2", "rounded-lg", "hover:bg-slate-200", "transition", "duration-400");
    const svgEdit = document.createElement("img");
    svgEdit.src =
      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'><path d='M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z'/></svg>";
    editbtn.appendChild(svgEdit);
    editbtn.addEventListener("click", function () {
      editBookFromComplete(bookObject.id);
    });

    container.append(undoBtn, deleteBtn, editbtn);
  } else {
    const checkBtn = document.createElement("button");
    checkBtn.classList.add("mr-3", "bg-slate-100", "px-4", "py-2", "rounded-lg", "hover:bg-slate-200", "transition", "duration-400");
    const svgFinish = document.createElement("img");
    svgFinish.src =
      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'><path d='m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z'/></svg>";
    checkBtn.appendChild(svgFinish);
    checkBtn.addEventListener("click", function () {
      addBookToCompleted(bookObject.id);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("mr-3", "bg-slate-100", "px-4", "py-2", "rounded-lg", "hover:bg-slate-200", "transition", "duration-400");
    const svgDelete = document.createElement("img");
    svgDelete.src =
      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'><path d='M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z'/></svg>";
    deleteBtn.appendChild(svgDelete);
    deleteBtn.addEventListener("click", function () {
      removeBookFromCompleted(bookObject.id);
    });

    const editbtn = document.createElement("button");
    editbtn.classList.add("bg-slate-100", "px-4", "py-2", "rounded-lg", "hover:bg-slate-200", "transition", "duration-400");
    const svgEdit = document.createElement("img");
    svgEdit.src =
      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'><path d='M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z'/></svg>";
    editbtn.appendChild(svgEdit);
    editbtn.addEventListener("click", function () {
      editBookFromComplete(bookObject.id);
    });

    container.append(checkBtn, deleteBtn, editbtn);
  }

  return container;
}

function addBookToCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books[bookTarget].isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books[bookTarget].isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function editBookFromComplete(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  const bookObject = books[bookTarget];

  const editForm = document.createElement("form");
  editForm.innerHTML = `
                      <label for="bookName">
                            <span class="font-medium mb-4 text-slate-800 after:content-['*'] after:text-red-900 ">
                                Nama Buku
                            </span>
                        </label>
                        <input autocomplete="off" required type="text"id="editBookName" name="editBookName" value="${bookObject.title}" class="text-sm py-2 px-4 min-w-full rounded-md bg-slate-50

                        focus:outline-none focus:ring-2
                        focus:ring-green-400 
                        focus:border-green-400 mb-3">

                        <label for="editBookAuthor">
                        <span class="font-medium mb-4 text-slate-800 after:content-['*'] after:text-red-900 ">
                            Penulis
                        </span>
                    </label>
                    <input autocomplete="off" required type="text" id="editBookAuthor" name="editBookAuthor" value="${bookObject.author}" class="text-sm py-2 px-4 min-w-full rounded-md bg-slate-50
                        focus:outline-none focus:ring-2
                        focus:ring-green-400 
                        focus:border-green-400 mb-3">
  
                        <label for="editBookYear">
                        <span class="font-medium mb-4 text-slate-800 after:content-['*'] after:text-red-900 ">
                            Tahun
                        </span>
                    </label>
                    <input required type="number" id="editBookYear" name="editBookYear" value="${bookObject.year}" class="text-sm py-2 px-4 min-w-full rounded-md bg-slate-50
                        focus:outline-none focus:ring-2
                        focus:ring-green-400  
                        focus:border-green-400 mb-5">

     <button type="button" onclick="updateBook(${bookId})" class="bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200 transition duration-400">Edit Buku</button>
     </div>
    `;

  const container = document.getElementById(`book-${bookObject.id}`);
  container.innerHTML = "";
  container.append(editForm);
}

function updateBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  const editedBookName = document.getElementById("editBookName").value;
  const editedBookAuthor = document.getElementById("editBookAuthor").value;
  const editedBookYear = parseInt(document.getElementById("editBookYear").value);

  books[bookTarget].title = editedBookName;
  books[bookTarget].author = editedBookAuthor;
  books[bookTarget].year = editedBookYear;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBooksList = document.getElementById("unreadBooks");
  uncompletedBooksList.innerHTML = "";

  const completedBooksList = document.getElementById("readBooks");
  completedBooksList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = readBook(bookItem);
    if (!bookItem.isComplete) uncompletedBooksList.append(bookElement);
    else completedBooksList.append(bookElement);
  }
});

function searchBooks() {
  const searchInput = document.getElementById("searchInput");
  const searchTerm = searchInput.value.toLowerCase();

  const unreadBooksList = document.getElementById("unreadBooks");
  const readBooksList = document.getElementById("readBooks");

  const filteredUnreadBooks = books.filter((book) => book.title.toLowerCase().includes(searchTerm) || book.author.toLowerCase().includes(searchTerm));
  renderBooks(filteredUnreadBooks, unreadBooksList);

  const filteredReadBooks = readBook.filter((book) => book.title.toLowerCase().includes(searchTerm) || book.author.toLowerCase().includes(searchTerm));
  renderBooks(filteredReadBooks, readBooksList);
}

function renderBooks(books, container) {
  container.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = readBook(bookItem);
    container.append(bookElement);
  }
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";

function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});
