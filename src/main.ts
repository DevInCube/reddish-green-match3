import { generateBoard } from "./generateBoard";
import { BoardController, CellCoords } from "./BoardController";

import * as PIXI from "pixi.js";
import { bii } from "./Bi";
import { BulbView } from "./Bulb";

const bicolors = [{
    left: "red",
    right: "red",
}, {
    left: "red",
    right: "red",
}, {
    left: "blue",
    right: "blue",
}, {
    left: "blue",
    right: "blue",
}, {
    left: "green",
    right: "green",
}, {
    left: "green",
    right: "green",
}, {
    left: "yellow",
    right: "yellow",
}, {
    left: "yellow",
    right: "yellow",
}, {
    left: "green",
    right: "red",
}, {
    left: "red",
    right: "green",
}];

const boardModel = generateBoard(10, 10, bicolors);

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const app = new PIXI.Application({
    view: canvas,
    width: canvas.width,
    height: canvas.height,
});

const height = app.renderer.height;
const width = app.renderer.width / 2;

const container = {
    left: new PIXI.Container(),
    right: new PIXI.Container(),
};

container.left.x = width / 2;
container.left.y = height / 2;
app.stage.addChild(container.left);

container.right.x = width + width / 2;
container.right.y = height / 2;
app.stage.addChild(container.right);

BulbView.loadResources(app.renderer);

const boardController = new BoardController(boardModel, container);

for (const monoContainer of bii(container)) {
    monoContainer.pivot.x = monoContainer.width / 2;
    monoContainer.pivot.y = monoContainer.height / 2;
}

boardController.run();
