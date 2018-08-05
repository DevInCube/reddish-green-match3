import { CellCoords } from "./BoardController";
import { CellModel, BoardModel } from "./model";

export class BoardView {
    static CELL_SIZE = 32;

    constructor(
        public context: CanvasRenderingContext2D,
        public isRight: boolean,
        public x: number,
        public y: number,
        public model: BoardModel,
    ) {

    }

    renderCell(cell: CellModel, i: number, j: number) {
        this.context.strokeStyle = "black";
        this.context.strokeRect(
            this.x + j * BoardView.CELL_SIZE, this.y + i * BoardView.CELL_SIZE,
            BoardView.CELL_SIZE, BoardView.CELL_SIZE);
        this.context.fillStyle = !cell.bulb
            ? "black"
            : (this.isRight ? cell.bulb.color.rightColor : cell.bulb.color.leftColor);
        this.context.fillRect(
            this.x + j * BoardView.CELL_SIZE, this.y + i * BoardView.CELL_SIZE,
            BoardView.CELL_SIZE, BoardView.CELL_SIZE);
    }

    render() {
        this.context.strokeStyle = "black";
        this.context.strokeRect(
            this.x, this.y,
            BoardView.CELL_SIZE * this.model.columnCount, BoardView.CELL_SIZE * this.model.rowCount);

        for (let i = 0; i < this.model.rowCount; i++) {
            for (let j = 0; j < this.model.columnCount; j++) {
                const cell = this.model.cells[i][j];
                this.renderCell(cell, i, j);
            }
        }
    }

    findCellCoords(x: number, y: number): CellCoords | undefined {
        if (x >= this.x && x <= this.x + BoardView.CELL_SIZE * this.model.columnCount
            && y >= this.y && y <= this.y + BoardView.CELL_SIZE * this.model.rowCount
        ) {
            x -= this.x;
            y -= this.y;
            const i = Math.trunc(y / BoardView.CELL_SIZE);
            const j = Math.trunc(x / BoardView.CELL_SIZE);
            return new CellCoords(i, j);
        }
        return undefined;
    }
}
