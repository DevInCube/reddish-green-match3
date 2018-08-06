import { generateBoard } from "./generateBoard";
import { BoardController, CellCoords } from "./BoardController";
import { BoardView } from "./BoardView";

import * as PIXI from "pixi.js";
import { BulbController, BulbView } from "./Bulb";
import { bii } from "./Bi";

let mousePressed = false;

const bicolors = [{
    left: "red",
    right: "red",
}, {
    left: "red",
    right: "red",
}, {
    left: "blue",
    right: "blue",
}, {
    left: "blue",
    right: "blue",
}, {
    left: "green",
    right: "green",
}, {
    left: "green",
    right: "green",
}, {
    left: "yellow",
    right: "yellow",
}, {
    left: "yellow",
    right: "yellow",
}, {
    left: "green",
    right: "red",
}, {
    left: "red",
    right: "green",
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

const container = {
    left: new PIXI.Container(),
    right: new PIXI.Container(),
};

container.left.x = width / 2;
container.left.y = height / 2;
app.stage.addChild(container.left);

container.right.x = width + width / 2;
container.right.y = height / 2;
app.stage.addChild(container.right);

BulbView.loadResources(app.renderer);

for (const row of boardModel.cells) {
    for (const bulb of row) {
        if (bulb.bulb) {
            // tslint:disable-next-line:no-unused-expression
            new BulbController(bulb.bulb, container);
        }
    }
}

for (const monoContainer of bii(container)) {
    monoContainer.pivot.x = monoContainer.width / 2;
    monoContainer.pivot.y = monoContainer.height / 2;
}

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
