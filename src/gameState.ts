import GameEnv, {Game} from "./gameEnv";
import Player from "./player";
import {PlayerStates} from "./playerState";
import {Input} from "./input";
import {Background} from "./background";
import {EnemyProcessor} from "./enemy";
import UI from "./ui";
import {PlayerSprite} from "./sprite";
import Display from "./display";

export interface GameState {
    enter(): void
    process(deltaTime: number, display: Display): void
    //update(deltaTime: number): void
    //draw(display: Display): void
}

export enum GameStates {
    START,
    PLAYING,
    OVER,
}

export class StartState implements GameState {
    gameEnv: GameEnv;
    input: Input;
    title: string = 'Dog Dash'
    fontSize: number = 40;
    fontFamily: string = 'helvetica';
    sprite: PlayerSprite;

    constructor(gameEnv: GameEnv) {
        this.gameEnv = gameEnv;
        this.input = gameEnv.input;
        this.sprite = new PlayerSprite('./assets/sprites/player.png', 91.3, 100)
    }

    enter(): void {
        this.sprite.setRunning()
    }

    update(deltaTime: number): void {
        if (this.input.keys.length > 0) this.gameEnv.changeState(GameStates.PLAYING)
        else this.sprite.updateAnimation(deltaTime)
    }

    draw(display: Display): void {
        const grad= display.ctx.createLinearGradient(0, 0, 0, display.height);
        grad.addColorStop(0, "black");
        grad.addColorStop(1, "grey");

        // Background
        display.ctx.fillStyle = grad;
        display.ctx.fillRect(0,0, display.width,display.height);

        // Title text
        display.ctx.textAlign = "center";
        display.ctx.fillStyle = "white";
        display.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        display.ctx.fillText(this.title, display.width * 0.5, 100);

        // Body Text
        display.ctx.textAlign = "center";
        display.ctx.fillStyle = "white";
        display.ctx.font = `${this.fontSize * 0.6}px ${this.fontFamily}`;
        display.ctx.fillText("Press enter to start", display.width * 0.5, display.height * 0.5 + 10);

       this.sprite.draw(display, display.width * 0.5 - this.sprite.width * 0.5, display.height - this.sprite.height - 30);
    }

    process(deltaTime: number, display: Display): void {
        this.update(deltaTime);
        this.draw(display);
    }
}

export class PlayingState implements GameState {
    gameEnv: GameEnv;
    game: Game;
    input: Input;
    enemies: EnemyProcessor;
    ui: UI;
    player: Player;

    constructor(gameEnv: GameEnv) {
        this.gameEnv = gameEnv;
        this.game = new Game(this.gameEnv.width, this.gameEnv.height);
        this.player = new Player(this.game);
        this.input = this.gameEnv.input;
        this.enemies = new EnemyProcessor(this.game, this.player);
        this.ui = new UI(this.game, this.player);
    }

    enter(): void {
        this.player.setState(PlayerStates.RUNNING)
    }

    process(deltaTime: number, display: Display): void {
        if (!this.game.over) {
            this.game.background.update();
            this.player.update(this.input, deltaTime)

            display.ctx.clearRect(0, 0, display.width, display.height);

            this.game.background.draw(display);
            this.player.draw(display);
            this.enemies.processEnemies(deltaTime,display);
            this.enemies.processKilledEnemies(deltaTime,display);

            this.ui.draw(display);
        } else {
            this.gameEnv.changeState(GameStates.OVER)
        }

    }


}

export class OverState implements GameState {
    gameEnv: GameEnv;
    input: Input;
    title: string = 'Game Over'
    fontSize: number = 40;
    fontFamily: string = 'helvetica';
    sprite: PlayerSprite;

    constructor(gameEnv: GameEnv) {
        this.gameEnv = gameEnv;
        this.input = gameEnv.input;
        this.sprite = new PlayerSprite('./assets/sprites/player.png', 91.3, 100)
    }

    enter(): void {
        this.sprite.setStunned()
    }

    update(deltaTime: number): void {
        if (this.input.keys.length > 0) this.gameEnv.changeState(GameStates.START)
        else this.sprite.updateAnimation(deltaTime)
    }

    draw(display: Display): void {
        const grad= display.ctx.createLinearGradient(0, 0, 0, display.height);
        grad.addColorStop(0, "black");
        grad.addColorStop(1, "grey");

        // Background
        display.ctx.fillStyle = grad;
        display.ctx.fillRect(0,0, display.width,display.height);

        // Title text
        display.ctx.textAlign = "center";
        display.ctx.fillStyle = "white";
        display.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        display.ctx.fillText(this.title, display.width * 0.5, 100);

        // Body Text
        display.ctx.textAlign = "center";
        display.ctx.fillStyle = "white";
        display.ctx.font = `${this.fontSize * 0.6}px ${this.fontFamily}`;
        display.ctx.fillText("Press enter to start", display.width * 0.5, display.height * 0.5 + 10);

        this.sprite.draw(display, display.width * 0.5 - this.sprite.width * 0.5, display.height - this.sprite.height - 30);
    }

    process(deltaTime: number, display: Display): void {
        this.update(deltaTime);
        this.draw(display);
    }
}