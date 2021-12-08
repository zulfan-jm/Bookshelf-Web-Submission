const STORAGE_KEY = "BOOK_DATA";

document.addEventListener("DOMContentLoaded", function () {
    const submitForm = document.getElementById("inputBook");
    const bookTyping = document.getElementById("inputBookTitle");
    const bookCheck = document.getElementById("inputBookIsComplete");
    const searchBook = document.getElementById("searchBook");

    bookTyping.addEventListener("click", function() {
        document.getElementById("bookSubmit").innerHTML = "Masukkan Buku ke Rak <span>BELUM SELESAI DIBACA</span>";
    }, {once : true});

    bookCheck.addEventListener("change", function() {
        if (this.checked) {
            document.getElementById("bookSubmit").innerHTML = "Masukkan Buku ke Rak <span>SELESAI DIBACA</span>";
        } else {
            document.getElementById("bookSubmit").innerHTML = "Masukkan Buku ke Rak <span>BELUM SELESAI DIBACA</span>";
        }
    });

    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const bookId = +new Date();
        const bookTitle = document.getElementById("inputBookTitle").value;
        const bookAuthor = document.getElementById("inputBookAuthor").value;
        const bookYear = document.getElementById("inputBookYear").value;
        const bookComplete = document.getElementById("inputBookIsComplete").checked;

        addBook(bookId, bookTitle, bookAuthor, bookYear, bookComplete);
        saveBook(bookId, bookTitle, bookAuthor, bookYear, bookComplete);   
    });

    searchBook.addEventListener("submit", function(event) {
        event.preventDefault();

        const searchTitle = document.getElementById("searchBookTitle").value;

        findBook(searchTitle);
    });

    if (checkForStorage()) {
        if (localStorage.getItem(STORAGE_KEY) !== null){
            bookData = getBookFromStorage();
            for (let book of bookData) {
                addBook(book.id, book.title, book.author, book.year, book.isComplete);
            };
        }
    }else{
        alert("Browser yang Anda gunakan tidak mendukung Web Storage")
    }
});

function addBook(id, title, author, year, isComplete) {
    const bookItem = `
        <article class="book_item" id="${id}">
            <h3>${title}</h3>
            <p>Penulis: ${author}</p>
            <p>Tahun: ${year}</p>

            <div class="action">
                <button class="green" onclick="moveButton(${id}, '${title}', '${author}', ${year}, ${isComplete})"> 
                    ${(isComplete) ? 'Belum selesai dibaca' : 'Selesai dibaca'}
                </button>
                <button class="red" onclick="removeButton(${id})">Hapus buku</button>
            </div>
        </article>
    `;

    if (isComplete) {
        document.getElementById("completeBookshelfList").innerHTML += bookItem;
    } else {
        document.getElementById("incompleteBookshelfList").innerHTML += bookItem;
    }
}

function moveButton(id, title, author, year, isComplete) {
    removeBook(id);
    addBook(id, title, author, year, !isComplete);
    saveBook(id, title, author, year, !isComplete);
}

function removeButton(id) {
    if (confirm("Apakah Anda yakin untuk menghapus buku ini dari rak?")) {
        removeBook(id);
    } else {
        return null;
    }
}

function removeBook(id) {
    document.getElementById(`${id}`).remove();
    removeBookFromStorage(id);
}

function findBook(title){
    bookData = getBookFromStorage();
    searchBook = bookData.filter(bookObject => bookObject.title.toLowerCase() === title.toLowerCase());
            document.querySelector("#incompleteBookshelfList").innerHTML = '';
            document.querySelector("#completeBookshelfList").innerHTML = '';
            for (let book of searchBook) {
                addBook(book.id, book.title, book.author, book.year, book.isComplete);
            }
}

// Storage
function checkForStorage() {
    return typeof(Storage) !== "undefined"
}

function saveBook(id, title, author, year, isComplete){
    const bookItem = {
        id,
        title,
        author,
        year,
        isComplete,
    };

    if(checkForStorage()){
        let bookData = [];
        if (localStorage.getItem(STORAGE_KEY) === null) {
            bookData = [];
        } else {
            bookData = JSON.parse(localStorage.getItem(STORAGE_KEY));
        }
        bookData.push(bookItem);      
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookData));   
    }
}

function getBookFromStorage() {
    if (checkForStorage()) {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } else {
        return [];
    }
}

function removeBookFromStorage(id) {
    bookData = getBookFromStorage();
    index = bookData.findIndex(book => book.id === id);
    bookData.splice(index, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookData));
}