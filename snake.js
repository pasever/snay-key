const ROWS = 30;
const COLUMNS = 50;
const canvas = document.getElementById('canvas');
const h1 = document.getElementById('title');
h1.style.textAlign = 'center';

canvas.style.width = '500px';
canvas.style.height = '300px';
canvas.style.border = '5px solid black';
canvas.style.boxSizing = 'content-box';
canvas.style.position  = 'relative';
canvas.style.marginLeft  = 'auto';
canvas.style.marginRight  = 'auto';

const START = document.getElementById('start');
START.style.marginTop = '10px'

const PAUSE = document.getElementById('pause');
PAUSE.style.marginTop = '10px'

const COUNTER_REF = document.getElementById('counter');
let counter = 0;

// each square will have format '0-24'

let SQUARES = new Map();
let CURRENT_DIRECTION = 'r';
let CURRENT_SEED;
let INITIAL_POSITION = [
    '1-1',
    '1-2',
    '1-3',
    '1-4',
    '1-5'
];

let currentPosition = [];
let interval;
let gamePaused = false;

function initSnake() {
    startInterval();
    initKeyListeners();
    START.style.display = 'none';
    setTimeout(() => seedBlock(), 500);
}

function seedBlock() {
    const x = Math.floor(Math.random() * ROWS);
    const y = Math.floor(Math.random() * COLUMNS);
    CURRENT_SEED = x + '-' + y;
    SQUARES.get(CURRENT_SEED).style.background = 'black';
    // return x + '-' + y;
}

function initKeyListeners() {
    document.addEventListener('keydown', event => {
        switch (event.key) {
            case 'e':
            case 'ArrowUp':
                if (CURRENT_DIRECTION !== 'd') {
                    CURRENT_DIRECTION = 'u';
                }
                break;
            case 'f':
            case 'ArrowRight':
                if (CURRENT_DIRECTION !== 'l') {
                    CURRENT_DIRECTION = 'r';
                }
                break;
            case 's':
            case 'ArrowLeft':
                if (CURRENT_DIRECTION !== 'r') {
                    CURRENT_DIRECTION = 'l';
                }
                break;
            case 'd':
            case 'ArrowDown':
                if (CURRENT_DIRECTION !== 'u') {
                    CURRENT_DIRECTION = 'd';
                }
                break;
            default:
                break;
        }
    });
}

function startInterval() {
    interval =  setInterval(() => updateSnakePosition(), 100);
}

function setInitialPosition() {
    for (let i = 0; i < INITIAL_POSITION.length; i++) {
        SQUARES.get(INITIAL_POSITION[i]).style.background = 'black';
        currentPosition.push(INITIAL_POSITION[i]);
    }
}

function updateSnakePosition() {
    let tail = currentPosition.shift();
    let head = currentPosition[currentPosition.length - 1];

    if (head === CURRENT_SEED) {
        currentPosition.push(tail);
        COUNTER_REF.innerText = 'Count: ' + ++counter;

        seedBlock();
    }
    let newHead;
    const map = head.split('-');
    if (legalPosition(map)) {
        switch (CURRENT_DIRECTION) {
            case 'r':
                newHead = map[0] + '-' + (+map[1] + 1);
                break;
            case 'd':
                newHead = (+map[0] + 1) + '-' + (+map[1]);
                break;
            case 'l':
                newHead = map[0] + '-' + (+map[1] - 1);
                break;
            case 'u':
                newHead = (+map[0] - 1) + '-' + (+map[1]);
                break;
            default:
                break;
        }

        SQUARES.get(newHead).style.background = 'black';
        SQUARES.get(tail).style.background = 'initial';
        currentPosition.push(newHead);
    } else {
        gameOver();
    }
}

function legalPosition(map) {
    return +map[0] + 1 < ROWS && +map[1] + 1 < COLUMNS;
}

function gameOver() {
    clearInterval(interval);
    canvas.style.border = '8px solid red';
    gamePaused = false;
    START.style.display = 'inline';
    PAUSE.style.display = 'none';
}


function drawCanvas() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS; j++) {
            const square = document.createElement('div');
            square.style.position = 'absolute';
            square.style.padding  = '5px'
            square.style.border   = '1px solid #A9A9A9';
            square.style.left     = `${j * 10}px`;
            square.style.top   = `${i * 10}px`;
            let position = i + '-' + j;
            SQUARES.set(position, square);
            canvas.appendChild(square);
        }
    }

    setInitialPosition();

    START.addEventListener('click', () => initSnake());
    PAUSE.addEventListener('click', () => pauseSnake());
}

function pauseSnake() {
    if (gamePaused) {
        startInterval()
        gamePaused = false;
        PAUSE.innerText = 'Pause';
    } else {
        clearInterval(interval);
        gamePaused = true;
        PAUSE.innerText = 'Resume';
    }
}

drawCanvas();
