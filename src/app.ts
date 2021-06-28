import P5 from 'p5';
import 'p5/lib/addons/p5.dom';
import './styles.scss';
import {Board} from './Board';

const sketch = (p5: P5) => {
    let D = 700;
    let frameRateHistory = new Array(10).fill(0);
    let board;

    // The sketch setup method
    p5.setup = () => {
        // Creating and positioning the canvas
        const canvas = p5.createCanvas(D, D);
        canvas.parent('app');

        board = new Board(p5, 201);
    };

    // The sketch draw method
    p5.draw = () => {
        p5.background(0, 0, 0);

        board.update();
        board.draw();

        drawFPS();
    };

    p5.mousePressed = () => {
        const x = Math.floor(p5.map(p5.mouseX, 0, p5.width, 0, board.size));
        const y = Math.floor(p5.map(p5.mouseY, 0, p5.width, 0, board.size));
        board.addGrainOnPosition(p5.createVector(x, y));
    };

    const drawFPS = () => {
        const fpsText = `${getFrameRate()} fps`;
        p5.stroke('white');
        p5.fill('white');
        p5.text(fpsText, 10, 10);
    };
    const getFrameRate = () => {
        frameRateHistory.shift();
        frameRateHistory.push(p5.frameRate());
        let total = frameRateHistory.reduce((a, b) => a + b) / frameRateHistory.length;
        return total.toFixed(0);
    };
};

new P5(sketch);
