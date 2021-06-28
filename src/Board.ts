import P5 from 'p5';

const green_purple_gold = [
    [0, 0, 0],
    [31, 135, 24],
    [132, 49, 160],
    [247, 228, 17]
];

const shades_of_grey = [
    [0, 0, 0],
    [62, 62, 62],
    [124, 124, 124],
    [186, 186, 186],
    [250, 250, 250]
];

export class Board {
    p5: P5;
    cells: number[][];
    size: number;
    colors: number[][];
    toCascade: P5.Vector[];
    lastUpdate: number;
    updateDelayMs: number;

    constructor(p5: P5, size: number) {
        this.p5 = p5;
        this.size = size;
        // this.colors = shades_of_grey;
        this.colors = green_purple_gold;
        this.toCascade = [];
        this.lastUpdate = this.p5.millis();
        this.updateDelayMs = 5;

        this.cells = [];
        for (let y = 0; y < this.size; y++) {
            this.cells.push([]);
            for (let x = 0; x < this.size; x++) {
                this.cells[y].push(0);
            }
        }
    }

    update() {
        if (this.p5.millis() < this.lastUpdate + this.updateDelayMs) {
            return;
        }
        this.lastUpdate = this.p5.millis();
        this.checkToCascade();
        if (this.toCascade.length) {
            // this.cascade();
            while (this.toCascade.length) {
                this.cascade();
                this.checkToCascade();
            }
        } else {
            // this.addGrainRandom();
            // this.addGrainOnMiddle();
            this.addNGrainsOnMiddle(4);
            // this.addSquareInMiddle(5);
        }
    }

    checkToCascade() {
        this.toCascade = [];

        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                if (this.cells[y][x] >= 4) {
                    this.toCascade.push(this.p5.createVector(x, y));
                }
            }
        }
    }

    cascade() {
        if (!this.toCascade.length) {
            throw new Error('Trying to cascade with an empty toCascade list');
        }
        const randomIndex = Math.floor(Math.random() * this.toCascade.length);
        // const randomIndex = 0;
        const {x, y} = this.toCascade.splice(randomIndex, 1)[0];
        if (this.cells[y][x] < 4) {
            // throw new Error(`Trying to cascade a cell with ${this.cells[y][x]} grains on pos ${x},${y}`);
            console.log(`Trying to cascade a cell with ${this.cells[y][x]} grains on pos ${x},${y}. Ignoring.`);
            return;
        }

        this.cells[y][x] -= 4;

        if (y > 0) {
            this.cells[y - 1][x] += 1;
        }
        if (x > 0) {
            this.cells[y][x - 1] += 1;
        }
        if (y < this.size - 1) {
            this.cells[y + 1][x] += 1;
        }
        if (x < this.size - 1) {
            this.cells[y][x + 1] += 1;
        }
    }

    addGrainRandom() {
        const x = Math.floor(Math.random() * this.size);
        const y = Math.floor(Math.random() * this.size);

        this.cells[y][x] += 1;
    }

    addGrainOnPosition(pos: P5.Vector) {
        const {x, y} = pos;

        this.cells[y][x] += 1;
    }

    addGrainOnMiddle() {
        const x = Math.floor(this.size / 2);
        const y = Math.floor(this.size / 2);
        this.addGrainOnPosition(this.p5.createVector(x, y));
    }

    addNGrainsOnMiddle(n) {
        for (let _ = 0; _ < n; _++) {
            this.addGrainOnMiddle();
        }
    }

    addSquareInMiddle(n) {
        const middleX = Math.floor(this.size / 2);
        const middleY = Math.floor(this.size / 2);
        for (let y = middleY - n; y < middleY + n; y++) {
            for (let x = middleX - n; x < middleX + n; x++) {
                this.cells[y][x] += 1;
            }
        }
    }

    draw() {
        this.p5.noStroke();
        const scale = this.p5.width / this.size;
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                const v = this.cells[y][x];
                let c = this.colors[v];
                if (!c) {
                    console.error(`no color for coordinates ${x},${y} with value ${v}`);
                    c = [250, 0, 0];
                }
                this.p5.fill(c);
                this.p5.rect(x * scale, y * scale, scale, scale);
                /*
                 * const text = this.cells[y][x].toString();
                 * const textWidth = this.p5.textWidth(text);
                 * this.p5.stroke(0);
                 * this.p5.fill(0);
                 * this.p5.text(text, x * scale + scale / 2 - textWidth / 2, y * scale + scale / 2);
                 */
            }
        }
    }
}
