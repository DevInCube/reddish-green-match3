import { BoardModel, CellModel } from "./model";
import { generateBoard } from "./generateBoard";
import { BoardController, CellCoords } from "./BoardController";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
const ctx = canvas.getContext("2d")!;

const width = canvas.width / 2;

let mousePressed = false;

const cellSize = 32;

function draw(context: CanvasRenderingContext2D, b: BoardModel, viewSideRight: boolean) {
    const ox = 0 + (viewSideRight ? width : 0);
    const ocx = ox + width / 2;
    const bWidth = cellSize * b.columns;
    const bHeight = cellSize * b.rows;
    const ocy = bHeight / 2;

    const obx = ocx - bWidth / 2;
    const oby = ocy - bHeight / 2;

    context.strokeStyle = "black";
    context.strokeRect(obx, oby, bWidth, bHeight);

    for (let i = 0; i < b.rows; i++) {
        for (let j = 0; j < b.columns; j++) {
            const cell = b.cells[i][j];
            drawCell(cell, i, j);
        }
    }

    function drawCell(cell: CellModel | undefined, i: number, j: number) {
        context.strokeStyle = "black";
        context.strokeRect(obx + j * cellSize, oby + i * cellSize, cellSize, cellSize);
        context.fillStyle = !cell ? "black" : (viewSideRight ? cell.color.rightColor : cell.color.leftColor);
        context.fillRect(obx + j * cellSize, oby + i * cellSize, cellSize, cellSize);
    }
}

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
const board = new BoardController(generateBoard(10, 10, bicolors));

function refresh() {
    draw(ctx, board.model, false);
    draw(ctx, board.model, true);
}

function shakeUntil() {
    while (true) {
        while (board.shake()) {
            //
        }
        while (board.findChunks()) {
            //
        }
        if (board.shake() === 0) { break; }
    }
}

shakeUntil();
refresh();

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

function findCellCoords(x: number, y: number): CellCoords | undefined {
    const b = board;
    const viewSideRight = false;
    //
    const ox = 0 + (viewSideRight ? width : 0);
    const ocx = ox + width / 2;
    const bWidth = cellSize * b.model.columns;
    const bHeight = cellSize * b.model.rows;
    const ocy = bHeight / 2;

    const obx = ocx - bWidth / 2;
    const oby = ocy - bHeight / 2;
    if (x >= obx && x <= obx + bWidth && y >= oby && y <= oby + bHeight) {
        x -= obx;
        y -= oby;
        const i = Math.trunc(y / cellSize);
        const j = Math.trunc(x / cellSize);
        return new CellCoords(i, j);
    }
    return undefined;
}

canvas.addEventListener("mouseup", e => {
    const x = e.offsetX;
    const y = e.offsetY;

    const mdCellCoords = findCellCoords(mdX, mdY);
    const muCellCoords = findCellCoords(x, y);
    if (mdCellCoords && muCellCoords) {
        const dx = muCellCoords.column - mdCellCoords.column;
        const dy = muCellCoords.row - mdCellCoords.row;
        const newCoords = mdCellCoords.copy();
        if (Math.abs(dx) > Math.abs(dy)) {
            newCoords.column += Math.sign(dx);
        } else {
            newCoords.row += Math.sign(dy);
        }
        board.moveCell(mdCellCoords, newCoords);

        if (!board.findChunks()) {
            board.moveCell(newCoords, mdCellCoords);
        } else {
            shakeUntil();
        }
        refresh();
    }

    mousePressed = false;
});
