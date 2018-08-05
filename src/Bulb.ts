import * as PIXI from "pixi.js";
import { Bicolor } from "./Bicolor";

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

    public leftView: BulbView;
    public rightView: BulbView;
    constructor(
        public model: BulbModel,
        leftContainer: PIXI.Container,
        rightContainer: PIXI.Container,
    ) {
        this.leftView = new BulbView(
            this.model,
            true,
            leftContainer,
        );
        this.rightView = new BulbView(
            this.model,
            false,
            rightContainer,
        );
    }

    sync() {
        if (this.model.isDisappearing) {
            this.leftView.remove();
            this.rightView.remove();
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

export class BulbView {
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

    getColor() {
        return this.isLeft ? this.model.color.leftColor : this.model.color.rightColor;
    }

    sprite: PIXI.Sprite;

    constructor(
        public model: BulbModel,
        public isLeft: boolean,
        container: PIXI.Container,
    ) {
        this.sprite = new PIXI.Sprite(BulbView.resources[this.getColor()]);
        this.sprite.x = this.model.position.column * BulbView.radius * 2;
        this.sprite.y = this.model.position.row * BulbView.radius * 2;
        container.addChild(this.sprite);
    }

    remove() {
        this.sprite.parent.removeChild(this.sprite);
    }
}
