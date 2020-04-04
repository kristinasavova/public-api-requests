
const galleryDiv = document.querySelector ('#gallery');
const documentBody = document.querySelector ('body');
const script = document.querySelector ('script'); 

let cardDivs = []; 

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
    cardDiv.innerHTML = `
        <div class="card-img-container">
        <img class="card-img" src=${user.picture.large} alt="profile picture">
        </div>
        <div class="card-info-container">
        <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
        <p class="card-text">${user.email}</p>
        <p class="card-text cap">${user.location.city}, ${user.location.country}</p>`;
        
        cardDivs.push (cardDiv); 
        for (let i = 0; i < cardDivs.length; i ++) { // add unique index attribute to each card
            cardDivs[i].setAttribute ('index', i);
        }
    
    cardDiv.addEventListener ('click', (event) => {
        
        console.log (event.currentTarget.getAttribute ('index')); 
        
        const modalContainer = document.createElement ('div'); // create modal container 
        modalContainer.className = 'modal-container';  
        documentBody.insertBefore (modalContainer, script); // append modal container to body
        modalContainer.innerHTML = `
            <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
            <img class="modal-img" src=${user.picture.large} alt="profile picture">
            <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
            <p class="modal-text">${user.email}</p>
            <p class="modal-text cap">${user.location.city}</p><hr>
            <p class="modal-text">${user.cell}</p>
            <p class="modal-text">${user.location.street.number} ${user.location.street.name}, ${user.location.state}, ${user.location.country} ${user.location.postcode}</p>
            <p class="modal-text">Birthday: ${user.dob.date.slice (0, 10)}</p>`;
        const modalButtonContainer = buildElement ('div', 'modal-btn-container', modalContainer);
        modalButtonContainer.innerHTML = `
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>`
        
        document.querySelector ('#modal-close-btn').addEventListener ('click', () => { // close the modal container 
            documentBody.removeChild (modalContainer);
        });

        document.querySelector ('#modal-prev').addEventListener ('click', () => {
            
        });

        document.querySelector ('#modal-next').addEventListener ('click', () => {
            
        });
    });
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
