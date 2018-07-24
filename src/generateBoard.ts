import { getRandomElement } from "./utils/misc";
import { BoardModel } from "./model";
import { Bicolor } from "./Bicolor";

export function generateBoard(rowCount: number, columnCount: number, bicolors: Bicolor[]): BoardModel {
    return {
        rowCount,
        columnCount,
        cells: Array.from(
            { length: columnCount },
            () => Array.from(
                { length: rowCount },
                () => ({
                    color: getRandomElement(bicolors),
                }))),
        bicolors,
    };
}
