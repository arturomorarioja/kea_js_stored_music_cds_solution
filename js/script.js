'use strict';

const localStorageKey = 'music-cds';

/**
 * Deletes a CD from localStorage
 * @param {*} author 
 * @param {*} title 
 * @param {*} year 
 */
const deleteCD = (author, title, year) => {
    let cds = JSON.parse(localStorage.getItem(localStorageKey));

    const cdToRemove = cds.findIndex(cd => cd.author === author && cd.title === title && cd.year === year);
    cds = cds.toSpliced(cdToRemove, 1);

    localStorage.setItem(localStorageKey, JSON.stringify(cds));
}

/**
 * Creates a new table row with information about a music CD
 * @param {*} author 
 * @param {*} title 
 * @param {*} year 
 * @returns the new <tr> element
 */
const createTableRow = (author, title, year) => {
    const trNew = document.createElement('tr');
    
    const tdAuthor = document.createElement('td');
    tdAuthor.appendChild(document.createTextNode(author));
    trNew.appendChild(tdAuthor);

    const tdTitle = document.createElement('td');
    tdTitle.appendChild(document.createTextNode(title));
    trNew.appendChild(tdTitle);

    const tdYear = document.createElement('td');
    tdYear.appendChild(document.createTextNode(year));
    tdYear.classList.add('right');
    trNew.appendChild(tdYear);
    
    const imgDelete = document.createElement('img');
    imgDelete.classList.add('delete');
    // When the delete icon is clicked, the whole row (the <tr>) is removed
    imgDelete.addEventListener('click', function() {
        this.parentElement.parentElement.remove();
        deleteCD(author, title, year);
    });

    const tdDelete = document.createElement('td');    
    tdDelete.appendChild(imgDelete);
    tdDelete.classList.add('right');
    trNew.appendChild(tdDelete);

    return trNew;
}

const showTable = () => { document.querySelector('table').style.visibility = 'visible'; }

// Upon page load, the CDs are loaded from localStorage
const cds = localStorage.getItem(localStorageKey);
if (cds !== null) {
    JSON.parse(cds).forEach(cd => {
        document.querySelector('table > tbody').appendChild(createTableRow(cd.author, cd.title, cd.year));
    });
    showTable();
}

// CD insertion
document.querySelector('#frmCD').addEventListener('submit', function(e) {
    e.preventDefault();

    const author = document.querySelector('#txtAuthor').value;
    const title = document.querySelector('#txtTitle').value;
    const year = parseInt(document.querySelector('#txtYear').value);

    // The row is created in browser memory, then appended to the DOM on the page
    document.querySelector('table > tbody').appendChild(createTableRow(author, title, year));
    showTable();

    // The row is added to localStorage
    let cds = localStorage.getItem(localStorageKey);
    if (cds === null) {
        cds = '[';
    } else {
        cds = cds.substring(0, cds.length - 1);     // The trailing "]"" is removed
        cds += ', ';
    }
    cds += `{"author": "${author}", "title": "${title}", "year": "${year}"}]`
    localStorage.setItem(localStorageKey, cds);

    this.reset();   // The form is reset
});