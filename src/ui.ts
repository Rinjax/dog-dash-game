import Game from "./game";

export default class UI {
    game: Game;
    fontSize: number = 30;
    fontFamily: string = 'helvetica';

    constructor(game: Game) {
        this.game = game;
    }

    draw(): void {
        this.game.display.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        this.game.display.ctx.textAlign = 'left';

        this.game.display.ctx.fillText('Score: ' + this.game.score, 10, 40)
    }
}