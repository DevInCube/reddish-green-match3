import { getRandomElement } from "./utils/misc";
import { BoardModel } from "./model";
import { Bicolor } from "./Bicolor";

export function generateBoard(rowCount: number, columnCount: number, bicolors: Bicolor[]): BoardModel {
    return {
        rowCount,
        columnCount,
        cells: Array.from(
            { length: columnCount },
            (_, column) => Array.from(
                { length: rowCount },
                (__, row) => ({
                    bulb: {
                        color: getRandomElement(bicolors),
                        position: {
                            row,
                            column,
                        },
                        isAppearing: false,
                        isDisappearing: false,
                        isFalling: false,
                    },
                }))),
        bicolors,
    };
}
