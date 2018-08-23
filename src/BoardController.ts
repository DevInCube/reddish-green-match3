import { Bicolor } from "./Bicolor";
import { getRandomElement, Nullable } from "./utils/misc";
import { BulbController, BulbModel } from "./Bulb";
import { Bi } from "./Bi";

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

export interface BoardModel {
    rowCount: number;
    columnCount: number;
    bulbs: BulbModel[];
    bicolors: Bicolor[];
}

export class BoardController {

    bulbs: BulbController[];

    constructor(
        public model: BoardModel,
        public container: Bi<PIXI.Container>,
    ) {
        this.bulbs = [];
        for (const bulb of this.model.bulbs) {
            if (bulb) {
                this.addBulbController(new BulbController(bulb, container));
            }
        }
    }

    startSwapBulb?: BulbController = undefined;

    addBulbController(bulb: BulbController) {
        this.bulbs.push(bulb);
        bulb.on("startswap", () => this.startSwapBulb = bulb);
        bulb.on("endswap", () => {
            if (this.startSwapBulb) {
                this.swap(this.startSwapBulb, bulb);
                this.startSwapBulb = undefined;
            }
        });
    }

    removeBulbController(bulb: BulbController) {
        this.bulbs.splice(this.bulbs.indexOf(bulb, 1));
        bulb.off("startswap");
        bulb.off("endswap");
    }

    _buildGrid(): Array<Array<Nullable<BulbController>>> {
        const grid: Array<Array<Nullable<BulbController>>> = Array.from(
            { length: this.model.columnCount },
            () => Array.from(
                { length: this.model.rowCount },
                () => null));

        for (const bulb of this.bulbs) {
            grid[bulb.model.column][bulb.model.row] = bulb;
        }

        return grid;
    }

    findChunks(): number {
        const grid = this._buildGrid();

        let counter = 0;
        for (let i = 0; i < this.model.rowCount; i++) {
            let startJ = 0;
            for (let j = 1; j <= this.model.columnCount; j++) {
                const prevBulb = grid[j - 1][i];
                const bulb = j === this.model.columnCount ? undefined : grid[j][i];
                if (!bulb || !prevBulb || !bicolorEquals(bulb.model.color, prevBulb.model.color)) {
                    const chunkLen = j - startJ;
                    if (chunkLen > 2) {
                        for (let jj = startJ; jj < startJ + chunkLen; jj++) {
                            grid[jj][i]!.disappear();
                            this.model.bulbs.splice(this.model.bulbs.indexOf(grid[jj][i]!.model), 1);
                            this.removeBulbController(grid[jj][i]!);
                            grid[jj][i] = null;
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
                const prevBulb = grid[j][i - 1];
                const bulb = i === this.model.rowCount ? undefined : grid[j][i];
                if (!bulb || !prevBulb || !bicolorEquals(bulb.model.color, prevBulb.model.color)) {
                    const chunkLen = i - startI;
                    if (chunkLen > 2) {
                        for (let ii = startI; ii < startI + chunkLen; ii++) {
                            grid[j][ii]!.disappear();
                            this.model.bulbs.splice(this.model.bulbs.indexOf(grid[j][ii]!.model), 1);
                            this.removeBulbController(grid[j][ii]!);
                            grid[j][ii] = null;
                        }
                        counter += 1;
                    }
                    startI = i;
                }
            }
        }
        return counter;
    }

    swap(bulb1: BulbController, bulb2: BulbController) {
        const dRow = (bulb1.model.row - bulb2.model.row);
        const dColumn = (bulb1.model.column - bulb2.model.column);
        const dSqr = dRow * dRow + dColumn * dColumn;

        if (dSqr !== 1) {
            return;
        }

        {
            const tmpRow = bulb2.model.row;
            const tmpColumn = bulb2.model.column;
            bulb2.model.row = bulb1.model.row;
            bulb2.model.column = bulb1.model.column;
            bulb1.model.row = tmpRow;
            bulb1.model.column = tmpColumn;
        }

        const chunksCount = this.run();

        if (chunksCount === 0) {
            {
                const tmpRow = bulb2.model.row;
                const tmpColumn = bulb2.model.column;
                bulb2.model.row = bulb1.model.row;
                bulb2.model.column = bulb1.model.column;
                bulb1.model.row = tmpRow;
                bulb1.model.column = tmpColumn;
            }
        }
    }

    run() {
        const chunksCount = this.findChunks();

        while (true) {
            while (this.shake() > 0) {
                //
            }

            if (this.findChunks() === 0) {
                return chunksCount;
            }
        }
    }

    shake() {
        const grid = this._buildGrid();

        let counter = 0;
        for (let column = 0; column < this.model.columnCount; column++) {
            for (let row = this.model.rowCount - 1; row >= 0; row--) {
                if (row === 0 && !grid[column][row]) {
                    const newBulb = new BulbController(
                        BulbController.createModel(getRandomElement(this.model.bicolors), column),
                        this.container);
                    this.addBulbController(newBulb);
                    this.model.bulbs.push(newBulb.model);
                    grid[column][row] = newBulb;
                    counter += 1;
                    break;
                }
                if (!grid[column][row]) {
                    if (grid[column][row - 1]) {
                        grid[column][row - 1]!.fall();
                    }
                    if (row - 1 === 0 && !grid[column][row - 1]) {
                        const newBulb = new BulbController(
                            BulbController.createModel(getRandomElement(this.model.bicolors), column),
                            this.container);
                        this.addBulbController(newBulb);
                        this.model.bulbs.push(newBulb.model);
                        grid[column][row - 1] = newBulb;
                    }
                    counter += 1;
                }
            }
        }
        return counter;
    }
}
