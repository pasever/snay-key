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
START.style.marginLeft = 'auto';
START.style.marginRight = 'auto';
START.style.display = 'block';
START.style.marginTop = '10px'

const PAUSE = document.getElementById('pause');
PAUSE.style.marginLeft = 'auto';
PAUSE.style.marginRight = 'auto';
PAUSE.style.display = 'block';
PAUSE.style.marginTop = '10px'

// each square will have format '0-24'

let PIXELS = new Map();
let CURRENT_DIRECTION = 'r';
let INITIAL_POSITION = [
    '0-0',
    '0-1',
    '0-2',
    '0-3',
    '0-4'
];

let currentPosition = [];
let interval;
let gamePaused = false;

function initSnake() {
    startInterval();
    initKeyListeners();
    START.style.display = 'none';
}

function initKeyListeners() {
    document.addEventListener('keypress', event => {
        switch (event.key) {
            case 'e':
                CURRENT_DIRECTION = 'u';
                break;
            case 'f':
                CURRENT_DIRECTION = 'r';
                break;
            case 's':
                CURRENT_DIRECTION = 'l';
                break;
            case 'd':
                CURRENT_DIRECTION = 'd';
                break;
            default:
                break;
        }
    });
}

function startInterval() {
    interval =  setInterval(() => {
        updateSnakePosition();
    }, 100);
}

function setInitialPosition() {
    for (let i = 0; i < INITIAL_POSITION.length; i++) {
        PIXELS.get(INITIAL_POSITION[i]).style.background = 'black';
        currentPosition.push(INITIAL_POSITION[i]);
    }
}

// function toMapKey(head) {
//     return '0-' + (+head.split('-')[1] + 1);
// }

function updateSnakePosition() {
    let tail = currentPosition.shift();
    let head = currentPosition[currentPosition.length - 1];
    let newHead;
    const map = head.split('-');

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

    PIXELS.get(newHead).style.background = 'black';
    PIXELS.get(tail).style.background = 'initial';
    currentPosition.push(newHead);
}

function gameOver() {

}


function drawCanvas() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS; j++) {
            const pixel = document.createElement('div');
            pixel.style.position = 'absolute';
            pixel.style.padding  = '5px'
            pixel.style.border   = '1px solid gray';
            pixel.style.left     = `${j * 10}px`;
            pixel.style.top   = `${i * 10}px`;
            // pixel.style.width = '10px'
            // pixel.style.height = '10px'
            let position = i + '-' + j;
            PIXELS.set(position, pixel);
            canvas.appendChild(pixel);
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
