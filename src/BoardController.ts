import { BoardModel, CellModel } from "./model";
import { Bicolor } from "./Bicolor";
import { getRandomElement } from "./utils/misc";

function bicolorEquals(bicolor1: Bicolor, bicolor2: Bicolor) {
    return (bicolor1.leftColor === bicolor2.leftColor && bicolor1.rightColor === bicolor2.rightColor
        || bicolor1.leftColor === bicolor2.rightColor && bicolor1.rightColor === bicolor2.leftColor);
}

export class CellCoords {
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

export class BoardController {

    constructor(
        public model: BoardModel,
    ) {
    }

    findChunks(): number {
        let counter = 0;
        for (let i = 0; i < this.model.rows; i++) {
            let startJ = 0;
            for (let j = 1; j <= this.model.columns; j++) {
                const prevCell = this.model.cells[i][j - 1] as CellModel;
                const cell = j === this.model.columns ? undefined : this.model.cells[i][j] as CellModel;
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
                    this.model.cells[i][j] = {
                        color: getRandomElement(this.model.bicolors),
                    };
                    counter += 1;
                    break;
                }
                if (!this.model.cells[i][j]) {
                    this.moveCell(new CellCoords(i, j), new CellCoords(i - 1, j));
                    if (i - 1 === 0 && !this.model.cells[i - 1][j]) {
                        this.model.cells[i - 1][j] = {
                            color: getRandomElement(this.model.bicolors),
                        };
                    }
                    counter += 1;
                }
            }
        }
        return counter;
    }
}
