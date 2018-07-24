import { generateBoard } from "./generateBoard";
import { BoardController, CellCoords } from "./BoardController";
import { BoardView } from "./BoardView";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
const ctx = canvas.getContext("2d")!;

const width = canvas.width / 2;

let mousePressed = false;

const bicolors = [{
    leftColor: "red",
    rightColor: "red",
}, {
    leftColor: "blue",
    rightColor: "blue",
}, {
    leftColor: "green",
    rightColor: "green",
}, {
    leftColor: "yellow",
    rightColor: "yellow",
}, {
    leftColor: "green",
    rightColor: "red",
}, {
    leftColor: "red",
    rightColor: "green",
}];
const boardController = new BoardController(generateBoard(10, 10, bicolors));

const leftBoardView = new BoardView(ctx, false, 0, 0, boardController.model);
const rightBoardView = new BoardView(ctx, true, width, 0, boardController.model);

function render() {
    leftBoardView.render();
    rightBoardView.render();
}

function shakeUntil() {
    while (true) {
        while (boardController.shake()) {
            //
        }
        while (boardController.findChunks()) {
            //
        }
        if (boardController.shake() === 0) { break; }
    }
}

shakeUntil();
render();

let mdX = 0;
let mdY = 0;
canvas.addEventListener("mousedown", e => {

    const x = e.offsetX;
    const y = e.offsetY;

    mdX = x;
    mdY = y;
});

canvas.addEventListener("mousemove", e => {
    if (mousePressed) {
        //
    }
});

canvas.addEventListener("mouseup", e => {
    const x = e.offsetX;
    const y = e.offsetY;

    const mdCellCoords = leftBoardView.findCellCoords(mdX, mdY) || rightBoardView.findCellCoords(mdX, mdY);
    const muCellCoords = leftBoardView.findCellCoords(x, y) || rightBoardView.findCellCoords(x, y);
    if (mdCellCoords && muCellCoords) {
        const dx = muCellCoords.column - mdCellCoords.column;
        const dy = muCellCoords.row - mdCellCoords.row;
        const newCoords = new CellCoords(mdCellCoords.row, mdCellCoords.column);
        if (Math.abs(dx) > Math.abs(dy)) {
            newCoords.column += Math.sign(dx);
        } else {
            newCoords.row += Math.sign(dy);
        }
        boardController.moveCell(mdCellCoords, newCoords);

        if (!boardController.findChunks()) {
            boardController.moveCell(newCoords, mdCellCoords);
        } else {
            shakeUntil();
        }
        render();
    }

    mousePressed = false;
});
