const bookList = [];
const RENDER_EVENT = "render-event";
const SAVED_EVENT = "saved-event";
const STORAGE_KEY = "BOOKSHELF_APPS";
let searchInput;

document.addEventListener("DOMContentLoaded", () => {
  const inputBook = document.getElementById("inputBook");
  const searchForm = document.getElementById("searchBook");
  searchInput = document.getElementById("searchBookTitle");
  // Form submit
  inputBook.addEventListener("submit", (e) => {
    e.preventDefault();
    addBook();
  });
  // Search
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    filterBooks();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

// Render event
document.addEventListener(RENDER_EVENT, () => {
  filterBooks();
});

// Menambahkan buku
const addBook = () => {
  const inputBookTitle = document.getElementById("inputBookTitle").value;
  const inputBookAuthor = document.getElementById("inputBookAuthor").value;
  const inputBookYear = document.getElementById("inputBookYear").value;
  const inputBookIsComplete = document.getElementById(
    "inputBookIsComplete"
  ).checked;

  const generateID = generateId();
  const bookObject = generateBookObject(
    generateID,
    inputBookTitle,
    inputBookAuthor,
    inputBookYear,
    inputBookIsComplete
  );
  bookList.push(bookObject);
  console.log(inputBookIsComplete);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

// Generate ID buku
const generateId = () => {
  return +new Date();
};

// Generate data buku ke object
const generateBookObject = (id, title, author, year, isComplete) => {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
};

// Membuat element
const makeBookElement = (bookObject) => {
  const createElementWithText = (tag, text) => {
    const element = document.createElement(tag);
    element.innerText = text;
    return element;
  };

  const textTitle = createElementWithText("h3", bookObject.title);
  const textDetail = createElementWithText(
    "p",
    `Penulis: ${bookObject.author}`
  );
  const textDetail2 = createElementWithText("p", `Tahun: ${bookObject.year}`);

  const createButton = (color, text) => {
    const btn = document.createElement("button");
    btn.classList.add(color);
    btn.innerText = text;
    return btn;
  };

  const btnGreen = createButton("green", "Selesai dibaca");
  btnGreen.addEventListener("click", () => {
    finishedReading(bookObject.id);
  });

  const btnRed = createButton("red", "Hapus buku");
  btnRed.addEventListener("click", () => {
    removeBook(bookObject.id);
  });

  const btnWrap = document.createElement("div");
  btnWrap.classList.add("action");
  btnWrap.append(btnGreen, btnRed);

  const article = document.createElement("article");
  article.classList.add("book_item");
  article.append(textTitle, textDetail, textDetail2, btnWrap);

  return article;
};

// Selesai baca
const finishedReading = (bookId) => {
  const targetBook = findBook(bookId);
  if (targetBook == null) return;
  targetBook.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

// Hapus buku
const removeBook = (bookId) => {
  const targetBook = findBookIndex(bookId);
  bookList.splice(targetBook, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const findBook = (bookId) => {
  for (const book of bookList) {
    if (book.id === bookId) {
      return book;
    }
  }
  return null;
};

const findBookIndex = (bookId) => {
  for (const index in bookList) {
    if (bookList[index].id === bookId) {
      return index;
    }
  }
  return -1;
};

// Filter
const filterBooks = () => {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const incompleteBookList = document.getElementById("incompleteBookshelfList");
  const completeBookList = document.getElementById("completeBookshelfList");

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  const filteredBooks = bookList.filter((book) => {
    const titleMatch = book.title.toLowerCase().includes(searchTerm);
    const authorMatch = book.author.toLowerCase().includes(searchTerm);
    return titleMatch || authorMatch;
  });

  for (const book of filteredBooks) {
    const bookElement = makeBookElement(book);

    if (book.isComplete === false) {
      incompleteBookList.append(bookElement);
    }
    if (book.isComplete === true) {
      completeBookList.append(bookElement);
    }
  }
};

// Local storage
const isStorageExist = () => {
  if (typeof Storage === undefined) {
    alert("Your browser does not support local storage");
    return false;
  }
  return true;
};

const saveData = () => {
  if (isStorageExist()) {
    const parsed = JSON.stringify(bookList);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
};

const loadDataFromStorage = () => {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      bookList.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
};
