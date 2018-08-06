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
System.register("Bulb", ["pixi.js", "Bi"], function (exports_3, context_3) {
    var PIXI, Bi_1, BulbController, BulbView;
    var __moduleName = context_3 && context_3.id;
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
            BulbController = class BulbController {
                constructor(model, container) {
                    this.model = model;
                    this.view = {
                        left: new BulbView(this.model, true),
                        right: new BulbView(this.model, false),
                    };
                    container.left.addChild(this.view.left);
                    container.right.addChild(this.view.right);
                }
                static createModel(color, column) {
                    return {
                        color,
                        position: {
                            row: 0,
                            column,
                        },
                        isFalling: false,
                        isAppearing: true,
                        isDisappearing: false,
                    };
                }
                sync() {
                    if (this.model.isDisappearing) {
                        for (const monoView of Bi_1.bii(this.view)) {
                            monoView.removeSelf();
                        }
                    }
                    this.model.isFalling = false;
                    this.model.isAppearing = false;
                    this.model.isDisappearing = false;
                }
                fall() {
                    this.model.position.row++;
                    this.model.isFalling = true;
                }
                disappear() {
                    this.model.isDisappearing = true;
                }
            };
            exports_3("BulbController", BulbController);
            BulbView = class BulbView extends PIXI.Sprite {
                constructor(model, isLeft) {
                    super(BulbView.resources[isLeft ? model.color.left : model.color.right]);
                    this.model = model;
                    this.isLeft = isLeft;
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
                        yelllow: generateBulbTexture(0xFFFF00),
                    };
                }
                removeSelf() {
                    this.parent.removeChild(this);
                }
                updateTransform() {
                    this.x = this.model.position.column * BulbView.radius * 2;
                    this.y = this.model.position.row * BulbView.radius * 2;
                    super.updateTransform();
                }
            };
            BulbView.radius = 10;
            exports_3("BulbView", BulbView);
        }
    };
});
System.register("model", [], function (exports_4, context_4) {
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("utils/misc", [], function (exports_5, context_5) {
    var __moduleName = context_5 && context_5.id;
    function isVisible(elt) {
        const style = window.getComputedStyle(elt);
        return (style.width !== null && +style.width !== 0)
            && (style.height !== null && +style.height !== 0)
            && (style.opacity !== null && +style.opacity !== 0)
            && style.display !== "none"
            && style.visibility !== "hidden";
    }
    exports_5("isVisible", isVisible);
    function adjust(x, ...applyAdjustmentList) {
        for (const applyAdjustment of applyAdjustmentList) {
            applyAdjustment(x);
        }
        return x;
    }
    exports_5("adjust", adjust);
    function getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    exports_5("getRandomElement", getRandomElement);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("BoardController", ["utils/misc"], function (exports_6, context_6) {
    var misc_1, CellCoords, BoardController;
    var __moduleName = context_6 && context_6.id;
    function bicolorEquals(bicolor1, bicolor2) {
        return (bicolor1.left === bicolor2.left && bicolor1.right === bicolor2.right
            || bicolor1.left === bicolor2.right && bicolor1.right === bicolor2.left);
    }
    return {
        setters: [
            function (misc_1_1) {
                misc_1 = misc_1_1;
            }
        ],
        execute: function () {
            CellCoords = class CellCoords {
                constructor(r, c) {
                    this.row = r;
                    this.column = c;
                }
            };
            exports_6("CellCoords", CellCoords);
            BoardController = class BoardController {
                constructor(model) {
                    this.model = model;
                }
                findChunks() {
                    let counter = 0;
                    for (let i = 0; i < this.model.rowCount; i++) {
                        let startJ = 0;
                        for (let j = 1; j <= this.model.columnCount; j++) {
                            const prevCell = this.model.cells[i][j - 1];
                            const cell = j === this.model.columnCount ? undefined : this.model.cells[i][j];
                            if (!cell || !cell.bulb || !prevCell || !prevCell.bulb
                                || !bicolorEquals(cell.bulb.color, prevCell.bulb.color)) {
                                const chunkLen = j - startJ;
                                if (chunkLen > 2) {
                                    for (let jj = startJ; jj < startJ + chunkLen; jj++) {
                                        this.model.cells[i][jj].bulb = undefined;
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
                            const prevCell = this.model.cells[i - 1][j];
                            const cell = i === this.model.rowCount ? undefined : this.model.cells[i][j];
                            if (!cell || !cell.bulb || !prevCell || !prevCell.bulb
                                || !bicolorEquals(cell.bulb.color, prevCell.bulb.color)) {
                                const chunkLen = i - startI;
                                if (chunkLen > 2) {
                                    for (let ii = startI; ii < startI + chunkLen; ii++) {
                                        this.model.cells[ii][j].bulb = undefined;
                                    }
                                    counter += 1;
                                }
                                startI = i;
                            }
                        }
                    }
                    return counter;
                }
                areCoordsValid(c) {
                    return c.row >= 0
                        && c.row < this.model.rowCount
                        && c.column >= 0
                        && c.column < this.model.columnCount;
                }
                moveCell(coords, newCoords) {
                    if (this.areCoordsValid(newCoords)) {
                        const tmp = this.model.cells[coords.row][coords.column];
                        this.model.cells[coords.row][coords.column] = this.model.cells[newCoords.row][newCoords.column];
                        if (this.model.cells[coords.row][coords.column].bulb) {
                            this.model.cells[coords.row][coords.column].bulb.position.row = coords.row;
                            this.model.cells[coords.row][coords.column].bulb.position.column = coords.column;
                        }
                        this.model.cells[newCoords.row][newCoords.column] = tmp;
                        if (this.model.cells[newCoords.row][newCoords.column].bulb) {
                            this.model.cells[newCoords.row][newCoords.column].bulb.position.row = newCoords.row;
                            this.model.cells[newCoords.row][newCoords.column].bulb.position.column = newCoords.column;
                        }
                    }
                }
                shake() {
                    let counter = 0;
                    for (let i = this.model.rowCount - 1; i >= 0; i--) {
                        for (let j = 0; j < this.model.columnCount; j++) {
                            if (i === 0 && !this.model.cells[i][j].bulb) {
                                this.model.cells[i][j] = {
                                    bulb: {
                                        color: misc_1.getRandomElement(this.model.bicolors),
                                        position: {
                                            row: j,
                                            column: i,
                                        },
                                        isAppearing: false,
                                        isDisappearing: false,
                                        isFalling: false,
                                    },
                                };
                                counter += 1;
                                break;
                            }
                            if (!this.model.cells[i][j].bulb) {
                                this.moveCell(new CellCoords(i, j), new CellCoords(i - 1, j));
                                if (i - 1 === 0 && !this.model.cells[i - 1][j].bulb) {
                                    this.model.cells[i - 1][j] = {
                                        bulb: {
                                            color: misc_1.getRandomElement(this.model.bicolors),
                                            position: {
                                                row: j,
                                                column: i,
                                            },
                                            isAppearing: false,
                                            isDisappearing: false,
                                            isFalling: false,
                                        },
                                    };
                                }
                                counter += 1;
                            }
                        }
                    }
                    return counter;
                }
            };
            exports_6("BoardController", BoardController);
        }
    };
});
System.register("BoardView", ["BoardController"], function (exports_7, context_7) {
    var BoardController_1, BoardView;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [
            function (BoardController_1_1) {
                BoardController_1 = BoardController_1_1;
            }
        ],
        execute: function () {
            BoardView = class BoardView {
                constructor(context, isRight, x, y, model) {
                    this.context = context;
                    this.isRight = isRight;
                    this.x = x;
                    this.y = y;
                    this.model = model;
                }
                renderCell(cell, i, j) {
                    this.context.strokeStyle = "black";
                    this.context.strokeRect(this.x + j * BoardView.CELL_SIZE, this.y + i * BoardView.CELL_SIZE, BoardView.CELL_SIZE, BoardView.CELL_SIZE);
                    this.context.fillStyle = !cell.bulb
                        ? "black"
                        : (this.isRight ? cell.bulb.color.right : cell.bulb.color.left);
                    this.context.fillRect(this.x + j * BoardView.CELL_SIZE, this.y + i * BoardView.CELL_SIZE, BoardView.CELL_SIZE, BoardView.CELL_SIZE);
                }
                render() {
                    this.context.strokeStyle = "black";
                    this.context.strokeRect(this.x, this.y, BoardView.CELL_SIZE * this.model.columnCount, BoardView.CELL_SIZE * this.model.rowCount);
                    for (let i = 0; i < this.model.rowCount; i++) {
                        for (let j = 0; j < this.model.columnCount; j++) {
                            const cell = this.model.cells[i][j];
                            this.renderCell(cell, i, j);
                        }
                    }
                }
                findCellCoords(x, y) {
                    if (x >= this.x && x <= this.x + BoardView.CELL_SIZE * this.model.columnCount
                        && y >= this.y && y <= this.y + BoardView.CELL_SIZE * this.model.rowCount) {
                        x -= this.x;
                        y -= this.y;
                        const i = Math.trunc(y / BoardView.CELL_SIZE);
                        const j = Math.trunc(x / BoardView.CELL_SIZE);
                        return new BoardController_1.CellCoords(i, j);
                    }
                    return undefined;
                }
            };
            BoardView.CELL_SIZE = 32;
            exports_7("BoardView", BoardView);
        }
    };
});
System.register("generateBoard", ["utils/misc"], function (exports_8, context_8) {
    var misc_2;
    var __moduleName = context_8 && context_8.id;
    function generateBoard(rowCount, columnCount, bicolors) {
        return {
            rowCount,
            columnCount,
            cells: Array.from({ length: columnCount }, (_, column) => Array.from({ length: rowCount }, (__, row) => ({
                bulb: {
                    color: misc_2.getRandomElement(bicolors),
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
    exports_8("generateBoard", generateBoard);
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
System.register("main", ["generateBoard", "BoardController", "BoardView", "pixi.js", "Bulb", "Bi"], function (exports_9, context_9) {
    var generateBoard_1, BoardController_2, BoardView_1, PIXI, Bulb_1, Bi_2, mousePressed, bicolors, boardModel, canvas, ctx, height, width, app, container, boardController, leftBoardView, rightBoardView, mdX, mdY;
    var __moduleName = context_9 && context_9.id;
    function render() {
        leftBoardView.render();
        rightBoardView.render();
    }
    function shakeUntil() {
        while (true) {
            while (boardController.shake()) {
                //
            }
            while (boardController.findChunks()) {
                //
            }
            if (boardController.shake() === 0) {
                break;
            }
        }
    }
    return {
        setters: [
            function (generateBoard_1_1) {
                generateBoard_1 = generateBoard_1_1;
            },
            function (BoardController_2_1) {
                BoardController_2 = BoardController_2_1;
            },
            function (BoardView_1_1) {
                BoardView_1 = BoardView_1_1;
            },
            function (PIXI_2) {
                PIXI = PIXI_2;
            },
            function (Bulb_1_1) {
                Bulb_1 = Bulb_1_1;
            },
            function (Bi_2_1) {
                Bi_2 = Bi_2_1;
            }
        ],
        execute: function () {
            mousePressed = false;
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
            ctx = canvas.getContext("2d");
            height = canvas.height;
            width = canvas.width / 2;
            app = new PIXI.Application({
                view: canvas,
                width: canvas.width,
                height: canvas.height,
                forceCanvas: true,
            });
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
            Bulb_1.BulbView.loadResources(app.renderer);
            for (const row of boardModel.cells) {
                for (const bulb of row) {
                    if (bulb.bulb) {
                        // tslint:disable-next-line:no-unused-expression
                        new Bulb_1.BulbController(bulb.bulb, container);
                    }
                }
            }
            for (const monoContainer of Bi_2.bii(container)) {
                monoContainer.pivot.x = monoContainer.width / 2;
                monoContainer.pivot.y = monoContainer.height / 2;
            }
            boardController = new BoardController_2.BoardController(boardModel);
            leftBoardView = new BoardView_1.BoardView(ctx, false, 0, 0, boardController.model);
            rightBoardView = new BoardView_1.BoardView(ctx, true, width, 0, boardController.model);
            shakeUntil();
            render();
            mdX = 0;
            mdY = 0;
            canvas.addEventListener("mousedown", e => {
                const x = e.offsetX;
                const y = e.offsetY;
                mdX = x;
                mdY = y;
            });
            canvas.addEventListener("mousemove", e => {
                if (mousePressed) {
                    //
                }
            });
            canvas.addEventListener("mouseup", e => {
                const x = e.offsetX;
                const y = e.offsetY;
                const mdCellCoords = leftBoardView.findCellCoords(mdX, mdY) || rightBoardView.findCellCoords(mdX, mdY);
                const muCellCoords = leftBoardView.findCellCoords(x, y) || rightBoardView.findCellCoords(x, y);
                if (mdCellCoords && muCellCoords) {
                    const dx = muCellCoords.column - mdCellCoords.column;
                    const dy = muCellCoords.row - mdCellCoords.row;
                    const newCoords = new BoardController_2.CellCoords(mdCellCoords.row, mdCellCoords.column);
                    if (Math.abs(dx) > Math.abs(dy)) {
                        newCoords.column += Math.sign(dx);
                    }
                    else {
                        newCoords.row += Math.sign(dy);
                    }
                    boardController.moveCell(mdCellCoords, newCoords);
                    if (!boardController.findChunks()) {
                        boardController.moveCell(newCoords, mdCellCoords);
                    }
                    else {
                        shakeUntil();
                    }
                    render();
                }
                mousePressed = false;
            });
        }
    };
});
// https://en.wikipedia.org/wiki/Lehmer_random_number_generator
System.register("utils/Random", [], function (exports_10, context_10) {
    var MAX_INT32, MINSTD, Random;
    var __moduleName = context_10 && context_10.id;
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
            exports_10("Random", Random);
        }
    };
});
System.register("utils/imageData", [], function (exports_11, context_11) {
    var almost256;
    var __moduleName = context_11 && context_11.id;
    function setPixelI(imageData, i, r, g, b, a = 1) {
        // tslint:disable-next-line:no-bitwise
        const offset = i << 2;
        imageData.data[offset + 0] = r;
        imageData.data[offset + 1] = g;
        imageData.data[offset + 2] = b;
        imageData.data[offset + 3] = a;
    }
    exports_11("setPixelI", setPixelI);
    function scaleNorm(v) {
        return Math.floor(v * almost256);
    }
    function setPixelNormI(imageData, i, r, g, b, a = 1) {
        setPixelI(imageData, i, scaleNorm(r), scaleNorm(g), scaleNorm(b), scaleNorm(a));
    }
    exports_11("setPixelNormI", setPixelNormI);
    function setPixelXY(imageData, x, y, r, g, b, a = 255) {
        setPixelI(imageData, y * imageData.width + x, r, g, b, a);
    }
    exports_11("setPixelXY", setPixelXY);
    function setPixelNormXY(imageData, x, y, r, g, b, a = 1) {
        setPixelNormI(imageData, y * imageData.width + x, r, g, b, a);
    }
    exports_11("setPixelNormXY", setPixelNormXY);
    return {
        setters: [],
        execute: function () {
            almost256 = 256 - Number.MIN_VALUE;
        }
    };
});
//# sourceMappingURL=app.js.map