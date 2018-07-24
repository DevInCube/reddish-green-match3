import { getRandomElement } from "./utils/misc";

export interface Color {
    leftColor: string;
    rightColor: string;
}

export function colorEquals(color1: Color, color2: Color) {
    return (color1.leftColor === color2.leftColor && color1.rightColor === color2.rightColor
        || color1.leftColor === color2.rightColor && color1.rightColor === color2.leftColor);
}

const colors = [{
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

export function getRandomColor(): Color {
    return getRandomElement(colors);
}
