'use strict';

// Create a class

const colorNames = {
    "#09f": "Blue",
    "#9f0": "Green",
    "#f90": "Orange",
    "#f09": "Pink",
    "#90f": "Purple"
};

class Shape {
    constructor(colour, name) {
        this._colour = colour;
        this._name = name;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get colour() {
        return this._colour;
    }

    set colour(value) {
        this._colour = value;
    }

    getInfo() {
        const colorName = colorNames[this._colour]; 
        return `${colorName} ${this._name}`; 
    }
}

// Create shape

const createButton = document.querySelector('.create');
const storageBoxOne = document.querySelector('.storage-one');
const storageBoxTwo = document.querySelector('.storage-two');
const storageBoxThree = document.querySelector('.storage-three');
const storageBoxFour = document.querySelector('.storage-four');
const infoOfShape = document.querySelector('.information');
const shapesArray = [];


function createShape() {
    const shapeType = document.querySelector('.shape-select').value;
    const colour = document.querySelector('.colour-select').value;
    const colourName = colorNames[colour]; 

    if (shapesArray.length >= 24) {
        infoOfShape.innerText = 'Storage is full!'
        return; 
    } else {
        infoOfShape.innerText = '';
    }

    if (shapeType === '' || colour === '') {
        infoOfShape.innerText = 'Please choose a shape and a colour!';
        return;
    } else {
        infoOfShape.innerText = '';
    }

    const shape = new Shape(colour, shapeType);
    shapesArray.push(shape);

    const shapeDiv = document.createElement('div');
    shapeDiv.classList.add('shape', shapeType);
    shapeDiv.style.backgroundColor = colour;

    shapeDiv.addEventListener('click', () => {
        infoOfShape.innerText = `Unit ${shapesArray.indexOf(shape) + 1}: ${shape.getInfo()}`;
    });

    if (shapesArray.indexOf(shape) < 6)  return storageBoxOne.appendChild(shapeDiv);
    if (shapesArray.indexOf(shape) < 12) return storageBoxTwo.appendChild(shapeDiv);
    if (shapesArray.indexOf(shape) < 18) return storageBoxThree.appendChild(shapeDiv);
    
    return storageBoxFour.appendChild(shapeDiv);    
}

createButton.addEventListener('click', createShape);
