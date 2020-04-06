
const galleryDiv = document.querySelector ('#gallery');
const documentBody = document.querySelector ('body');
const script = document.querySelector ('script'); 
const modalContainer = document.createElement ('div'); // create modal container

/**
 * A function to create and append HTML elements 
 * @param {string} elementType 
 * @param {string} elementClassName 
 * @param {object} elementParent 
 */
function buildElement (elementType, elementClassName, elementParent) {
    const element = document.createElement (elementType); 
    element.className = elementClassName;
    elementParent.appendChild (element); 
    return element; 
} 

// Create HTML for the search form and search inputs
const searchDiv = document.querySelector ('.search-container'); 
searchDiv.innerHTML = `
    <form action="#" method="get"> 
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>`;

/**
 * A function to create and append a modal container 
 * @param {object} user - the employee whose profile is displayed
 * @param {integer} i - the index of an object in the array of users  
 */
function buildModalHTML (user, i) { 
    const date = new Date (user[i].dob.date); // create and formate the birthday date 
    const day = date.getDate (); // get the day
    const month = date.getMonth () + 1; // get the month
    const year = date.getFullYear (); // get the year
    const birthday = `${day}/${month}/${year}`; 
    modalContainer.className = 'modal-container';  
    documentBody.insertBefore (modalContainer, script); // append modal container to body
    modalContainer.innerHTML = `
        <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
        <img class="modal-img" src=${user[i].picture.large} alt="profile picture">            
        <h3 id="name" class="modal-name cap">${user[i].name.first} ${user[i].name.last}</h3>
        <p class="modal-text">${user[i].email}</p>
        <p class="modal-text cap">${user[i].location.city}</p><hr>
        <p class="modal-text">${user[i].cell}</p>            
        <p class="modal-text">${user[i].location.street.number} ${user[i].location.street.name}</p> 
        <p class="modal-text">${user[i].location.state}, ${user[i].location.country} ${user[i].location.postcode}</p>
        <p class="modal-text">Birthday: ${birthday}</p>`;
    const modalButtonContainer = buildElement ('div', 'modal-btn-container', modalContainer); // create toggle buttons
    modalButtonContainer.innerHTML = `
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        <button type="button" id="modal-next" class="modal-next btn">Next</button>`; 
    const modalButtons = Array.from (modalButtonContainer.children); // turn the list of toggle buttons into array 
    modalButtons.forEach (modalButton => {
        modalButton.addEventListener ('click', (event) => { // add event listener to each toggle button
            if (event.target && modalButton.textContent === 'Prev') {
                documentBody.removeChild (modalContainer); // remove the current card
                if (i === 0) {
                    buildModalHTML (user, i + 11); // if the current card is the first one, show the last one
                } else {
                    buildModalHTML (user, i - 1); // show previous card 
                }
                closeModalContainer (); // remove modal container if close button is clicked
            } else if (event.target && modalButton.textContent === 'Next') {
                documentBody.removeChild (modalContainer); // remove the current card
                if (i === 11) {
                    buildModalHTML (user, i - 11); // if the current card is the last one, show the first one 
                } else {
                    buildModalHTML (user, i + 1); // show next card
                } 
                closeModalContainer (); // remove modal container if close button is clicked
            }
        });
    });     
}

/**
 * A function to close modal container if close button is clicked
 */
function closeModalContainer () {
    document.querySelector ('#modal-close-btn').addEventListener ('click', () => { 
        documentBody.removeChild (modalContainer);
    });
}

/**
 * A function that creates and renders cards of employees on the page
 * @param {object} user - the employee whose profile is displayed
 */
function buildHTML (user) {
    const cardDiv = buildElement ('div', 'card', galleryDiv); // create a card div
    cardDiv.innerHTML = `
        <div class="card-img-container">
        <img class="card-img" src=${user.picture.large} alt="profile picture">
        </div>
        <div class="card-info-container">
        <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
        <p class="card-text">${user.email}</p>
        <p class="card-text cap">${user.location.city}, ${user.location.country}</p>`;
}

/**
 * A function to show a modal container dynamically 
 * @param {object} user - the employee whose profile is displayed  
 */
function showModalHTML (user) {
    const cardDivs = document.querySelectorAll ('.card'); 
    const cardDivsArray = Array.from (cardDivs); 
    for (let i = 0; i < cardDivsArray.length; i ++) {
        const cardDiv = cardDivsArray[i];
        cardDiv.addEventListener ('click', () => {
            buildModalHTML (user, i); 
            closeModalContainer ();
        });
    } 
}

/**
 * A function to check status of the request 
 * @param {object} response 
 */
function checkStatus (response) {
    if (response.ok) {
        return Promise.resolve (response)
    } else {
        return Promise.reject (new Error (response.statusText));
    }
}

// Fetch data from Random User Generator  
fetch ('https://randomuser.me/api/?nat=dk,fr,gb,ch,de,no,ca,us&results=12')
    .then (checkStatus)
    .then (response => response.json ())
    .then (object => {
        const profiles = object.results; // access the array of profiles 
        profiles.forEach (profile => {
            buildHTML (profile); // biuld a card for each profile
        });
        showModalHTML (profiles); // show a modal container for the clicked card 
    })
    .catch (error => console.error ('Oh no! Something went wrong!', error));

// Create message that is displayed if search has no results
const notFoundMessage = buildElement ('h1', 'not-found-message', galleryDiv);
notFoundMessage.innerHTML = 'Sorry, the employee is not found.'; 
notFoundMessage.style.display = 'none'; 
 
/**
 * A function to search for employess 
 */
function searchBar () {
    let notMatched = []; 
    const searchInput = document.querySelector ('#search-input'); // select input element   
    const cardDiv = document.querySelectorAll ('.card'); // select all cards
    for (let i = 0; i < cardDiv.length; i ++) { // compare the searched value with the name of each employee  
        const employeesNames = cardDiv[i].lastElementChild.firstElementChild; 
        if (employeesNames.textContent.toLowerCase ().indexOf (searchInput.value.toLowerCase ()) > -1) {
            cardDiv[i].style.display = '';  
        } else {
            cardDiv[i].style.display = 'none'; 
            notMatched.push (cardDiv[i]); 
        }
    }
    // Show the error message only if all the employees don't match 
    if (notMatched.length < 12) { 
        notFoundMessage.style.display = 'none';
    } else {
        notFoundMessage.style.display = ''; 
    } 
}

// A handler for the search button
document.querySelector ('#search-submit').addEventListener ('click', (event) => {
    event.preventDefault ();
    searchBar ();
});

// A handler for the search input
document.querySelector ('#search-input').addEventListener ('input', () => {
    searchBar ();
});
