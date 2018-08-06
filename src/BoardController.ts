import { BoardModel, CellModel } from "./model";
import { Bicolor } from "./Bicolor";
import { getRandomElement } from "./utils/misc";

function bicolorEquals(bicolor1: Bicolor, bicolor2: Bicolor) {
    return (bicolor1.left === bicolor2.left && bicolor1.right === bicolor2.right
        || bicolor1.left === bicolor2.right && bicolor1.right === bicolor2.left);
}

export class CellCoords {
    column: number;
    row: number;

    constructor(r: number, c: number) {
        this.row = r;
        this.column = c;
    }
}

export class BoardController {

    constructor(
        public model: BoardModel,
    ) {
    }

    findChunks(): number {
        let counter = 0;
        for (let i = 0; i < this.model.rowCount; i++) {
            let startJ = 0;
            for (let j = 1; j <= this.model.columnCount; j++) {
                const prevCell = this.model.cells[i][j - 1] as CellModel;
                const cell = j === this.model.columnCount ? undefined : this.model.cells[i][j] as CellModel;
                if (!cell || !cell.bulb || !prevCell || !prevCell.bulb
                    || !bicolorEquals(cell.bulb.color, prevCell.bulb.color)
                ) {
                    const chunkLen = j - startJ;
                    if (chunkLen > 2) {
                        for (let jj = startJ; jj < startJ + chunkLen; jj++) {
                            this.model.cells[i][jj].bulb = undefined;
                        }
                        counter += 1;
                    }
                    startJ = j;
                }
            }
        }
        for (let j = 0; j < this.model.columnCount; j++) {
            let startI = 0;
            for (let i = 1; i <= this.model.rowCount; i++) {
                const prevCell = this.model.cells[i - 1][j];
                const cell = i === this.model.rowCount ? undefined : this.model.cells[i][j];
                if (!cell || !cell.bulb || !prevCell || !prevCell.bulb
                    || !bicolorEquals(cell.bulb.color, prevCell.bulb.color)
                ) {
                    const chunkLen = i - startI;
                    if (chunkLen > 2) {
                        for (let ii = startI; ii < startI + chunkLen; ii++) {
                            this.model.cells[ii][j].bulb = undefined;
                        }
                        counter += 1;
                    }
                    startI = i;
                }
            }
        }
        return counter;
    }

    areCoordsValid(c: CellCoords) {
        return c.row >= 0
            && c.row < this.model.rowCount
            && c.column >= 0
            && c.column < this.model.columnCount;
    }

    moveCell(coords: CellCoords, newCoords: CellCoords) {
        if (this.areCoordsValid(newCoords)) {
            const tmp = this.model.cells[coords.row][coords.column];

            this.model.cells[coords.row][coords.column] = this.model.cells[newCoords.row][newCoords.column];
            if (this.model.cells[coords.row][coords.column].bulb) {
                this.model.cells[coords.row][coords.column].bulb!.position.row = coords.row;
                this.model.cells[coords.row][coords.column].bulb!.position.column = coords.column;
            }

            this.model.cells[newCoords.row][newCoords.column] = tmp;
            if (this.model.cells[newCoords.row][newCoords.column].bulb) {
                this.model.cells[newCoords.row][newCoords.column].bulb!.position.row = newCoords.row;
                this.model.cells[newCoords.row][newCoords.column].bulb!.position.column = newCoords.column;
            }
        }
    }

    shake() {
        let counter = 0;
        for (let i = this.model.rowCount - 1; i >= 0; i--) {
            for (let j = 0; j < this.model.columnCount; j++) {
                if (i === 0 && !this.model.cells[i][j].bulb) {
                    this.model.cells[i][j] = {
                        bulb: {
                            color: getRandomElement(this.model.bicolors),
                            position: {
                                row: j,
                                column: i,
                            },
                            isAppearing: false,
                            isDisappearing: false,
                            isFalling: false,
                        },
                    };
                    counter += 1;
                    break;
                }
                if (!this.model.cells[i][j].bulb) {
                    this.moveCell(new CellCoords(i, j), new CellCoords(i - 1, j));
                    if (i - 1 === 0 && !this.model.cells[i - 1][j].bulb) {
                        this.model.cells[i - 1][j] = {
                            bulb: {
                                color: getRandomElement(this.model.bicolors),
                                position: {
                                    row: j,
                                    column: i,
                                },
                                isAppearing: false,
                                isDisappearing: false,
                                isFalling: false,
                            },
                        };
                    }
                    counter += 1;
                }
            }
        }
        return counter;
    }
}
