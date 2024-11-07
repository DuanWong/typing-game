'use strict';

// Create a class

class Contact {
    #name;
    #city;
    #email;

    constructor(name, city, email) {
        this.#name = name;
        this.#city = city;
        this.#email = email;
    }

    get name() {
        return this.#name;
    }

    get city() {
        return this.#city;
    }

    get email() {
        return this.#email;
    }
}

// DOM Elements

const errorMessage = document.querySelector('.error-message');
const inputField = document.querySelector('.input');
const addButton = document.querySelector('.add');
const contactsContainer = document.querySelector('.contacts-container');
const contactsCount = document.querySelector('.count');

// Functions for validation

function validateInputInfo(inputInfo) {
    if (inputInfo.length < 3) {
        errorMessage.innerText = 
        'Please enter the complete information and separate them with commas!'
        return false; 
    } else {
        errorMessage.innerText = '';
        return true;
    }
}

function isAlphabetOnly(str) {
    const alphabetRegex = /^[A-Za-z]+$/;

    if (!alphabetRegex.test(str)) {
        errorMessage.innerText = 'Name or city should be composed of letters!'
        return false;
    } else {
        errorMessage.innerText = '';
        return true;
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        errorMessage.innerText = 'The email address is wrong!'
        return false;
    } else {
        errorMessage.innerText = '';
        return true;
    }
}

// Create new contacts

const contactsArray = [];

function addContact() {
    const input = inputField.value;
    const inputInfo = input.split(',').map(item => item.trim());

    if (!validateInputInfo(inputInfo)) return;
    const [contactName, contactCity, contactEmail] = inputInfo;
    if (!isAlphabetOnly(contactName) || !isAlphabetOnly(contactCity)) return;
    if (!validateEmail(contactEmail)) return;

    const contact = new Contact(contactName, contactCity, contactEmail);
    const contactDiv = document.createElement('div');
    contactDiv.classList.add('contact-box');
    
    contactsArray.unshift(contact);
    listContacts(contactDiv, contact);
    contactsContainer.insertBefore(contactDiv, contactsContainer.firstChild);

    inputField.value = '';
    calcContacts();

    contactDiv.addEventListener('click', function() {
        removeContact(contactDiv, contact);
    });
}

function listContacts(contactDiv, contact) {
    contactDiv.innerHTML = `
    <p>Name: ${contact.name}</p>
    <p>City: ${contact.city}</p>
    <p>Email: ${contact.email}</p>
`;
}

function removeContact(contactDiv, contact) {
    contactsContainer.removeChild(contactDiv); 

        const index = contactsArray.indexOf(contact);
        if (index > -1) {
            contactsArray.splice(index, 1);
        }

        calcContacts();
}

addButton.addEventListener('click', addContact);

// Calculate contacts

function calcContacts() {
    contactsCount.innerText = contactsArray.length;
}

window.addEventListener('load', calcContacts());