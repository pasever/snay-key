const ROWS = 65;
const COLUMNS = 50;
const canvas = document.getElementById('canvas');
const games = document.getElementById('games');

canvas.style.width = '900px';
canvas.style.height = '1170px';

const START = document.getElementById('start');
const PAUSE = document.getElementById('pause');
const COUNTER_REF = document.getElementById('counter');
let counter = 0;
let gamesCounter   = 0;
let pristine = true;

// each square will have format '0-24'

let SQUARES = new Map();
let CURRENT_DIRECTION = 'r';
let CURRENT_SEED = null;
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
    if (!pristine) {
        currentPosition.forEach(position => SQUARES.get(position).style.background = 'initial');
        currentPosition = [];
        setInitialPosition();
        CURRENT_DIRECTION = 'r';
        COUNTER_REF.innerText = 'Count: 0';
        canvas.style.border = '5px solid black';
        games.innerText = 'Games Played: ' + ++gamesCounter;

        if (CURRENT_SEED) {
            SQUARES.get(CURRENT_SEED).style.background = 'initial';
            CURRENT_SEED = undefined;
        }
    } else {
        // initKeyListeners();
        initButtonsListeners();
        initSwipeListeners();
    }

    startInterval();
    START.style.display = 'none';
    PAUSE.style.display = 'inline';
    setTimeout(() => seedBlock(), 500);
    counter = 0;
}

function seedBlock() {
    let attempts = 0;
    while (true) {
        const x = Math.floor(Math.random() * ROWS);
        const y = Math.floor(Math.random() * COLUMNS);
        CURRENT_SEED = x + '-' + y;
        attempts++;

        if (currentPosition.indexOf(CURRENT_SEED) < 0) {
            break;
        }
        if (attempts > 5000) {
            break;
        }
    }
    SQUARES.get(CURRENT_SEED).style.background = 'black';
}

function initButtonsListeners() {
    const upBtn = document.getElementById('up');
    upBtn.addEventListener('click', _ => up());
    const leftBtn = document.getElementById('left');
    leftBtn.addEventListener('click', _ => left());
    const rightBtn = document.getElementById('right');
    rightBtn.addEventListener('click', _ => right());
    const downBtn = document.getElementById('down');
    downBtn.addEventListener('click', _ => down());
}

function down() {
    if (CURRENT_DIRECTION !== 'u') {
        CURRENT_DIRECTION = 'd';
    }
}

function left() {
    if (CURRENT_DIRECTION !== 'r') {
        CURRENT_DIRECTION = 'l';
    }
}

function up() {
    if (CURRENT_DIRECTION !== 'd') {
        CURRENT_DIRECTION = 'u';
    }
}

function right() {
    if (CURRENT_DIRECTION !== 'l') {
        CURRENT_DIRECTION = 'r';
    }
}

function initSwipeListeners() {
    canvas.addEventListener('swiped-left', _ => left());
    canvas.addEventListener('swiped-right', _ => right());
    canvas.addEventListener('swiped-up', _ => up());
    canvas.addEventListener('swiped-down', _ => down());
}

function initKeyListeners() {
    document.addEventListener('keydown', event => {
        switch (event.key) {
            case 'e':
            case 'ArrowUp':
                event.preventDefault();
                up();
                break;
            case 'f':
            case 'ArrowRight':
                event.preventDefault();
                right();
                break;
            case 's':
            case 'ArrowLeft':
                event.preventDefault();
                left();
                break;
            case 'd':
            case 'ArrowDown':
                event.preventDefault();
                down(event);
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
    let tail = currentPosition[0];
    let head = currentPosition[currentPosition.length - 1];

    if (head === CURRENT_SEED) {
        currentPosition.push(tail);
        COUNTER_REF.innerText = 'Count: ' + ++counter;
        seedBlock();
    }

    let newHead;
    const map = head.split('-');
    switch (CURRENT_DIRECTION) {
        case 'r':
            if ((+map[1] + 1) < COLUMNS) {
                newHead = map[0] + '-' + (+map[1] + 1);
                updateHeadAndPosition(newHead, tail);
            } else {
                gameOver();
            }
            break;
        case 'd':
            if ((+map[0] + 1) < ROWS) {
                newHead = (+map[0] + 1) + '-' + (+map[1]);
                updateHeadAndPosition(newHead, tail);
            } else {
                gameOver();
            }
            break;
        case 'l':
            if (+map[1] - 1 >= 0) {
                newHead = map[0] + '-' + (+map[1] - 1);
                updateHeadAndPosition(newHead, tail);
            } else {
                gameOver();
            }
            break;
        case 'u':
            if (+map[0] - 1 >= 0) {
                newHead = (+map[0] - 1) + '-' + (+map[1]);
                updateHeadAndPosition(newHead, tail);
            } else {
                gameOver();
            }
            break;
        default:
            break;
    }
}

function updateHeadAndPosition(head, tail) {
    currentPosition.shift();
    SQUARES.get(head).style.background = 'black';
    SQUARES.get(tail).style.background = 'initial';
    currentPosition.push(head);
}

function gameOver() {
    clearInterval(interval);
    canvas.style.border = '8px solid red';
    START.style.display = 'inline';
    START.innerText = 'Restart';
    PAUSE.style.display = 'none';
    pristine = false;
}

function drawCanvas() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS; j++) {
            const square = document.createElement('div');
            square.style.position = 'absolute';
            square.style.padding  = '7px'
            square.style.border   = '1px solid #A9A9A9';
            square.style.left     = `${j * 18}px`;
            square.style.top   = `${i * 18}px`;
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
