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
    update(deltaTime: number): void
    draw(display: Display): void
}

export enum GameStates {
    START,
    PLAYING,
    OVER,
}

export class StartState implements GameState {
    input: Input;
    title: string = 'Dog Dash'
    fontSize: number = 40;
    fontFamily: string = 'helvetica';
    sprite: PlayerSprite;

    constructor() {
        this.sprite = new PlayerSprite('./assets/sprites/player.png')
    }

    enter(): void {
        this.sprite.setRunning()
    }

    update(deltaTime: number): void {
        this.sprite.updateAnimation(deltaTime)
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

       //this.player.draw();
    }
}

export class PlayingState implements GameState {
    game: Game;
    input: Input;
    background: Background;
    enemies: EnemyProcessor;
    ui: UI;
    player: Player;

    constructor(game: Game) {
        this.game = game;
        this.player = new Player(this.game);
        this.input = new Input({
            jump: 'w',
            left: 'a',
            duck: 's',
            right: 'd',
            roll_attack: 'Enter',
            dive_attack: 's'
        });
        this.background = new Background(this.game);
        this.enemies = new EnemyProcessor(this.game, this.background);
        this.ui = new UI(this.game);

        this.player.setState(PlayerStates.RUNNING);
    }

    enter(): void {}

    update(deltaTime: number): void {
        //this.checkCollisions()

        //this.background.update();
        //this.player.update(this.input, deltaTime);

        //enemies
        //this.enemies.update(deltaTime);

        this.player.update(this.input, deltaTime)

    }

    draw(): void {
        //display.ctx.clearRect(0, 0, this.width, this.height);

        //this.background.draw();
        //this.ui.draw();
        //this.enemies.draw();
        //this.player.draw();
    }
}