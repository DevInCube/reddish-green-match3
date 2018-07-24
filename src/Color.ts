export class Color {
    leftColor: string;
    rightColor: string;

    constructor(left: string, right?: string) {
        this.leftColor = left;
        this.rightColor = right || left;
    }

    equals(other: Color): boolean {
        return (this.leftColor === other.leftColor && this.rightColor === other.rightColor
            || this.leftColor === other.rightColor && this.rightColor === other.leftColor);
    }

    static colors = [
        "yellow",
        "red",
        "blue",
        "green",
        "cyan",
    ];

    static getRandom(): Color {
        const fixed = [
            new Color("red"),
            new Color("blue"),
            new Color("green"),
            new Color("yellow"),
            new Color("green", "yellow"),
            new Color("yellow", "green"),
            new Color("blue", "yellow"),
            new Color("yellow", "blue"),
        ];

        return fixed[Math.trunc(Math.random() * fixed.length)];

        const left = randomColorString();
        let right = randomColorString();
        if (Math.trunc(Math.random() * 3) === 0) {
            right = left;
        }
        return new Color(left, right);

        function randomColorString() {
            return Color.colors[Math.trunc(Math.random() * Color.colors.length)];
        }
    }
}
