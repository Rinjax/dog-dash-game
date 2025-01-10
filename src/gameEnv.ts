import Display from "./display";
import {Input} from "./input";
import {Background} from "./background";
import {GameState, GameStates, StartState} from "./gameState";

export default class GameEnv {
    readonly height: number;
    readonly width: number;

    display: Display;
    input: Input;
    states: GameState[] = [];
    currentState: GameState;

    constructor(canvasId: string, height: number, width: number) {
        this.height = height;
        this.width = width;
        this.display = new Display(canvasId, width, height);
        this.input = new Input({
            jump: 'w',
            left: 'a',
            duck: 's',
            right: 'd',
            roll_attack: 'Enter',
            dive_attack: 's'
        });
        this.states.push(new StartState())
        this.changeState(GameStates.START);
    }

    update(deltaTime: number): void {
        this.currentState.update(deltaTime)
    }

    draw(): void{
        this.currentState.draw(this.display);
        //this.display.ctx.clearRect(0, 0, this.width, this.height);

        //this.background.draw();
        //this.ui.draw();
        //this.enemies.draw();
        //this.player.draw();
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

    changeState(state: GameStates): void {

        this.currentState = this.states[state];
        this.currentState.enter();
    }
}

export class Game {
    readonly height: number;
    readonly width: number;
    score: number = 0;
    speed: number = 1;
    background: Background;
    groundMargin: number = 80;

    constructor(width: number, height: number) {
        this.background = new Background(this)
    }
}