import {Game} from "./gameEnv";
import Display from "./display";
import Player from "./player";

export default class UI {
    game: Game;
    player: Player;
    fontSize: number = 22;
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
        this.displayEnergy(display);
    }

    displayScore(display: Display): void {
        let lineHeight = 100;

        display.ctx.font = `${this.fontSize * 0.9}px ${this.fontFamily}`;
        display.ctx.textAlign = 'left';
        display.ctx.fillText('Score: ' + this.game.score, this.leftMargin, lineHeight)
    }

    displayLives(display: Display): void {
        let lineHeight = 40;

        display.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        display.ctx.textAlign = 'left';
        display.ctx.textBaseline = 'ideographic';
        display.ctx.fillText('Lives:', this.leftMargin, lineHeight);

        for (let i = 0; i < this.player.lives; i++) {
            display.ctx.drawImage(this.lifeSprite, 68 + i * 25, lineHeight - this.lifeSprite.height + 3);
        }
    }

    displayEnergy(display: Display): void {
        let lineHeight = 60;

        display.ctx.font = `${this.fontSize * 0.9}px ${this.fontFamily}`;
        display.ctx.textAlign = 'left';
        display.ctx.textBaseline = 'ideographic';
        display.ctx.fillText('Energy: ' + this.player.energy, this.leftMargin, lineHeight + 10);
    }
}