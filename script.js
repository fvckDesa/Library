let myLibrary = [];

function Book (title, author, description, pagesRead, pages){
    this.title = title;
    this.author = author;
    this.description = description;
    this.pagesRead = pagesRead;
    this.pages = pages;

    this.createCard = () => {
        const flipBox = document.createElement('div');
        flipBox.classList.add('flip-box');

        const card = document.createElement('div');
        card.classList.add('card');
        flipBox.appendChild(card);

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');

        const title = document.createElement('div');
        title.classList.add('title');
        cardFront.appendChild(title);

        const pTitle = document.createElement('p');
        pTitle.innerText = this.title;
        title.appendChild(pTitle);

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');

        const contentCard = document.createElement('div');
        contentCard.classList.add('content-card');

        const author = document.createElement('div');
        author.classList.add('author');

        const h2Author = document.createElement('h2');
        h2Author.innerText = 'Author:';
        const h3Author = document.createElement('h3');
        h3Author.innerText = this.author;
        author.append(h2Author, h3Author);

        const description = document.createElement('div');
        description.classList.add('description');

        const h2Description = document.createElement('h2');
        h2Description.innerText = 'Description:';
        const pDescription = document.createElement('p');
        pDescription.innerText = this.description;

        description.append(h2Description, pDescription);

        contentCard.append(author, description);

        const pagesInfo = document.createElement('div');
        pagesInfo.classList.add('pages-info');

        const input = document.createElement('input');
        input.setAttribute('type', 'number');
        input.setAttribute('value', this.pagesRead);
        input.setAttribute('min', 0);
        input.setAttribute('max', this.pages);
        input.id = 'number';

        input.addEventListener('input', (e) => {
            if(e.target.value > this.pages){
                e.target.value = this.pages
            }
        });

        const pageTot = document.createElement('div');
        pageTot.classList.add('page-tot');
        pageTot.innerText = this.pages;

        pagesInfo.append(input, pageTot);

        cardBack.append(contentCard, pagesInfo);

        card.append(cardFront, cardBack);

        return flipBox;
    }
}

const main = document.querySelector('main');
const addBook = document.querySelector('.add-book');

function addBookToLibrary(title, author, description, pagesRead, pages) {
    myLibrary.unshift(new Book(title, author, description, pagesRead, pages));
    showBooks();
}

function showBooks () {
    main.replaceChildren(addBook);
    myLibrary.forEach(book => {
        main.insertBefore(book.createCard(), addBook);
    });
}

addBookToLibrary('prova', 'prova', 'descrizione prova', 1500, 3000);

