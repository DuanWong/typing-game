'use strict';

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

    getFormattedDate() {
        return this.#date.toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}

/*--------------------------------------------*/
/*Object, Variables, DOM                      */
/*--------------------------------------------*/

const wordBank = [
    'dinosaur', 'love', 'pineapple', 'calendar', 'robot', 'building',
    'population', 'weather', 'bottle', 'history', 'dream', 'character', 'money',
    'absolute', 'discipline', 'machine', 'accurate', 'connection', 'rainbow',
    'bicycle', 'eclipse', 'calculator', 'trouble', 'watermelon', 'developer',
    'philosophy', 'database', 'periodic', 'capitalism', 'abominable', 'phone',
    'component', 'future', 'pasta', 'microwave', 'jungle', 'wallet', 'canada',
    'velvet', 'potion', 'treasure', 'beacon', 'labyrinth', 'whisper', 'breeze',
    'coffee', 'beauty', 'agency', 'chocolate', 'eleven', 'technology',
    'alphabet', 'knowledge', 'magician', 'professor', 'triangle', 'earthquake',
    'baseball', 'beyond', 'evolution', 'banana', 'perfume', 'computer',
    'butterfly', 'discovery', 'ambition', 'music', 'eagle', 'crown',
    'chess', 'laptop', 'bedroom', 'delivery', 'enemy', 'button', 'door', 'bird',
    'superman', 'library', 'unboxing', 'bookstore', 'language', 'homework',
    'beach', 'economy', 'interview', 'awesome', 'challenge', 'science',
    'mystery', 'famous', 'league', 'memory', 'leather', 'planet', 'software',
    'update', 'yellow', 'keyboard', 'window', 'beans', 'truck', 'sheep',
    'blossom', 'secret', 'wonder', 'enchantment', 'destiny', 'quest', 'sanctuary',
    'download', 'blue', 'actor', 'desk', 'watch', 'giraffe', 'brazil',
    'audio', 'school', 'detective', 'hero', 'progress', 'winter', 'passion',
    'rebel', 'amber', 'jacket', 'article', 'paradox', 'social', 'resort',
    'mask', 'escape', 'promise', 'band', 'level', 'hope', 'moonlight', 'media',
    'orchestra', 'volcano', 'guitar', 'raindrop', 'inspiration', 'diamond',
    'illusion', 'firefly', 'ocean', 'cascade', 'journey', 'laughter', 'horizon',
    'exploration', 'serendipity', 'infinity', 'silhouette', 'wanderlust',
    'marvel', 'nostalgia', 'serenity', 'reflection', 'twilight', 'harmony',
    'symphony', 'solitude', 'essence', 'melancholy', 'melody', 'vision',
    'silence', 'whimsical', 'eternity', 'cathedral', 'embrace', 'poet', 'ricochet',
    'mountain', 'dance', 'sunrise', 'dragon', 'adventure', 'galaxy', 'echo',
    'fantasy', 'radiant', 'serene', 'legend', 'starlight', 'light', 'pressure',
    'bread', 'cake', 'caramel', 'juice', 'mouse', 'charger', 'pillow', 'candle',
    'film', 'jupiter'
   ];
let gameWords = [];
let scores = [];
let currentIndex;
let hits;
let timer;
let interval;

const gameBtn = document.querySelector('.game-btn');
const timerDisplay = document.querySelector('.timer');
const hitsDisplay = document.querySelector('.hits');
const wordDisplay = document.querySelector('.word-display');
const inputField = document.querySelector('.input');
const bgMusic = document.querySelector('.bg-music');
const hoverSound = new Audio('assets/audio/loaded.mp3');
const checkSound = new Audio('assets/audio/shot.mp3');
const resultSound = new Audio('assets/audio/result.mp3');
const modal = document.querySelector('.modal');
const scoreHistory = document.querySelector('.score-history');

/*--------------------------------------------*/
/*Game                                        */
/*--------------------------------------------*/

function initializeGame() {
    clearInterval(interval);
    gameWords = [...wordBank].sort(() => 0.5 - Math.random()).slice(0, 10);
    currentIndex = 0;
    hits = 0;
    timer = 20;
    hitsDisplay.innerText = '0 HIT(s)';
    timerDisplay.innerText = '20';
    inputField.disabled = true;
    inputField.value = '';
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

function updateTimer() {
    if (timer > 0) {
        timer--;
        timerDisplay.innerText = `${timer}`;
    } else {
        endGame();
    }
}

function checkWord() {
    if (inputField.value.trim() === gameWords[currentIndex]) {
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
    inputField.placeholder = 'Press RESTART to play again!';
    inputField.classList.remove('playing');
    inputField.style.cursor = 'not-allowed';

    let percentage = (hits / gameWords.length) * 100;
    const gameScore = new Score(new Date(), hits, percentage.toFixed(1));
    scores.unshift(gameScore);

    displayScores();

    modal.style.display = 'flex'; 

    wordDisplay.innerText = 'Game Over!';
    resultSound.play();
}

function restartGame() {
    initializeGame();
    startGame();
}

gameBtn.addEventListener('click', () => {
    if (gameBtn.innerText === 'START') {
        startGame();
    } else {
        restartGame();
    }
});
inputField.addEventListener('input', checkWord);

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        endGame();
    }
});

/*--------------------------------------------*/
/*Sound                                       */
/*--------------------------------------------*/

gameBtn.addEventListener('click', () => {
    hoverSound.play();
});

/*--------------------------------------------*/
/*Modal                                       */
/*--------------------------------------------*/

function displayScores() {
    scoreHistory.innerHTML = ''; 

    const recentScores = scores.slice(-6);
    recentScores.forEach((score, index) => {
        const scoreElement = document.createElement('div');
        scoreElement.classList.add('score-item');

        const formattedDate = score.getFormattedDate();
        const hits = score.getHits();
        const percentage = score.getPercentage();

        scoreElement.innerHTML = `
            <p>${hits} Hits</p>
            <p>${percentage}%</p>
            <p>${formattedDate}</p>
        `;

        scoreHistory.appendChild(scoreElement);
    });
}

modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});
