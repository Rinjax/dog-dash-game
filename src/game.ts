import Player from "./player";
import Display from "./display";
import Input from "./input";

export default class Game {
    height: number
    width: number
    player: Player
    display: Display
    input: Input

    constructor(canvasId: string, height: number, width: number) {
        this.height = height;
        this.width = width;
        this.display = new Display(canvasId, width, height);
        this.player = new Player(this);
        this.input = new Input();
    }

    update(): void {
        this.player.update(this.input);
    }

    draw(): void{
        this.display.ctx.clearRect(0, 0, this.width, this.height);
        this.player.draw()
    }
}