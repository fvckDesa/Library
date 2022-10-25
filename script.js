import { onAuthStateChanged } from "firebase/auth";
import { onSnapshot } from "firebase/firestore";
import { signInUser, signOutUser, auth, isAuth } from "./script/auth";
import {
  booksQuery,
  createBook,
  updateBook,
  deleteBook,
  docsArrToBooksArr,
} from "./script/database";

function $(query, parent = document) {
  return parent.querySelector(query);
}

$.all = (query, parent = document) => [...parent.querySelectorAll(query)];

function Book({ title, author, description, pagesRead, pages, image }) {
  this.title = title;
  this.author = author;
  this.description = description;
  this.pagesRead = pagesRead < pages ? pagesRead : pages;
  this.pages = pages;

  this.createCard = (id) => {
    const flipBox = document.createElement("div");
    flipBox.classList.add("flip-box", "book");
    flipBox.id = id;
    flipBox.dataset.pages = pages;
    flipBox.dataset.pagesRead = pagesRead;

    const card = document.createElement("div");
    card.classList.add("card");
    flipBox.appendChild(card);

    const cardFront = document.createElement("div");
    cardFront.classList.add("card-front");

    if (image) {
      cardFront.style.backgroundImage = `url(${image})`;
    }

    const title = document.createElement("div");
    title.classList.add("title");
    cardFront.appendChild(title);

    const pTitle = document.createElement("p");
    pTitle.innerText = this.title;
    title.appendChild(pTitle);

    const cardBack = document.createElement("div");
    cardBack.classList.add("card-back");

    const contentCard = document.createElement("div");
    contentCard.classList.add("content-card");

    const author = document.createElement("div");
    author.classList.add("author");

    const h2Author = document.createElement("h2");
    h2Author.innerText = "Author:";
    const h3Author = document.createElement("h3");
    h3Author.innerText = this.author;
    author.append(h2Author, h3Author);

    const description = document.createElement("div");
    description.classList.add("description");

    const h2Description = document.createElement("h2");
    h2Description.innerText = "Description:";
    const pDescription = document.createElement("p");
    pDescription.innerText = this.description;

    description.append(h2Description, pDescription);

    contentCard.append(author, description);

    const pagesInfo = document.createElement("div");
    pagesInfo.classList.add("pages-info");

    const input = document.createElement("input");
    input.setAttribute("type", "number");
    input.setAttribute("value", this.pagesRead ? this.pagesRead : "");
    input.setAttribute("min", 0);
    input.setAttribute("max", this.pages);
    input.setAttribute("placeholder", 0);
    input.id = "number";
    input.addEventListener("input", async (e) => {
      if (e.target.value > this.pages) {
        e.target.value = this.pages;
      }
      this.pagesRead = +e.target.value;
      await updateBook(id, { pagesRead: this.pagesRead });
      flipBox.dataset.pagesRead = this.pagesRead;
    });

    const pageTot = document.createElement("div");
    pageTot.classList.add("page-tot");
    pageTot.innerText = this.pages;

    pagesInfo.append(input, pageTot);

    cardBack.append(contentCard, pagesInfo);

    card.append(cardFront, cardBack);

    return flipBox;
  };
}

const addBook = document.querySelector("#add-book");
const addBookBtn = document.querySelector("#add-book-button");
const addBookCard = document.querySelector("#add-book-card");
const deleteBookBtn = document.querySelector("#delete-button");
const main = document.querySelector("main");
//form
const formAdd = document.querySelector("#form-add");
const formDelete = document.querySelector("#form-delete");
const formTitle = document.querySelector("#title");
const formAuthor = document.querySelector("#author");
const formDescription = document.querySelector("#description");
const formPagesRead = document.querySelector("#pages-read");
const formPages = document.querySelector("#pages");
const formImage = document.querySelector("#book-image");
//info
const infoBook = document.querySelector("#info-book");
const infoBookRead = document.querySelector("#info-book-read");
const infoPages = document.querySelector("#info-pages");
const infoPagesRead = document.querySelector("#info-pages-read");
//check box
const checkRead = document.querySelector("#read");
const checkNotRead = document.querySelector("#not-read");
//auth
const signInBtn = document.querySelector("#sign-in");
const userContainer = document.querySelector(".user-container");
const signOutBtn = document.querySelector("#sign-out");
const userPic = document.querySelector(".user-pic");
const userName = document.querySelector(".user-name");

[addBookBtn, addBookCard].forEach((element) => {
  element.addEventListener("click", () => {
    if (!isAuth()) {
      return alert("Log in for add books in your library");
    }
    addBook.classList.remove("invisible");
  });
});

addBook.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!isAuth()) {
    return alert("Log in for add books in your library");
  }
  await createBook({
    title: formTitle.value,
    author: formAuthor.value,
    description: formDescription.value,
    image: formImage.files[0],
    pagesRead: +formPagesRead.value,
    pages: +formPages.value,
  });
  clearForm();
});

formDelete.addEventListener("click", clearForm);

function clearForm() {
  const form = [
    formTitle,
    formAuthor,
    formDescription,
    formImage,
    formPagesRead,
    formPages,
  ];
  form.forEach((input) => (input.value = ""));
  addBook.classList.add("invisible");
}

[checkRead, checkNotRead].forEach((input) =>
  input.addEventListener("input", filterBooks)
);

let check = false;
deleteBookBtn.addEventListener("click", () => {
  check = !check;
  const books = document.querySelectorAll(".book");
  if (check) {
    books.forEach((book) => {
      const div = document.createElement("div");
      div.id = "x";
      div.innerHTML = `<img class="delete-btn" src="./svg/delete.svg" />`;
      div.addEventListener("click", () => {
        div.remove();
        book.style.cssText = `animation: delete 1s ease`;
        setTimeout(async () => {
          await deleteBook(book.id);
        }, 950);
      });
      book.appendChild(div);
    });
  } else {
    books.forEach((book) => {
      const div = book.lastChild;
      if (div.id === "x") {
        book.removeChild(div);
      }
    });
  }
});

const infoBtn = document.querySelector("#info-btn");
const reference = document.querySelector(".reference");

function addClass() {
  setTimeout(() => {
    reference.classList.add("visibility");
  }, 300);
}

function removeClass() {
  reference.classList.remove("visibility");
}

infoBtn.addEventListener("mouseover", removeClass);

infoBtn.addEventListener("mouseleave", addClass);

const moon = document.querySelector("#moon");

moon.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
});
// Auth
onAuthStateChanged(auth, (user) => {
  signInBtn.classList.toggle("hidden", user !== null);
  userContainer.classList.toggle("hidden", user === null);

  const { photoURL = "", displayName = "" } = user ?? {};

  userPic.src = photoURL;
  userName.innerText = displayName;

  if (!user) {
    $.all(".book").forEach((book) => book.remove());
    changeLibraryInfo(0, 0, 0, 0);
  }
});

signInBtn.addEventListener("click", signInUser);
signOutBtn.addEventListener("click", signOutUser);
// Database
onSnapshot(booksQuery, (snapshot) => {
  for (const change of snapshot.docChanges()) {
    switch (change.type) {
      case "added":
      case "modified":
        displayBook(change.doc.id, change.doc.data());
        break;
      case "removed":
        removeBook(change.doc.id);
        break;
    }
  }

  changeLibraryInfo(
    // number of books
    snapshot.docs.length,
    // number of books read
    docsArrToBooksArr(snapshot.docs).filter(
      ({ pagesRead, pages }) => pagesRead === pages
    ).length,
    // number of pages
    docsArrToBooksArr(snapshot.docs).reduce((acc, curr) => acc + curr.pages, 0),
    // number of pages read
    docsArrToBooksArr(snapshot.docs).reduce(
      (acc, curr) => acc + curr.pagesRead,
      0
    )
  );
});

function displayBook(id, book) {
  const card = document.getElementById(id);
  if (card) {
    const { title, author, description, pagesRead, pages, image } = book;
    $(".card-front", card).style.backgroundImage = `url(${image})`;
    $(".title > p", card).innerText = title;
    $(".author > h3", card).innerText = author;
    $(".description > p", card).innerText = description;
    $("#number", card).value = pagesRead;
    $(".page-tot", card).innerText = pages;
  } else {
    const newCard = new Book(book).createCard(id);
    main.insertBefore(newCard, addBookCard);
  }
  filterBooks();
}

function removeBook(id) {
  $(`[id="${id}"]`).remove();
}

function changeLibraryInfo(numBook, numBookRead, pages, pagesRead) {
  infoBook.innerText = numBook;
  infoBookRead.innerText = numBookRead;
  infoPages.innerText = pages;
  infoPagesRead.innerText = pagesRead;
}

function filterBooks() {
  for (const book of $.all(".book")) {
    const { pages, pagesRead } = book.dataset;
    book.hidden = !(
      (checkRead.checked && pages === pagesRead) ||
      (checkNotRead.checked && pages !== pagesRead)
    );
  }
}
