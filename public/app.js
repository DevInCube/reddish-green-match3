System.register("Bicolor", [], function (exports_1, context_1) {
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("model", [], function (exports_2, context_2) {
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
System.register("BoardController", ["utils/misc"], function (exports_4, context_4) {
    var __moduleName = context_4 && context_4.id;
    function bicolorEquals(bicolor1, bicolor2) {
        return (bicolor1.leftColor === bicolor2.leftColor && bicolor1.rightColor === bicolor2.rightColor
            || bicolor1.leftColor === bicolor2.rightColor && bicolor1.rightColor === bicolor2.leftColor);
    }
    var misc_1, CellCoords, BoardController;
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
                valid(b) {
                    return this.row >= 0
                        && this.row < b.rows
                        && this.column >= 0
                        && this.column < b.columns;
                }
                copy() {
                    return new CellCoords(this.row, this.column);
                }
            };
            exports_4("CellCoords", CellCoords);
            BoardController = class BoardController {
                constructor(model) {
                    this.model = model;
                }
                findChunks() {
                    let counter = 0;
                    for (let i = 0; i < this.model.rows; i++) {
                        let startJ = 0;
                        for (let j = 1; j <= this.model.columns; j++) {
                            const prevCell = this.model.cells[i][j - 1];
                            const cell = j === this.model.columns ? undefined : this.model.cells[i][j];
                            if (!cell || !prevCell || !bicolorEquals(cell.color, prevCell.color)) {
                                const chunkLen = j - startJ;
                                if (chunkLen > 2) {
                                    for (let jj = startJ; jj < startJ + chunkLen; jj++) {
                                        this.model.cells[i][jj] = undefined;
                                    }
                                    counter += 1;
                                }
                                startJ = j;
                            }
                        }
                    }
                    for (let j = 0; j < this.model.columns; j++) {
                        let startI = 0;
                        for (let i = 1; i <= this.model.rows; i++) {
                            const prevCell = this.model.cells[i - 1][j];
                            const cell = i === this.model.rows ? undefined : this.model.cells[i][j];
                            if (!cell || !prevCell || !bicolorEquals(cell.color, prevCell.color)) {
                                const chunkLen = i - startI;
                                if (chunkLen > 2) {
                                    for (let ii = startI; ii < startI + chunkLen; ii++) {
                                        this.model.cells[ii][j] = undefined;
                                    }
                                    counter += 1;
                                }
                                startI = i;
                            }
                        }
                    }
                    return counter;
                }
                moveCell(coords, newCoords) {
                    if (newCoords.valid(this.model)) {
                        const tmp = this.model.cells[coords.row][coords.column];
                        this.model.cells[coords.row][coords.column] = this.model.cells[newCoords.row][newCoords.column];
                        this.model.cells[newCoords.row][newCoords.column] = tmp;
                    }
                }
                shake() {
                    let counter = 0;
                    for (let i = this.model.rows - 1; i >= 0; i--) {
                        for (let j = 0; j < this.model.columns; j++) {
                            if (i === 0 && !this.model.cells[i][j]) {
                                this.model.cells[i][j] = {
                                    color: misc_1.getRandomElement(this.model.bicolors),
                                };
                                counter += 1;
                                break;
                            }
                            if (!this.model.cells[i][j]) {
                                this.moveCell(new CellCoords(i, j), new CellCoords(i - 1, j));
                                if (i - 1 === 0 && !this.model.cells[i - 1][j]) {
                                    this.model.cells[i - 1][j] = {
                                        color: misc_1.getRandomElement(this.model.bicolors),
                                    };
                                }
                                counter += 1;
                            }
                        }
                    }
                    return counter;
                }
            };
            exports_4("BoardController", BoardController);
        }
    };
});
System.register("generateBoard", ["utils/misc"], function (exports_5, context_5) {
    var __moduleName = context_5 && context_5.id;
    function generateBoard(rows, columns, bicolors) {
        return {
            rows,
            columns,
            cells: Array.from({ length: columns }, () => Array.from({ length: rows }, () => ({
                color: misc_2.getRandomElement(bicolors),
            }))),
            bicolors,
        };
    }
    exports_5("generateBoard", generateBoard);
    var misc_2;
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
System.register("main", ["generateBoard", "BoardController"], function (exports_6, context_6) {
    var __moduleName = context_6 && context_6.id;
    function draw(context, b, viewSideRight) {
        const ox = 0 + (viewSideRight ? width : 0);
        const ocx = ox + width / 2;
        const bWidth = cellSize * b.columns;
        const bHeight = cellSize * b.rows;
        const ocy = bHeight / 2;
        const obx = ocx - bWidth / 2;
        const oby = ocy - bHeight / 2;
        context.strokeStyle = "black";
        context.strokeRect(obx, oby, bWidth, bHeight);
        for (let i = 0; i < b.rows; i++) {
            for (let j = 0; j < b.columns; j++) {
                const cell = b.cells[i][j];
                drawCell(cell, i, j);
            }
        }
        function drawCell(cell, i, j) {
            context.strokeStyle = "black";
            context.strokeRect(obx + j * cellSize, oby + i * cellSize, cellSize, cellSize);
            context.fillStyle = !cell ? "black" : (viewSideRight ? cell.color.rightColor : cell.color.leftColor);
            context.fillRect(obx + j * cellSize, oby + i * cellSize, cellSize, cellSize);
        }
    }
    function refresh() {
        draw(ctx, board.model, false);
        draw(ctx, board.model, true);
    }
    function shakeUntil() {
        while (true) {
            while (board.shake()) {
                //
            }
            while (board.findChunks()) {
                //
            }
            if (board.shake() === 0) {
                break;
            }
        }
    }
    function findCellCoords(x, y) {
        const b = board;
        const viewSideRight = false;
        //
        const ox = 0 + (viewSideRight ? width : 0);
        const ocx = ox + width / 2;
        const bWidth = cellSize * b.model.columns;
        const bHeight = cellSize * b.model.rows;
        const ocy = bHeight / 2;
        const obx = ocx - bWidth / 2;
        const oby = ocy - bHeight / 2;
        if (x >= obx && x <= obx + bWidth && y >= oby && y <= oby + bHeight) {
            x -= obx;
            y -= oby;
            const i = Math.trunc(y / cellSize);
            const j = Math.trunc(x / cellSize);
            return new BoardController_1.CellCoords(i, j);
        }
        return undefined;
    }
    var generateBoard_1, BoardController_1, canvas, ctx, width, mousePressed, cellSize, bicolors, board, mdX, mdY;
    return {
        setters: [
            function (generateBoard_1_1) {
                generateBoard_1 = generateBoard_1_1;
            },
            function (BoardController_1_1) {
                BoardController_1 = BoardController_1_1;
            }
        ],
        execute: function () {
            canvas = document.getElementById("canvas");
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            ctx = canvas.getContext("2d");
            width = canvas.width / 2;
            mousePressed = false;
            cellSize = 32;
            bicolors = [{
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
                    rightColor: "red",
                }, {
                    leftColor: "red",
                    rightColor: "green",
                }];
            board = new BoardController_1.BoardController(generateBoard_1.generateBoard(10, 10, bicolors));
            shakeUntil();
            refresh();
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
                const mdCellCoords = findCellCoords(mdX, mdY);
                const muCellCoords = findCellCoords(x, y);
                if (mdCellCoords && muCellCoords) {
                    const dx = muCellCoords.column - mdCellCoords.column;
                    const dy = muCellCoords.row - mdCellCoords.row;
                    const newCoords = mdCellCoords.copy();
                    if (Math.abs(dx) > Math.abs(dy)) {
                        newCoords.column += Math.sign(dx);
                    }
                    else {
                        newCoords.row += Math.sign(dy);
                    }
                    board.moveCell(mdCellCoords, newCoords);
                    if (!board.findChunks()) {
                        board.moveCell(newCoords, mdCellCoords);
                    }
                    else {
                        shakeUntil();
                    }
                    refresh();
                }
                mousePressed = false;
            });
        }
    };
});
System.register("utils/imageData", [], function (exports_7, context_7) {
    var __moduleName = context_7 && context_7.id;
    function setPixelI(imageData, i, r, g, b, a = 1) {
        // tslint:disable-next-line:no-bitwise
        const offset = i << 2;
        imageData.data[offset + 0] = r;
        imageData.data[offset + 1] = g;
        imageData.data[offset + 2] = b;
        imageData.data[offset + 3] = a;
    }
    exports_7("setPixelI", setPixelI);
    function scaleNorm(v) {
        return Math.floor(v * almost256);
    }
    function setPixelNormI(imageData, i, r, g, b, a = 1) {
        setPixelI(imageData, i, scaleNorm(r), scaleNorm(g), scaleNorm(b), scaleNorm(a));
    }
    exports_7("setPixelNormI", setPixelNormI);
    function setPixelXY(imageData, x, y, r, g, b, a = 255) {
        setPixelI(imageData, y * imageData.width + x, r, g, b, a);
    }
    exports_7("setPixelXY", setPixelXY);
    function setPixelNormXY(imageData, x, y, r, g, b, a = 1) {
        setPixelNormI(imageData, y * imageData.width + x, r, g, b, a);
    }
    exports_7("setPixelNormXY", setPixelNormXY);
    var almost256;
    return {
        setters: [],
        execute: function () {
            almost256 = 256 - Number.MIN_VALUE;
        }
    };
});
// https://en.wikipedia.org/wiki/Lehmer_random_number_generator
System.register("utils/Random", [], function (exports_8, context_8) {
    var __moduleName = context_8 && context_8.id;
    var MAX_INT32, MINSTD, Random;
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
//# sourceMappingURL=app.js.map