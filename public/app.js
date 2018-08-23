System.register("Bi", [], function (exports_1, context_1) {
    var __moduleName = context_1 && context_1.id;
    function* bii(bi) {
        yield bi.left;
        yield bi.right;
    }
    exports_1("bii", bii);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("Bicolor", [], function (exports_2, context_2) {
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("utils/misc", [], function (exports_3, context_3) {
    var __moduleName = context_3 && context_3.id;
    function isVisible(elt) {
        const style = window.getComputedStyle(elt);
        return (style.width !== null && +style.width !== 0)
            && (style.height !== null && +style.height !== 0)
            && (style.opacity !== null && +style.opacity !== 0)
            && style.display !== "none"
            && style.visibility !== "hidden";
    }
    exports_3("isVisible", isVisible);
    function adjust(x, ...applyAdjustmentList) {
        for (const applyAdjustment of applyAdjustmentList) {
            applyAdjustment(x);
        }
        return x;
    }
    exports_3("adjust", adjust);
    function getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    exports_3("getRandomElement", getRandomElement);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("Bulb", ["pixi.js", "Bi"], function (exports_4, context_4) {
    var PIXI, Bi_1, BulbController, BulbView;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [
            function (PIXI_1) {
                PIXI = PIXI_1;
            },
            function (Bi_1_1) {
                Bi_1 = Bi_1_1;
            }
        ],
        execute: function () {
            BulbController = class BulbController extends PIXI.utils.EventEmitter {
                constructor(model, container) {
                    super();
                    this.model = model;
                    this.view = {
                        left: new BulbView(this.model, true),
                        right: new BulbView(this.model, false),
                    };
                    container.left.addChild(this.view.left);
                    container.right.addChild(this.view.right);
                    for (const monoView of Bi_1.bii(this.view)) {
                        monoView.on("pointerdown", () => {
                            this.emit("startswap", this);
                        });
                        monoView.on("pointerup", () => {
                            this.emit("endswap", this);
                        });
                    }
                }
                static createModel(color, column) {
                    return {
                        color,
                        row: 0,
                        column,
                    };
                }
                fall() {
                    this.model.row++;
                }
                disappear() {
                    for (const monoView of Bi_1.bii(this.view)) {
                        monoView.removeSelf();
                    }
                }
            };
            exports_4("BulbController", BulbController);
            BulbView = class BulbView extends PIXI.Sprite {
                constructor(model, isLeft) {
                    super(BulbView.resources[isLeft ? model.color.left : model.color.right]);
                    this.model = model;
                    this.isLeft = isLeft;
                    this.interactive = true;
                }
                static loadResources(renderer) {
                    function generateBulbTexture(color) {
                        const bulbGraphics = new PIXI.Graphics();
                        bulbGraphics.beginFill(color);
                        bulbGraphics.drawCircle(BulbView.radius, BulbView.radius, BulbView.radius);
                        bulbGraphics.endFill();
                        return renderer.generateTexture(bulbGraphics);
                    }
                    BulbView.resources = {
                        red: generateBulbTexture(0xFF0000),
                        green: generateBulbTexture(0x00FF00),
                        blue: generateBulbTexture(0x0000FF),
                        yellow: generateBulbTexture(0xFFFF00),
                    };
                }
                removeSelf() {
                    this.parent.removeChild(this);
                }
                updateTransform() {
                    this.x = this.model.column * BulbView.radius * 2;
                    this.y = this.model.row * BulbView.radius * 2;
                    super.updateTransform();
                }
            };
            BulbView.radius = 20;
            exports_4("BulbView", BulbView);
        }
    };
});
System.register("BoardController", ["utils/misc", "Bulb"], function (exports_5, context_5) {
    var misc_1, Bulb_1, CellCoords, BoardController;
    var __moduleName = context_5 && context_5.id;
    function bicolorEquals(bicolor1, bicolor2) {
        return (bicolor1.left === bicolor2.left && bicolor1.right === bicolor2.right
            || bicolor1.left === bicolor2.right && bicolor1.right === bicolor2.left);
    }
    return {
        setters: [
            function (misc_1_1) {
                misc_1 = misc_1_1;
            },
            function (Bulb_1_1) {
                Bulb_1 = Bulb_1_1;
            }
        ],
        execute: function () {
            CellCoords = class CellCoords {
                constructor(r, c) {
                    this.row = r;
                    this.column = c;
                }
            };
            exports_5("CellCoords", CellCoords);
            BoardController = class BoardController {
                constructor(model, container) {
                    this.model = model;
                    this.container = container;
                    this.startSwapBulb = undefined;
                    this.bulbs = [];
                    for (const bulb of this.model.bulbs) {
                        if (bulb) {
                            this.addBulbController(new Bulb_1.BulbController(bulb, container));
                        }
                    }
                }
                addBulbController(bulb) {
                    this.bulbs.push(bulb);
                    bulb.on("startswap", () => this.startSwapBulb = bulb);
                    bulb.on("endswap", () => {
                        if (this.startSwapBulb) {
                            this.swap(this.startSwapBulb, bulb);
                            this.startSwapBulb = undefined;
                        }
                    });
                }
                removeBulbController(bulb) {
                    this.bulbs.splice(this.bulbs.indexOf(bulb, 1));
                    bulb.off("startswap");
                    bulb.off("endswap");
                }
                _buildGrid() {
                    const grid = Array.from({ length: this.model.columnCount }, () => Array.from({ length: this.model.rowCount }, () => null));
                    for (const bulb of this.bulbs) {
                        grid[bulb.model.column][bulb.model.row] = bulb;
                    }
                    return grid;
                }
                findChunks() {
                    const grid = this._buildGrid();
                    let counter = 0;
                    for (let i = 0; i < this.model.rowCount; i++) {
                        let startJ = 0;
                        for (let j = 1; j <= this.model.columnCount; j++) {
                            const prevBulb = grid[j - 1][i];
                            const bulb = j === this.model.columnCount ? undefined : grid[j][i];
                            if (!bulb || !prevBulb || !bicolorEquals(bulb.model.color, prevBulb.model.color)) {
                                const chunkLen = j - startJ;
                                if (chunkLen > 2) {
                                    for (let jj = startJ; jj < startJ + chunkLen; jj++) {
                                        grid[jj][i].disappear();
                                        this.model.bulbs.splice(this.model.bulbs.indexOf(grid[jj][i].model), 1);
                                        this.removeBulbController(grid[jj][i]);
                                        grid[jj][i] = null;
                                    }
                                    counter += 1;
                                }
                                startJ = j;
                            }
                        }
                    }
                    for (let j = 0; j < this.model.columnCount; j++) {
                        let startI = 0;
                        for (let i = 1; i <= this.model.rowCount; i++) {
                            const prevBulb = grid[j][i - 1];
                            const bulb = i === this.model.rowCount ? undefined : grid[j][i];
                            if (!bulb || !prevBulb || !bicolorEquals(bulb.model.color, prevBulb.model.color)) {
                                const chunkLen = i - startI;
                                if (chunkLen > 2) {
                                    for (let ii = startI; ii < startI + chunkLen; ii++) {
                                        grid[j][ii].disappear();
                                        this.model.bulbs.splice(this.model.bulbs.indexOf(grid[j][ii].model), 1);
                                        this.removeBulbController(grid[j][ii]);
                                        grid[j][ii] = null;
                                    }
                                    counter += 1;
                                }
                                startI = i;
                            }
                        }
                    }
                    return counter;
                }
                swap(bulb1, bulb2) {
                    const dRow = (bulb1.model.row - bulb2.model.row);
                    const dColumn = (bulb1.model.column - bulb2.model.column);
                    const dSqr = dRow * dRow + dColumn * dColumn;
                    if (dSqr !== 1) {
                        return;
                    }
                    {
                        const tmpRow = bulb2.model.row;
                        const tmpColumn = bulb2.model.column;
                        bulb2.model.row = bulb1.model.row;
                        bulb2.model.column = bulb1.model.column;
                        bulb1.model.row = tmpRow;
                        bulb1.model.column = tmpColumn;
                    }
                    const chunksCount = this.run();
                    if (chunksCount === 0) {
                        {
                            const tmpRow = bulb2.model.row;
                            const tmpColumn = bulb2.model.column;
                            bulb2.model.row = bulb1.model.row;
                            bulb2.model.column = bulb1.model.column;
                            bulb1.model.row = tmpRow;
                            bulb1.model.column = tmpColumn;
                        }
                    }
                }
                run() {
                    const chunksCount = this.findChunks();
                    while (true) {
                        while (this.shake() > 0) {
                            //
                        }
                        if (this.findChunks() === 0) {
                            return chunksCount;
                        }
                    }
                }
                shake() {
                    const grid = this._buildGrid();
                    let counter = 0;
                    for (let column = 0; column < this.model.columnCount; column++) {
                        for (let row = this.model.rowCount - 1; row >= 0; row--) {
                            if (row === 0 && !grid[column][row]) {
                                const newBulb = new Bulb_1.BulbController(Bulb_1.BulbController.createModel(misc_1.getRandomElement(this.model.bicolors), column), this.container);
                                this.addBulbController(newBulb);
                                this.model.bulbs.push(newBulb.model);
                                grid[column][row] = newBulb;
                                counter += 1;
                                break;
                            }
                            if (!grid[column][row]) {
                                if (grid[column][row - 1]) {
                                    grid[column][row - 1].fall();
                                }
                                if (row - 1 === 0 && !grid[column][row - 1]) {
                                    const newBulb = new Bulb_1.BulbController(Bulb_1.BulbController.createModel(misc_1.getRandomElement(this.model.bicolors), column), this.container);
                                    this.addBulbController(newBulb);
                                    this.model.bulbs.push(newBulb.model);
                                    grid[column][row - 1] = newBulb;
                                }
                                counter += 1;
                            }
                        }
                    }
                    return counter;
                }
            };
            exports_5("BoardController", BoardController);
        }
    };
});
System.register("generateBoard", ["utils/misc"], function (exports_6, context_6) {
    var misc_2;
    var __moduleName = context_6 && context_6.id;
    function generateBoard(rowCount, columnCount, bicolors) {
        const bulbs = [];
        for (let column = 0; column < columnCount; column++) {
            for (let row = 0; row < rowCount; row++) {
                bulbs.push({
                    color: misc_2.getRandomElement(bicolors),
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
    exports_6("generateBoard", generateBoard);
    return {
        setters: [
            function (misc_2_1) {
                misc_2 = misc_2_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("main", ["generateBoard", "BoardController", "pixi.js", "Bi", "Bulb"], function (exports_7, context_7) {
    var generateBoard_1, BoardController_1, PIXI, Bi_2, Bulb_2, bicolors, boardModel, canvas, app, height, width, container, boardController;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [
            function (generateBoard_1_1) {
                generateBoard_1 = generateBoard_1_1;
            },
            function (BoardController_1_1) {
                BoardController_1 = BoardController_1_1;
            },
            function (PIXI_2) {
                PIXI = PIXI_2;
            },
            function (Bi_2_1) {
                Bi_2 = Bi_2_1;
            },
            function (Bulb_2_1) {
                Bulb_2 = Bulb_2_1;
            }
        ],
        execute: function () {
            bicolors = [{
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
            boardModel = generateBoard_1.generateBoard(10, 10, bicolors);
            canvas = document.getElementById("canvas");
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            app = new PIXI.Application({
                view: canvas,
                width: canvas.width,
                height: canvas.height,
            });
            height = app.renderer.height;
            width = app.renderer.width / 2;
            container = {
                left: new PIXI.Container(),
                right: new PIXI.Container(),
            };
            container.left.x = width / 2;
            container.left.y = height / 2;
            app.stage.addChild(container.left);
            container.right.x = width + width / 2;
            container.right.y = height / 2;
            app.stage.addChild(container.right);
            Bulb_2.BulbView.loadResources(app.renderer);
            boardController = new BoardController_1.BoardController(boardModel, container);
            for (const monoContainer of Bi_2.bii(container)) {
                monoContainer.pivot.x = monoContainer.width / 2;
                monoContainer.pivot.y = monoContainer.height / 2;
            }
            boardController.run();
        }
    };
});
// https://en.wikipedia.org/wiki/Lehmer_random_number_generator
System.register("utils/Random", [], function (exports_8, context_8) {
    var MAX_INT32, MINSTD, Random;
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [],
        execute: function () {// https://en.wikipedia.org/wiki/Lehmer_random_number_generator
            MAX_INT32 = 2147483647;
            MINSTD = 16807;
            Random = class Random {
                constructor(seed) {
                    if (!Number.isInteger(seed)) {
                        throw new TypeError("Expected `seed` to be a `integer`");
                    }
                    this.seed = seed % MAX_INT32;
                    if (this.seed <= 0) {
                        this.seed += (MAX_INT32 - 1);
                    }
                }
                next() {
                    return this.seed = this.seed * MINSTD % MAX_INT32;
                }
                nextFloat() {
                    return (this.next() - 1) / (MAX_INT32 - 1);
                }
            };
            exports_8("Random", Random);
        }
    };
});
System.register("utils/imageData", [], function (exports_9, context_9) {
    var almost256;
    var __moduleName = context_9 && context_9.id;
    function setPixelI(imageData, i, r, g, b, a = 1) {
        // tslint:disable-next-line:no-bitwise
        const offset = i << 2;
        imageData.data[offset + 0] = r;
        imageData.data[offset + 1] = g;
        imageData.data[offset + 2] = b;
        imageData.data[offset + 3] = a;
    }
    exports_9("setPixelI", setPixelI);
    function scaleNorm(v) {
        return Math.floor(v * almost256);
    }
    function setPixelNormI(imageData, i, r, g, b, a = 1) {
        setPixelI(imageData, i, scaleNorm(r), scaleNorm(g), scaleNorm(b), scaleNorm(a));
    }
    exports_9("setPixelNormI", setPixelNormI);
    function setPixelXY(imageData, x, y, r, g, b, a = 255) {
        setPixelI(imageData, y * imageData.width + x, r, g, b, a);
    }
    exports_9("setPixelXY", setPixelXY);
    function setPixelNormXY(imageData, x, y, r, g, b, a = 1) {
        setPixelNormI(imageData, y * imageData.width + x, r, g, b, a);
    }
    exports_9("setPixelNormXY", setPixelNormXY);
    return {
        setters: [],
        execute: function () {
            almost256 = 256 - Number.MIN_VALUE;
        }
    };
});
//# sourceMappingURL=app.js.map