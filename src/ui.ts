import {Game} from "./gameEnv";
import Display from "./display";

export default class UI {
    game: Game;
    fontSize: number = 30;
    fontFamily: string = 'helvetica';

    constructor(game: Game) {
        this.game = game;
    }

    draw(display: Display): void {
        display.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        display.ctx.textAlign = 'left';
        display.ctx.fillText('Score: ' + this.game.score, 10, 40)
    }
}