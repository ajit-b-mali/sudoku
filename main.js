/**
 *  @type HTMLCanvasElement
*/

import Sudoku from "./scripts/genrateSudoku.js";

const canvas = document.getElementById('gameBoard');
const ctx = canvas.getContext('2d');
const playerCanvas = document.getElementById('player');
const ptx = playerCanvas.getContext('2d');
const guideCanvas = document.getElementById('guide');
const gtx = guideCanvas.getContext('2d');
let click = true;
const canvasSize = 504;

canvas.width = canvasSize;
canvas.height = canvasSize;
playerCanvas.width = canvasSize;
playerCanvas.height = canvasSize;
guideCanvas.width = canvasSize;
guideCanvas.height = canvasSize;
gtx.fillStyle = "green";

const offSet = canvas.getBoundingClientRect();

const cellCount = 9;
const cellSize = canvasSize / cellCount;
const clearCell = cellSize / 3;
let cellX = null;
let cellY = null;
let animationSpeed = cellSize / 7;
let exitGame = false;
const sudoku = new Sudoku(9, 81-35);


const guide = {
    x: 0,
    y: 0,
    tempX: 0,
    tempY: 0,
}


// const check = document.getElementById('check');
// check.addEventListener('click', _ => {
//     if(sudoku.checkSudoku()){
//         alert("Correct Ans");
//         exitGame = true;
//     }else{
//         alert("WrongAns");
//     }
// });

function init(){
    sudoku.fillValues();
    highlighter();
    drawBorders();
    createGame();
    ctx.fillStyle = 'green';
    sudoku.playerArr = sudoku.tempArr;
}

function draw(){
    ptx.clearRect(0, 0, canvasSize, canvasSize);
    if(guide.x < guide.tempX) guide.x += animationSpeed;
    if(guide.x > guide.tempX) guide.x -= animationSpeed;
    if(guide.y < guide.tempY) guide.y += animationSpeed;
    if(guide.y > guide.tempY) guide.y -= animationSpeed;

    highlighter(guide.x, guide.y);
    requestAnimationFrame(draw);
}

function createGame(){
    sudoku.mat.forEach((row, y) => {
        row.forEach((_ , x) => {
            if(sudoku.mat[y][x] != 0)
            writeNumber(x, y, sudoku.mat[y][x]);
        })
    });
}

function drawBorders(){
    for(let i = 0; i < cellCount + 1; i++){
        for(let j = 0; j < cellCount + 1; j++){
            ctx.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize)
        }
    }
    for(let i = 0; i < cellCount + 1; i++){
        for(let j = 0; j < cellCount + 1; j++){
            ctx.clearRect(i * cellSize - clearCell / 2, j * cellSize - clearCell / 2, clearCell, clearCell)
        }
    }
    for(let i = 0; i < cellCount / 3; i++){
        for(let j = 0; j < cellCount / 3; j++){
            ctx.lineWidth = 4;
            ctx.strokeRect(i * cellSize * 3, j * cellSize * 3, cellSize * 3, cellSize * 3)
        }
    }
}
function highlighter(x, y){
    ptx.fillStyle = 'gold';
    ptx.globalAlpha = .5;
    ptx.shadowColor = 'gold';
    ptx.shadowBlur = 20;
    ptx.fillRect(x, 0, cellSize, canvasSize);
    ptx.fillRect(0, y, canvasSize, cellSize);
}


function clearHighlightCell() {
    for (let i = 0; i < sudoku.sameArr[0].length; i++) {
        let x = sudoku.sameArr[1][i];
        let y = sudoku.sameArr[0][i];
        gtx.clearRect(x * cellSize, y * cellSize, cellSize, cellSize)
    }
}

function highlightCell(){
    for (let i = 0; i < sudoku.sameArr[0].length; i++) {
        let x = sudoku.sameArr[1][i];
        let y = sudoku.sameArr[0][i];
        gtx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        console.log(sudoku.sameArr[0][i], sudoku.sameArr[1][i])
    }
}

function writeNumber(cellX, cellY, txt) {
    ctx.clearRect(cellX * cellSize +  5, cellY * cellSize + 5, cellSize * .8, cellSize * .8);
    ctx.font = 'bold ' + cellSize * .9 + 'px courier'
    ctx.fillText(txt, cellX * cellSize + cellSize * .24, cellY * cellSize + cellSize * .8);
}


document.addEventListener('keydown', (e) => {
    if(!exitGame){
        if(e.key > 0 && !sudoku.oriMat[cellY][cellX] && click){
            const txt = e.key;
            writeNumber(cellX, cellY, txt);
            sudoku.mat[cellY][cellX] = parseInt(e.key);
        }
        
        if(e.key == 'f' && click){
            sudoku.findTwin(sudoku.mat[cellY][cellX]);
            highlightCell();
        }
        
        if(e.key == 'e' && !sudoku.oriMat[cellY][cellX] && click) {
            sudoku.mat[cellY][cellX] = 0;
            ctx.clearRect(cellX * cellSize +  5, cellY * cellSize + 5, cellSize * .8, cellSize * .8);
        }
        click = false;
    }
});

document.addEventListener('keyup', _ => {
    click = true;
    clearHighlightCell()
})
playerCanvas.addEventListener('mousemove', (e) => {
    let x = e.x - offSet.x;
    let y = e.y - offSet.y;
    if(x < 500)
    guide.tempX = x - (x % cellSize);
    if(y < 500)
    guide.tempY = y - (y % cellSize);
    
    cellX = Math.floor(guide.tempX / cellSize);
    cellY = Math.floor(guide.tempY / cellSize);
});
// const help = document.getElementById('help');
// help.addEventListener('click', _ => {
//     sudoku.help();
//     console.log(sudoku.mat);
//     console.log(sudoku.ansMat);
//     console.log(sudoku.oriMat);
//     console.log(sudoku.sameArr);
//     console.log(sudoku.checkSudoku())
// });

init();
draw();
