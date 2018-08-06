import * as PIXI from "pixi.js";
import { Bicolor } from "./Bicolor";
import { Bi, bii } from "./Bi";

export interface BulbModel {
    color: Bicolor;
    position: {
        row: number;
        column: number;
    };
    isFalling: boolean;
    isAppearing: boolean;
    isDisappearing: boolean;
}

export class BulbController {
    static createModel(color: Bicolor, column: number) {
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

    public view: Bi<BulbView>;
    constructor(
        public model: BulbModel,
        container: Bi<PIXI.Container>,
    ) {
        this.view = {
            left: new BulbView(this.model, true),
            right: new BulbView(this.model, false),
        };
        container.left.addChild(this.view.left);
        container.right.addChild(this.view.right);
    }

    sync() {
        if (this.model.isDisappearing) {
            for (const monoView of bii(this.view)) {
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
}

export class BulbView extends PIXI.Sprite {
    static radius = 10;

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
            yelllow: generateBulbTexture(0xFFFF00),
        };
    }

    constructor(
        public model: BulbModel,
        public isLeft: boolean,
    ) {
        super(BulbView.resources[isLeft ? model.color.left : model.color.right]);
    }

    removeSelf() {
        this.parent.removeChild(this);
    }

    updateTransform() {
        this.x = this.model.position.column * BulbView.radius * 2;
        this.y = this.model.position.row * BulbView.radius * 2;

        super.updateTransform();
    }
}
