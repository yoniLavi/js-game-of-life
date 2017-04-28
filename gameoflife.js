const ROWS = 60;
const COLS = 100;
const TICK_DURATION = 150;
const INITIAL_LIVE_FRACTION = 0.2;

var Board = null;
var BoardTick = null;

function initialiseBoard(svgId) {
    // set the global Board object
    Board = document.getElementById(svgId);

    var cellHeight = Board.height.baseVal.value / ROWS;
    var cellWidth = Board.width.baseVal.value / COLS;
    var boardHtml = '';
    for (var row=0; row<ROWS; row++) {
        for (var col=0; col<COLS; col++) {
            boardHtml += 
                `<rect id="${row}-${col}" 
                 x="${col*cellWidth}" y="${row*cellHeight}"
                 width="${cellWidth}" height="${cellHeight}"/>`;
        }
    }
    Board.innerHTML = boardHtml;
}

function getCell(row, col) {
    return Board.getElementById(`${row}-${col}`);
}

function isAlive(row, col) {
    var cell = getCell(row, col);
    if (cell) {
        return cell.classList.contains('alive');
    } else {
        return false;
    }
}

function liveNighbourCount(row, col) {
    return isAlive(row-1, col-1) + isAlive(row-1, col) + isAlive(row-1, col+1)
         + isAlive(row, col-1)   +                       isAlive(row, col+1)
         + isAlive(row+1, col-1) + isAlive(row+1, col) + isAlive(row+1, col+1);
}

function willLive(row, col) {
    var alive = isAlive(row, col);
    var neighbours = liveNighbourCount(row, col);
    return neighbours === 3 || neighbours === 2 && alive;
}

function generateBoardState(liveFunc) {
    var stateArray = [];
    for (var row=0; row<ROWS; row++) {
        var newRow = [];
        for (var col=0; col<COLS; col++) {
            newRow.push(liveFunc(row, col));
        }
        stateArray.push(newRow);
    }
    return stateArray;
}

function setCellState(cell, alive) {
    if (alive) {
        cell.classList.add('alive');
    } else {
        cell.classList.remove('alive');
    }
}

function setBoardState(boardArray) {
    for (var row=0; row<ROWS; row++) {
        for (var col=0; col<COLS; col++) {
            setCellState(getCell(row, col), boardArray[row][col]);
        }
    }
}

function randomBoardState() {
    return generateBoardState(function() {
        return Math.random() < INITIAL_LIVE_FRACTION;
    });
}

function tick() {
    setBoardState(generateBoardState(willLive));
}

function play() {
    // Enable the ticking, unless already started before
    if (!BoardTick) {
        BoardTick = setInterval(tick, TICK_DURATION);
    }
}

function runGoL() {
    setBoardState(randomBoardState());
    play();
}
