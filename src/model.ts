import { Bicolor } from "./Bicolor";
import { BulbModel } from "./Bulb";

export interface CellModel {
    bulb?: BulbModel;
}

export interface BoardModel {
    rowCount: number;
    columnCount: number;
    cells: CellModel[][];
    bicolors: Bicolor[];
}
