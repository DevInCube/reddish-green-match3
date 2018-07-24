import { getRandomElement } from "./utils/misc";

export interface Bicolor {
    leftColor: string;
    rightColor: string;
}

export function bicolorEquals(bicolor1: Bicolor, bicolor2: Bicolor) {
    return (bicolor1.leftColor === bicolor2.leftColor && bicolor1.rightColor === bicolor2.rightColor
        || bicolor1.leftColor === bicolor2.rightColor && bicolor1.rightColor === bicolor2.leftColor);
}

const bicolors = [{
    leftColor: "red",
    rightColor: "red",
}, {
    leftColor: "blue",
    rightColor: "blue",
}, {
    leftColor: "green",
    rightColor: "green",
}, {
    leftColor: "yellow",
    rightColor: "yellow",
}, {
    leftColor: "green",
    rightColor: "yellow",
}, {
    leftColor: "yellow",
    rightColor: "green",
}, {
    leftColor: "blue",
    rightColor: "yellow",
}, {
    leftColor: "yellow",
    rightColor: "blue",
}];

export function getRandomBicolor(): Bicolor {
    return getRandomElement(bicolors);
}
