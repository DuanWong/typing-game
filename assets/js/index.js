'use strict';

import { listen, select, wordBank } from './utility.js';

/*--------------------------------------------*/
/*Create a class                              */
/*--------------------------------------------*/

class Score {
    #date;
    #hits;
    #percentage;

    constructor(date, hits, percentage) {
        this.#date = date;
        this.#hits = hits;
        this.#percentage = percentage;
    }

    getDate() {
        return this.#date;
    }

    getHits() {
        return this.#hits;
    }

    getPercentage() {
        return this.#percentage;
    }
}

/*--------------------------------------------*/
/*Object, Variables, DOM                      */
/*--------------------------------------------*/

let gameWords = [];
let currentIndex;
let hits;
let timer;
let interval;

const gameBtn = select('.game-btn');
const timerDisplay = select('.timer');
const hitsDisplay = select('.hits');
const wordDisplay = select('.word-display');
const inputField = select('.input');
const bgMusic = select('.bg-music');
const hoverSound = new Audio('assets/audio/loaded.mp3');
const checkSound = new Audio('assets/audio/shot.mp3');
const resultSound = new Audio('assets/audio/result.mp3');
const failSound = new Audio('assets/audio/fail.mp3');
const modal = select('.modal');
const scoreRecord = select('.score-record');
const dialog = select('dialog');
const highScores = select('.high-scores');

/*--------------------------------------------*/
/*Functions                                   */
/*--------------------------------------------*/

function flashTimer() {
    let flashes = 4; 
    let interval = 200; 

    for (let i = 0; i < flashes; i++) {
        setTimeout(() => {
            timerDisplay.style.opacity = timerDisplay.style.opacity === "1" ? "0" : "1";
        }, i * interval); 
    }

    timerDisplay.style.opacity = 1;
}

function updateTimer() {
    if (timer > 0) {
        timer--;
        timerDisplay.innerText = `${timer}`;

        if (timer <= 10) {
            flashTimer();
            timerDisplay.style.color = '#e80e19';
        }
    } else {
        clearInterval(interval);
        endGame();
    }
}

function shuffle(array) {
    return [...array].sort(() => Math.random() - 0.5);
}

function initializeGame() {
    clearInterval(interval);
    gameWords = shuffle([...wordBank]);
    bgMusic.currentTime = 0;
    timerDisplay.style.color = '#10c97c';

    currentIndex = 0;
    hits = 0;
    timer = 15;

    hitsDisplay.innerText = '0 HIT(s)';
    timerDisplay.innerText = '15';
    inputField.disabled = true;
    inputField.value = '';
    dialog.close();
}

function startGame() {
    initializeGame();

    inputField.disabled = false;
    inputField.style.cursor = 'pointer';
    inputField.placeholder = 'Enter the word';
    inputField.classList.add('playing');
    wordDisplay.innerText = gameWords[currentIndex];
    inputField.focus();
    bgMusic.play();
    gameBtn.innerText = 'RESTART'; 

    interval = setInterval(updateTimer, 1000);
}

function checkWord() {
    if (inputField.value.trim().toLowerCase() === gameWords[currentIndex].toLowerCase()) {
        hits++;
        hitsDisplay.innerText = `${hits} HIT(s)`;
        inputField.value = '';
        checkSound.play();
        currentIndex++;
        if (currentIndex < gameWords.length) {
            wordDisplay.innerText = gameWords[currentIndex];
        } else {
            endGame();
        }
    }
}

function endGame() {
    clearInterval(interval);

    bgMusic.pause();
    bgMusic.currentTime = 0;
    inputField.disabled = true;
    inputField.value = '';
    inputField.placeholder = 'Press START to play again!';
    inputField.classList.remove('playing');
    inputField.style.cursor = 'not-allowed';

    let percentage = (hits / gameWords.length) * 100;

    const formattedDate = new Date().toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    const gameScore = new Score(formattedDate, hits, percentage.toFixed(1));

    if (hits > 0) {
        processData(gameScore);
        displayScores(gameScore);
        modal.style.display = 'flex'
        resultSound.play();
        displayData();
        dialog.showModal();
    } else {
        failSound.play();
    }

    wordDisplay.innerText = 'Game Over!';
    gameBtn.innerText = 'START'; 
}

function restartGame() {
    initializeGame();
    startGame();
}

function displayScores(gameScore) {
    scoreRecord.innerHTML = ''; 

    if (gameScore) {
        const scoreElement = document.createElement('div');
        scoreElement.classList.add('score-item');

        scoreElement.innerHTML = `
            <p>${gameScore.getHits()} Hits</p>
            <p>${gameScore.getPercentage()}%</p>
        `;

        scoreRecord.appendChild(scoreElement);
    }
}

function processData(gameScore) {
    const existingDataStr = localStorage.getItem('top10');
    const gameData = existingDataStr ? JSON.parse(existingDataStr) : [];

    gameData.push({
        date: gameScore.getDate(),
        hits: gameScore.getHits(),
        percentage: gameScore.getPercentage()
    });

    gameData.sort((a, b) => b.hits - a.hits);

    const storageData = gameData.slice(0, 10);
    const storageDataStr = JSON.stringify(storageData);
    localStorage.setItem('top10', storageDataStr);
}

function displayData() {
    highScores.innerHTML = ''; 

    const displayDataStr = localStorage.getItem('top10');
    const displayData = displayDataStr ? JSON.parse(displayDataStr) : [];

    if (displayData.length === 0) {
        highScores.innerHTML = '<p>No games have been played</p>';
        return;
    }
    
    displayData.forEach((item, index) => {
        const topElement = document.createElement('div');
        topElement.classList.add('top-item');

        topElement.innerHTML = 
          `
            <p>#${(index + 1).toString().padStart(2, '0')}</p>
            <p>${item.hits} Hits</p>
            <p>${item.percentage}%</p>
            <p>${item.date}</p>
          `;
        highScores.appendChild(topElement);
    });
}

/*--------------------------------------------*/
/*EventListener                               */
/*--------------------------------------------*/

listen(gameBtn, 'click', () => {
    if (gameBtn.innerText === 'START') {
        startGame();
    } else {
        restartGame();
    }
});

listen(inputField, 'input', checkWord);

listen(gameBtn, 'click', () => {
    hoverSound.play();
});

listen(modal, 'click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
        dialog.close();
    }
});

listen(document, 'keydown', function(event) {
    if (event.key === 'Escape' && modal.style.display === 'flex') {
        modal.style.display = 'none';
    }
});

listen(dialog, 'click', function(event) {
    const rect = this.getBoundingClientRect();

    if (event.clientY < rect.top || event.clientY > rect.bottom || 
        event.clientX < rect.left || event.clientX > rect.right) {
        dialog.close();
        modal.style.display = 'none';
    }
});

listen(window, 'load', function() {
    displayData();
    dialog.showModal();
});