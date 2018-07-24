import { Bicolor, bicolorEquals } from "./Bicolor";
import { BoardModel } from "./model";
import { generateBoard } from "./generateBoard";
import { getRandomElement } from "./utils/misc";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
const ctx = canvas.getContext("2d")!;

const width = canvas.width / 2;

let mousePressed = false;

const cellSize = 32;

class Cell {
    color: Bicolor;

    constructor(color: Bicolor) {
        this.color = color;
    }
}

class CellCoords {
    column: number;
    row: number;

    constructor(r: number, c: number) {
        this.row = r;
        this.column = c;
    }

    valid(b: BoardModel) {
        return this.row >= 0
            && this.row < b.rows
            && this.column >= 0
            && this.column < b.columns;
    }

    copy() {
        return new CellCoords(this.row, this.column);
    }
}

class Chunk {
    coords: CellCoords;
    length: number;

    constructor(coords: CellCoords, length: number) {
        this.coords = coords;
        this.length = length;
    }
}

type CellU = Cell | undefined;

class BoardController {

    constructor(
        public model: BoardModel,
    ) {
    }

    findChunks(): number {
        let counter = 0;
        for (let i = 0; i < this.model.rows; i++) {
            let startJ = 0;
            for (let j = 1; j <= this.model.columns; j++) {
                const prevCell = this.model.cells[i][j - 1] as Cell;
                const cell = j === this.model.columns ? undefined : this.model.cells[i][j] as Cell;
                if (!cell || !prevCell || !bicolorEquals(cell.color, prevCell.color)) {
                    const chunkLen = j - startJ;
                    if (chunkLen > 2) {
                        for (let jj = startJ; jj < startJ + chunkLen; jj++) {
                            this.model.cells[i][jj] = undefined;
                        }
                        counter += 1;
                    }
                    startJ = j;
                }
            }
        }
        for (let j = 0; j < this.model.columns; j++) {
            let startI = 0;
            for (let i = 1; i <= this.model.rows; i++) {
                const prevCell = this.model.cells[i - 1][j];
                const cell = i === this.model.rows ? undefined : this.model.cells[i][j];
                if (!cell || !prevCell || !bicolorEquals(cell.color, prevCell.color)) {
                    const chunkLen = i - startI;
                    if (chunkLen > 2) {
                        for (let ii = startI; ii < startI + chunkLen; ii++) {
                            this.model.cells[ii][j] = undefined;
                        }
                        counter += 1;
                    }
                    startI = i;
                }
            }
        }
        return counter;
    }

    moveCell(coords: CellCoords, newCoords: CellCoords) {
        if (newCoords.valid(this.model)) {
            const tmp = this.model.cells[coords.row][coords.column];
            this.model.cells[coords.row][coords.column] = this.model.cells[newCoords.row][newCoords.column];
            this.model.cells[newCoords.row][newCoords.column] = tmp;
        }
    }

    shake() {
        let counter = 0;
        for (let i = this.model.rows - 1; i >= 0; i--) {
            for (let j = 0; j < this.model.columns; j++) {
                if (i === 0 && !this.model.cells[i][j]) {
                    this.model.cells[i][j] = new Cell(getRandomElement(this.model.bicolors));
                    counter += 1;
                    break;
                }
                if (!this.model.cells[i][j]) {
                    this.moveCell(new CellCoords(i, j), new CellCoords(i - 1, j));
                    if (i - 1 === 0 && !this.model.cells[i - 1][j]) {
                        this.model.cells[i - 1][j] = new Cell(getRandomElement(this.model.bicolors));
                    }
                    counter += 1;
                }
            }
        }
        return counter;
    }
}

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

    function drawCell(cell: Cell | undefined, i: number, j: number) {
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
    rightColor: "yellow",
}, {
    leftColor: "yellow",
    rightColor: "green",
}, {
    leftColor: "blue",
    rightColor: "yellow",
}, {
    leftColor: "yellow",
    rightColor: "blue",
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
