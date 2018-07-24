import { getRandomElement } from "./utils/misc";

export interface Bicolor {
    leftColor: string;
    rightColor: string;
}

export function bicolorEquals(bicolor1: Bicolor, bicolor2: Bicolor) {
    return (bicolor1.leftColor === bicolor2.leftColor && bicolor1.rightColor === bicolor2.rightColor
        || bicolor1.leftColor === bicolor2.rightColor && bicolor1.rightColor === bicolor2.leftColor);
}
