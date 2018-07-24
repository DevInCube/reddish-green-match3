import { getRandomElement } from "./utils/misc";
import { BoardModel } from "./model";
import { Bicolor } from "./Bicolor";

export function generateBoard(rows: number, columns: number, bicolors: Bicolor[]): BoardModel {
    return {
        rows,
        columns,
        cells: Array.from(
            { length: columns },
            () => Array.from(
                { length: rows },
                () => ({
                    color: getRandomElement(bicolors),
                }))),
        bicolors,
    };
}
