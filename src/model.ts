import { Bicolor } from "./Bicolor";

export interface CellModel {
    color: Bicolor;
}

export interface BoardModel {
    rows: number;
    columns: number;
    cells: Array<Array<CellModel | undefined>>;
    bicolors: Bicolor[];
}
