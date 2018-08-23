import * as PIXI from "pixi.js";
import { Bicolor } from "./Bicolor";
import { Bi, bii } from "./Bi";

export interface BulbModel {
    color: Bicolor;
    row: number;
    column: number;
}

export class BulbController extends PIXI.utils.EventEmitter {
    static createModel(color: Bicolor, column: number) {
        return {
            color,
            row: 0,
            column,
        };
    }

    public view: Bi<BulbView>;
    constructor(
        public model: BulbModel,
        container: Bi<PIXI.Container>,
    ) {
        super();

        this.view = {
            left: new BulbView(this.model, true),
            right: new BulbView(this.model, false),
        };
        container.left.addChild(this.view.left);
        container.right.addChild(this.view.right);

        for (const monoView of bii(this.view)) {
            monoView.on("pointerdown", () => {
                this.emit("startswap", this);
            });
            monoView.on("pointerup", () => {
                this.emit("endswap", this);
            });
        }
    }

    fall() {
        this.model.row++;
    }

    disappear() {
        for (const monoView of bii(this.view)) {
            monoView.removeSelf();
        }
    }
}

export class BulbView extends PIXI.Sprite {
    static radius = 20;

    static resources: { [id: string]: PIXI.Texture };

    static loadResources(renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer) {
        function generateBulbTexture(color: number) {
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

    constructor(
        public model: BulbModel,
        public isLeft: boolean,
    ) {
        super(BulbView.resources[isLeft ? model.color.left : model.color.right]);
        this.interactive = true;
    }

    removeSelf() {
        this.parent.removeChild(this);
    }

    updateTransform() {
        this.x = this.model.column * BulbView.radius * 2;
        this.y = this.model.row * BulbView.radius * 2;

        super.updateTransform();
    }
}
