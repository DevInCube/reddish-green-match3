import { generateBoard } from "./generateBoard";
import { BoardController, CellCoords } from "./BoardController";
import { BoardView } from "./BoardView";

import * as PIXI from "pixi.js";
import { BulbController, BulbView } from "./Bulb";



let mousePressed = false;

const bicolors = [{
    leftColor: "red",
    rightColor: "red",
}, {
    leftColor: "red",
    rightColor: "red",
}, {
    leftColor: "blue",
    rightColor: "blue",
}, {
    leftColor: "blue",
    rightColor: "blue",
}, {
    leftColor: "green",
    rightColor: "green",
}, {
    leftColor: "green",
    rightColor: "green",
}, {
    leftColor: "yellow",
    rightColor: "yellow",
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

const boardModel = generateBoard(10, 10, bicolors);

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
const ctx = canvas.getContext("2d")!;

const height = canvas.height;
const width = canvas.width / 2;

const app = new PIXI.Application({
    view: canvas,
    width: canvas.width,
    height: canvas.height,
    forceCanvas: true, // todo remove
});
const leftContainer = new PIXI.Container();
leftContainer.x = width / 2;
leftContainer.y = height / 2;
app.stage.addChild(leftContainer);

const rightContainer = new PIXI.Container();
rightContainer.x = width + width / 2;
rightContainer.y = height / 2;
app.stage.addChild(rightContainer);

BulbView.loadResources(app.renderer);

for (const row of boardModel.cells) {
    for (const bulb of row) {
        if (bulb.bulb) {
            // tslint:disable-next-line:no-unused-expression
            new BulbController(bulb.bulb, leftContainer, rightContainer);
        }
    }
}

leftContainer.pivot.x = leftContainer.width / 2;
leftContainer.pivot.y = leftContainer.height / 2;
rightContainer.pivot.x = rightContainer.width / 2;
rightContainer.pivot.y = rightContainer.height / 2;

const boardController = new BoardController(boardModel);

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
