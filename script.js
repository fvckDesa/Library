let myLibrary = [];

function Book(title, author, description, pagesRead, pages, url) {
  this.title = title;
  this.author = author;
  this.description = description;
  this.pagesRead = pagesRead < pages ? pagesRead : pages;
  this.pages = pages;
  this.notSubmit = true; 

  this.createCard = () => {
    const flipBox = document.createElement("div");
    flipBox.classList.add("flip-box");
    flipBox.id = "book";

    const card = document.createElement("div");
    card.classList.add("card");
    flipBox.appendChild(card);

    const cardFront = document.createElement("div");
    cardFront.classList.add("card-front");
    if (url) {
      fetch(url)
        .then((response) => response.blob())
        .then((myBlob) => {
          cardFront.style.background = `var(--aside-card) url(${URL.createObjectURL(
            myBlob
          )}) no-repeat center`;
        })
        .catch((err) => {
          if(this.notSubmit){
            this.notSubmit = false;
            const errMessage = document.createElement('div');
            errMessage.classList.add('err-message');
            errMessage.innerHTML = `<h1>Errore caricamento immagine</h1><button>OK</button>`;
            errMessage.lastChild.addEventListener('click', () => document.body.removeChild(errMessage));
            document.body.appendChild(errMessage);
            throw new Error(err);
          }
        });
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
    input.addEventListener("input", (e) => {
      if (e.target.value > this.pages) {
        e.target.value = this.pages;
      }
      this.pagesRead = +e.target.value;
      info();
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
const deleteBook = document.querySelector("#delete-button");
const main = document.querySelector("main");
//form
const formAdd = document.querySelector("#form-add");
const formDelete = document.querySelector("#form-delete");
const formTitol = document.querySelector("#titol");
const formAuthor = document.querySelector("#author");
const formDescription = document.querySelector("#description");
const formPagesRead = document.querySelector("#pages-read");
const formPages = document.querySelector("#pages");
const formUrl = document.querySelector("#url-image");
//info
const infoBook = document.querySelector("#info-book");
const infoBookRead = document.querySelector("#info-book-read");
const infoPages = document.querySelector("#info-pages");
const infoPagesRead = document.querySelector("#info-pages-read");
//check box
const checkRead = document.querySelector("#read");
const checkNotRead = document.querySelector("#not-read");

const observer = new MutationObserver(info);
observer.observe(main, { subtree: true, childList: true });

function addBookToLibrary(title, author, description, pagesRead, pages, url) {
  myLibrary.unshift(
    new Book(title, author, description, pagesRead, pages, url)
  );
  showBooks();
}

function showBooks() {
  main.replaceChildren(addBookCard);
  myLibrary.forEach((book) => {
    const card = book.createCard();
    if (checkRead.checked && book.pages === book.pagesRead) {
      main.insertBefore(card, addBookCard);
    }
    if (checkNotRead.checked && book.pages !== book.pagesRead) {
      main.insertBefore(card, addBookCard);
    }
  });
}

[addBookBtn, addBookCard].forEach((element) => {
  element.addEventListener("click", () => {
    addBook.classList.remove("invisible");
  });
});

formAdd.addEventListener("click", () => {
  const titol = formTitol.value;
  const author = formAuthor.value;
  const description = formDescription.value;
  const image = formUrl.value;
  const pagesRead = +formPagesRead.value;
  const pages = +formPages.value;
  addBookToLibrary(titol, author, description, pagesRead, pages, image);
  clearForm();
});

formDelete.addEventListener("click", clearForm);

function clearForm() {
  const form = [
    formTitol,
    formAuthor,
    formDescription,
    formUrl,
    formPagesRead,
    formPages,
  ];
  form.forEach((input) => (input.value = ""));
  addBook.classList.add("invisible");
}

function info() {
  let numBook = myLibrary.length;
  let numBookRead = 0;
  let pages = 0;
  let pagesRead = 0;
  myLibrary.forEach((book) => {
    if (book.pages === book.pagesRead) {
      numBookRead++;
    }
    pages += book.pages;
    pagesRead += book.pagesRead;
  });
  infoBook.innerText = numBook;
  infoBookRead.innerText = numBookRead;
  infoPages.innerText = pages;
  infoPagesRead.innerText = pagesRead;
}

[checkRead, checkNotRead].forEach((input) =>
  input.addEventListener("input", showBooks)
);

let check = false;
deleteBook.addEventListener("click", () => {
  check = !check;
  const books = document.querySelectorAll("#book");
  if (check) {
    books.forEach((book) => {
      const div = document.createElement("div");
      div.id = "x";
      div.innerHTML = `<img class="delete-btn" src="./svg/delete.svg" />`;
      div.addEventListener("click", () => {
        div.remove();
        book.style.cssText = `animation: delete 1s ease`;
        setTimeout(() => {
          book.remove();
          myLibrary.splice(myLibrary.indexOf(book), 1);
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

const moon = document.querySelector('#moon');

moon.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
});
