const galleryDiv = document.querySelector ('#gallery');

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

const searchDiv = document.querySelector ('.search-container'); // create div for the search bar
const searchForm = document.createElement ('form'); // create search form 
searchForm.setAttribute ('action', '#');
searchForm.setAttribute ('method', 'get');
searchDiv.appendChild (searchForm);
searchForm.innerHTML = ` 
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">`

/**
 * A function that creates and renders cards of employees on the page
 */
function buildHTML (user) {
    const cardDiv = buildElement ('div', 'card', galleryDiv); // create a card div
    const cardImageContainer = buildElement ('div', 'card-img-container', cardDiv); // create image div  
    const cardInfoContainer = buildElement ('div', 'card-info-container', cardDiv); // create info div 
    const cardImage = buildElement ('img', 'card-img', cardImageContainer); // create image  
    cardImage.setAttribute ('src', user.picture.large); 
    cardImage.setAttribute ('alt', 'profile picture');
    cardInfoContainer.innerHTML = `
        <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
        <p class="card-text">${user.email}</p>
        <p class="card-text cap">${user.location.city}, ${user.location.country}</p>`
    cardDiv.addEventListener ('click', () => { // show model container if card is clicked
        const modalContainer = document.createElement ('div'); // create modal container 
        modalContainer.className = 'modal-container';  
        const documentBody = document.querySelector ('body');
        const script = document.querySelector ('script'); 
        documentBody.insertBefore (modalContainer, script); // append modal container to body
        const modalDiv = buildElement ('div', 'modal', modalContainer); // create modal div
        const modalButton = buildElement ('button', 'modal-close-btn', modalDiv); // create modal button 
        modalButton.setAttribute ('type', 'button'); 
        modalButton.setAttribute ('id', 'modal-close-btn'); 
        modalButton.innerHTML = '<strong>X</strong>'; 
        modalButton.addEventListener ('click', () => { // hide modal container if close button is clicked
            modalContainer.style.display = 'none'; 
        });
        const modalInfoContainer = buildElement ('div', 'modal-info-container', modalDiv); 
        modalInfoContainer.innerHTML = `
            <img class="modal-img" src=${user.picture.large} alt="profile picture">
            <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
            <p class="modal-text">${user.email}</p>
            <p class="modal-text cap">${user.location.city}</p><hr>
            <p class="modal-text">${user.cell}</p>
            <p class="modal-text">${user.location.street.number} ${user.location.street.name}, ${user.location.state}, ${user.location.country} ${user.location.postcode}</p>
            <p class="modal-text">Birthday: ${user.dob.date.slice (0, 10)}</p>
    `});
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
        for (let i = 0; i < profiles.length; i ++) {
            const employee = profiles[i]; 
            buildHTML (employee);
        }      
    })

const notFoundMessage = buildElement ('h1', 'not-found-message', galleryDiv);
notFoundMessage.innerHTML = 'Sorry, the employee is not found.'; 
notFoundMessage.style.display = 'none'; 
 
/**
 * A function to search for employess 
 */
function searchBar () {
    const searchInput = document.querySelector ('#search-input'); // select input element   
    const cardDiv = document.querySelectorAll ('.card'); // select all cards
    for (let i = 0; i < cardDiv.length; i ++) { // compare the searched value with the name of each employee  
        const employeesNames = cardDiv[i].lastElementChild.firstElementChild; 
        if (employeesNames.textContent.toLowerCase ().indexOf (searchInput.value.toLowerCase ()) > -1) {
            notFoundMessage.style.display = 'none';
            cardDiv[i].style.display = ''; 
        } else {
            cardDiv[i].style.display = 'none'; 
            notFoundMessage.style.display = '';  
        }
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




