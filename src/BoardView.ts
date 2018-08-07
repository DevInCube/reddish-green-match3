import { CellCoords, BoardModel } from "./BoardController";
import { BulbModel } from "./Bulb";

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
