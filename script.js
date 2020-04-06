
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
 */
function buildModalHTML (user, i) { 
    const date = new Date (user[i].dob.date); // create and formate the birthday date 
    const day = date.getDate ();
    const month = date.getMonth () + 1; 
    const year = date.getFullYear ();
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
        <p class="modal-text">${user[i].location.street.number} ${user[i].location.street.name}, ${user[i].location.state}, ${user[i].location.country} ${user[i].location.postcode}</p>
        <p class="modal-text">Birthday: ${birthday}</p>`;
    const modalButtonContainer = buildElement ('div', 'modal-btn-container', modalContainer);
    modalButtonContainer.innerHTML = `
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        <button type="button" id="modal-next" class="modal-next btn">Next</button>`; 
    const modalButtons = Array.from (modalButtonContainer.children); 
    modalButtons.forEach (modalButton => {
        modalButton.addEventListener ('click', (event) => {
            if (event.target && modalButton.textContent === 'Prev') {
                documentBody.removeChild (modalContainer);
                buildModalHTML (user, i - 1); 
            } else if (event.target && modalButton.textContent === 'Next') {
                documentBody.removeChild (modalContainer);
                buildModalHTML (user, i + 1); 
            }
        });
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
 * A function to fetch data 
 * @param {string} url - URL-address to fetch the data  
 */
function fetchData (url) {
    return fetch (url)
        .then (checkStatus)
        .then (resp => resp.json ())
        .catch (error => console.error ('Oh no! Something is wrong!', error)); 
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

fetchData ('https://randomuser.me/api/?results=12')
    .then (object => {
        const profiles = object.results; // access the array of profiles 
        console.log (profiles);
        profiles.forEach (profile => {
            buildHTML (profile); 
        });
        showModalHTML (profiles); 
    })

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

function closeModalContainer () {
    document.querySelector ('#modal-close-btn').addEventListener ('click', () => { 
        documentBody.removeChild (modalContainer);
    });
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
