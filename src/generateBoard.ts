import { getRandomElement } from "./utils/misc";
import { Bicolor } from "./Bicolor";
import { BoardModel } from "./BoardController";
import { BulbModel } from "./Bulb";

export function generateBoard(rowCount: number, columnCount: number, bicolors: Bicolor[]): BoardModel {
    const bulbs: BulbModel[] = [];
    for (let column = 0; column < columnCount; column++) {
        for (let row = 0; row < rowCount; row++) {
            bulbs.push({
                color: getRandomElement(bicolors),
                row,
                column,
            });
        }
    }

    return {
        rowCount,
        columnCount,
        bulbs,
        bicolors,
    };
}
