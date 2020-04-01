
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

const cardDiv = buildElement ('div', 'card', galleryDiv);
const cardImageContainer = buildElement ('div', 'card-img-container', cardDiv); 
const cardInfoContainer = buildElement ('div', 'card-info-container', cardDiv); 
const cardImage = buildElement ('img', 'card-img', cardImageContainer); 

/**
 * A function to fetch data 
 * @param {object} url - URL-address to fetch the data  
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
    .then (data => console.log (data));




