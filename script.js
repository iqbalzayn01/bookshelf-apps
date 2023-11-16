const bookList = [];
const RENDER_EVENT = "render-event";
const SAVED_EVENT = "saved-event";
const STORAGE_KEY = "BOOKSHELF_APPS";

document.addEventListener("DOMContentLoaded", () => {
  const inputBook = document.getElementById("inputBook");
  const searchForm = document.getElementById("searchBook");
  const searchInput = document.getElementById("searchBook");

  // Form submit
  inputBook.addEventListener("submit", (e) => {
    e.preventDefault();
    addBook();
  });
  // Search submit
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchValue = searchInput.value;
    searchBooks(searchValue);
    console.log(searchBooks(searchValue));
  });
});

// Render event
document.addEventListener(RENDER_EVENT, () => {
  const incompleteBookList = document.getElementById("incompleteBookshelfList");
  incompleteBookList.innerHTML = "";

  const completeBookList = document.getElementById("completeBookshelfList");
  completeBookList.innerHTML = "";

  for (const book of bookList) {
    const bookElement = makeBookElement(book);
    if (book.isComplete === false) {
      incompleteBookList.append(bookElement);
    }
    if (book.isComplete === true) {
      completeBookList.append(bookElement);
    }
  }
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
  const btnRed = createButton("red", "Hapus buku");

  const btnWrap = document.createElement("div");
  btnWrap.classList.add("action");
  btnWrap.append(btnGreen, btnRed);

  const article = document.createElement("article");
  article.classList.add("book_item");
  article.append(textTitle, textDetail, textDetail2, btnWrap);

  return article;
};

// Fungsi search
const searchBooks = (searchValue) => {
  const result = bookList.filter((book) => book.title.includes(searchValue));
  return result;
};
