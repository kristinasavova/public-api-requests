
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

/**
 * A function that renders created HTML on the page
 * @param {string} picture - profile picture
 * @param {string} name - employee's first name  
 * @param {string} surname - employee's last name  
 * @param {string} email - employee's email 
 * @param {string} city - employee's city 
 * @param {string} state - employee's country 
 */
function renderHTMLCard (picture, name, surname, email, city, state) {
    const cardDiv = buildElement ('div', 'card', galleryDiv); // create a card div
    const cardImageContainer = buildElement ('div', 'card-img-container', cardDiv); // create image div  
    const cardInfoContainer = buildElement ('div', 'card-info-container', cardDiv); // create info div 
    const cardImage = buildElement ('img', 'card-img', cardImageContainer); // create image  
    cardImage.setAttribute ('src', picture); 
    cardImage.setAttribute ('alt', 'profile picture');
    cardInfoContainer.innerHTML = `
        <h3 id="name" class="card-name cap">${name} ${surname}</h3>
        <p class="card-text">${email}</p>
        <p class="card-text cap">${city}, ${state}</p>
    `}

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
            const profilePicture = profiles[i].picture.thumbnail; // access thumbnail pictures 
            const profileName = profiles[i].name.first; // access first name
            const profileLastName = profiles[i].name.last; // access last name 
            const profileEmail = profiles[i].email; // access email 
            const profileCity = profiles[i].location.city; // access city
            const profileState = profiles[i].location.country; // access country 
            renderHTMLCard (profilePicture, profileName, profileLastName, profileEmail, profileCity, profileState); 
        }      
    })



