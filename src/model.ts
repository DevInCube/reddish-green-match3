import { Bicolor } from "./Bicolor";

export interface CellModel {
    color: Bicolor | undefined;
}

export interface BoardModel {
    rowCount: number;
    columnCount: number;
    cells: CellModel[][];
    bicolors: Bicolor[];
}
