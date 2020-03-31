
const galleryDiv = document.querySelector ('#gallery'); 

/**
 * Create HTML elements 
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



const data = fetch ('https://randomuser.me/api/')
    .then (data => data.json ())
    .then (data => {
         
     })
    
console.log (data);


        

