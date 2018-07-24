System.register("utils/misc", [], function (exports_1, context_1) {
    var __moduleName = context_1 && context_1.id;
    function isVisible(elt) {
        const style = window.getComputedStyle(elt);
        return (style.width !== null && +style.width !== 0)
            && (style.height !== null && +style.height !== 0)
            && (style.opacity !== null && +style.opacity !== 0)
            && style.display !== "none"
            && style.visibility !== "hidden";
    }
    exports_1("isVisible", isVisible);
    function adjust(x, ...applyAdjustmentList) {
        for (const applyAdjustment of applyAdjustmentList) {
            applyAdjustment(x);
        }
        return x;
    }
    exports_1("adjust", adjust);
    function getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    exports_1("getRandomElement", getRandomElement);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("Bicolor", ["utils/misc"], function (exports_2, context_2) {
    var __moduleName = context_2 && context_2.id;
    function bicolorEquals(bicolor1, bicolor2) {
        return (bicolor1.leftColor === bicolor2.leftColor && bicolor1.rightColor === bicolor2.rightColor
            || bicolor1.leftColor === bicolor2.rightColor && bicolor1.rightColor === bicolor2.leftColor);
    }
    exports_2("bicolorEquals", bicolorEquals);
    function getRandomBicolor() {
        return misc_1.getRandomElement(bicolors);
    }
    exports_2("getRandomBicolor", getRandomBicolor);
    var misc_1, bicolors;
    return {
        setters: [
            function (misc_1_1) {
                misc_1 = misc_1_1;
            }
        ],
        execute: function () {
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
        }
    };
});
System.register("main", ["Bicolor"], function (exports_3, context_3) {
    var __moduleName = context_3 && context_3.id;
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
        draw(ctx, board, false);
        draw(ctx, board, true);
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
        const bWidth = cellSize * b.columns;
        const bHeight = cellSize * b.rows;
        const ocy = bHeight / 2;
        const obx = ocx - bWidth / 2;
        const oby = ocy - bHeight / 2;
        if (x >= obx && x <= obx + bWidth && y >= oby && y <= oby + bHeight) {
            x -= obx;
            y -= oby;
            const i = Math.trunc(y / cellSize);
            const j = Math.trunc(x / cellSize);
            return new CellCoords(i, j);
        }
        return undefined;
    }
    var Bicolor_1, canvas, ctx, width, mousePressed, cellSize, Cell, CellCoords, Chunk, Board, board, mdX, mdY;
    return {
        setters: [
            function (Bicolor_1_1) {
                Bicolor_1 = Bicolor_1_1;
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
            Cell = class Cell {
                constructor(color) {
                    this.color = color;
                }
            };
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
            Chunk = class Chunk {
                constructor(coords, length) {
                    this.coords = coords;
                    this.length = length;
                }
            };
            Board = class Board {
                constructor(rows, columns) {
                    this.cells = new Array(rows);
                    for (let i = 0; i < rows; i++) {
                        this.cells[i] = new Array(columns);
                    }
                    this.rows = rows;
                    this.columns = columns;
                }
                randomize() {
                    for (let i = 0; i < this.rows; i++) {
                        for (let j = 0; j < this.columns; j++) {
                            this.cells[i][j] = new Cell(Bicolor_1.getRandomBicolor());
                        }
                    }
                }
                findChunks() {
                    let counter = 0;
                    for (let i = 0; i < this.rows; i++) {
                        let startJ = 0;
                        for (let j = 1; j <= this.columns; j++) {
                            const prevCell = this.cells[i][j - 1];
                            const cell = j === this.columns ? undefined : this.cells[i][j];
                            if (!cell || !prevCell || !Bicolor_1.bicolorEquals(cell.color, prevCell.color)) {
                                const chunkLen = j - startJ;
                                if (chunkLen > 2) {
                                    for (let jj = startJ; jj < startJ + chunkLen; jj++) {
                                        this.cells[i][jj] = undefined;
                                    }
                                    counter += 1;
                                }
                                startJ = j;
                            }
                        }
                    }
                    for (let j = 0; j < this.columns; j++) {
                        let startI = 0;
                        for (let i = 1; i <= this.rows; i++) {
                            const prevCell = this.cells[i - 1][j];
                            const cell = i === this.rows ? undefined : this.cells[i][j];
                            if (!cell || !prevCell || !Bicolor_1.bicolorEquals(cell.color, prevCell.color)) {
                                const chunkLen = i - startI;
                                if (chunkLen > 2) {
                                    for (let ii = startI; ii < startI + chunkLen; ii++) {
                                        this.cells[ii][j] = undefined;
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
                    if (newCoords.valid(this)) {
                        const tmp = this.cells[coords.row][coords.column];
                        this.cells[coords.row][coords.column] = this.cells[newCoords.row][newCoords.column];
                        this.cells[newCoords.row][newCoords.column] = tmp;
                    }
                }
                shake() {
                    let counter = 0;
                    for (let i = this.rows - 1; i >= 0; i--) {
                        for (let j = 0; j < this.columns; j++) {
                            if (i === 0 && !this.cells[i][j]) {
                                this.cells[i][j] = new Cell(Bicolor_1.getRandomBicolor());
                                counter += 1;
                                break;
                            }
                            if (!this.cells[i][j]) {
                                this.moveCell(new CellCoords(i, j), new CellCoords(i - 1, j));
                                if (i - 1 === 0 && !this.cells[i - 1][j]) {
                                    this.cells[i - 1][j] = new Cell(Bicolor_1.getRandomBicolor());
                                }
                                counter += 1;
                            }
                        }
                    }
                    return counter;
                }
            };
            board = new Board(10, 10);
            board.randomize();
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
System.register("utils/imageData", [], function (exports_4, context_4) {
    var __moduleName = context_4 && context_4.id;
    function setPixelI(imageData, i, r, g, b, a = 1) {
        // tslint:disable-next-line:no-bitwise
        const offset = i << 2;
        imageData.data[offset + 0] = r;
        imageData.data[offset + 1] = g;
        imageData.data[offset + 2] = b;
        imageData.data[offset + 3] = a;
    }
    exports_4("setPixelI", setPixelI);
    function scaleNorm(v) {
        return Math.floor(v * almost256);
    }
    function setPixelNormI(imageData, i, r, g, b, a = 1) {
        setPixelI(imageData, i, scaleNorm(r), scaleNorm(g), scaleNorm(b), scaleNorm(a));
    }
    exports_4("setPixelNormI", setPixelNormI);
    function setPixelXY(imageData, x, y, r, g, b, a = 255) {
        setPixelI(imageData, y * imageData.width + x, r, g, b, a);
    }
    exports_4("setPixelXY", setPixelXY);
    function setPixelNormXY(imageData, x, y, r, g, b, a = 1) {
        setPixelNormI(imageData, y * imageData.width + x, r, g, b, a);
    }
    exports_4("setPixelNormXY", setPixelNormXY);
    var almost256;
    return {
        setters: [],
        execute: function () {
            almost256 = 256 - Number.MIN_VALUE;
        }
    };
});
// https://en.wikipedia.org/wiki/Lehmer_random_number_generator
System.register("utils/Random", [], function (exports_5, context_5) {
    var __moduleName = context_5 && context_5.id;
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
            exports_5("Random", Random);
        }
    };
});
//# sourceMappingURL=app.js.map