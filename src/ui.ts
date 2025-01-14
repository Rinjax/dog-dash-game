import {Game} from "./gameEnv";
import Display from "./display";
import Player from "./player";

export default class UI {
    game: Game;
    player: Player;
    fontSize: number = 30;
    fontFamily: string = 'helvetica';
    leftMargin: number = 10;
    lifeSprite: HTMLImageElement;

    constructor(game: Game, player: Player) {
        this.game = game;
        this.player = player;
        this.lifeSprite = new Image()
        this.lifeSprite.src = './assets/sprites/lives.png';
    }

    draw(display: Display): void {
       this.displayScore(display);
        this.displayLives(display);
    }

    displayScore(display: Display): void {
        display.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        display.ctx.textAlign = 'left';
        display.ctx.fillText('Score: ' + this.game.score, this.leftMargin, 40)
    }

    displayLives(display: Display): void {
        let lineHeight = 57;

        display.ctx.font = `${this.fontSize * 0.7}px ${this.fontFamily}`;
        display.ctx.textAlign = 'left';
        display.ctx.textBaseline = 'ideographic';
        display.ctx.fillText('Lives:', this.leftMargin, lineHeight + 10);

        for (let i = 0; i < this.player.lives; i++) {
            display.ctx.drawImage(this.lifeSprite, 68 + i * 25, lineHeight - 10);
        }
    }
}