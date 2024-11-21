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
const failSound = new Audio('assets/audio/fail.mp3');
const modal = document.querySelector('.modal');
const scoreRecord = document.querySelector('.score-record');

/*--------------------------------------------*/
/*Timer                                       */
/*--------------------------------------------*/

function flashTimer() {
    timerDisplay.style.opacity = "1";
    setTimeout(() => {
        timerDisplay.style.opacity = "0"; 
        setTimeout(() => {
            timerDisplay.style.opacity = "1"; 
            setTimeout(() => {
                timerDisplay.style.opacity = "0";
                setTimeout(() => {
                    timerDisplay.style.opacity = "1";
                }, 200);
            }, 200);
        }, 200);
    }, 200);
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

/*--------------------------------------------*/
/*Shuffle the words                           */
/*--------------------------------------------*/

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/*--------------------------------------------*/
/*Play game                                   */
/*--------------------------------------------*/

function initializeGame() {
    clearInterval(interval);
    gameWords = shuffle([wordBank]);
    bgMusic.currentTime = 0;
    timerDisplay.style.color = '#10c97c';

    currentIndex = 0;
    hits = 0;
    timer = 15;

    hitsDisplay.innerText = '0 HIT(s)';
    timerDisplay.innerText = '15';
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
    const gameScore = new Score(new Date(), hits, percentage.toFixed(1));

    if (hits > 0) {
        scores.push(gameScore);
        displayScores();
        modal.style.display = 'flex'
        resultSound.play();
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

gameBtn.addEventListener('click', () => {
    if (gameBtn.innerText === 'START') {
        startGame();
    } else {
        restartGame();
    }
});
inputField.addEventListener('input', checkWord);

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && gameBtn.innerText === 'RESTART') {
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
    scoreRecord.innerHTML = ''; 

    const recentScores = scores.slice(-6);
    recentScores.forEach((score, index) => {
        const scoreElement = document.createElement('div');
        scoreElement.classList.add('score-item');

        const formattedDate = score.getFormattedDate();
        const hits = score.getHits();
        const percentage = score.getPercentage();

        scoreElement.innerHTML = `
            <p>#${index + 1}</p>
            <p>${hits} Hits</p>
            <p>${percentage}%</p>
            <p>${formattedDate}</p>
        `;

        scoreRecord.appendChild(scoreElement);
    });
}

modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modal.style.display === 'flex') {
        modal.style.display = 'none';
    }
});
