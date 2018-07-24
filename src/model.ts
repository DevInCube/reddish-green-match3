import { Bicolor } from "./Bicolor";

export interface CellModel {
    color: Bicolor;
}

export interface BoardModel {
    rowCount: number;
    columnCount: number;
    cells: Array<Array<CellModel | undefined>>;
    bicolors: Bicolor[];
}
