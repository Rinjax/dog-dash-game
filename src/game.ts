import Player from "./player";
import Display from "./display";
import { Input } from "./input";
import {Background} from "./background";
import {EnemyProcessor} from "./enemy";
import UI from "./ui";
import {States} from "./playerState";

export default class Game {
    readonly height: number;
    readonly width: number;
    player: Player;
    display: Display;
    input: Input;
    background: Background;
    speed: number = 1;
    groundMargin: number = 80;
    enemies: EnemyProcessor;
    score: number = 0;
    ui: UI;

    constructor(canvasId: string, height: number, width: number) {
        this.height = height;
        this.width = width;
        this.display = new Display(canvasId, width, height);
        this.player = new Player(this);
        this.input = new Input({
            jump: 'w',
            left: 'a',
            duck: 's',
            right: 'd',
            roll_attack: 'Enter',
            dive_attack: 's'
        });
        this.background = new Background(this);
        this.enemies = new EnemyProcessor(this);
        this.ui = new UI(this);

        this.player.setState(States.RUNNING);
    }

    update(deltaTime: number): void {
        this.checkCollisions()

        this.background.update();
        this.player.update(this.input, deltaTime);

        //enemies
        this.enemies.update(deltaTime);

    }

    draw(): void{
        this.display.ctx.clearRect(0, 0, this.width, this.height);

        this.background.draw();
        this.ui.draw();
        this.enemies.draw();
        this.player.draw();
    }

    checkCollisions(): void{
        this.enemies.enemies.forEach(e => {
            if (
                e.x < this.player.x + this.player.width &&
                e.x + e.width > this.player.x &&
                e.y < this.player.y + this.player.height &&
                e.y + e.height > this.player.y
            ) {
                // check player state
                  //kill
                  // hurta
                e.forDeletion = true;
                this.score += e.score;
            }
        })
    }
}