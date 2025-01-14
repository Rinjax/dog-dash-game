import Display from "./display";
import {Input} from "./input";
import {Background} from "./background";
import {GameState, GameStates, OverState, PlayingState, StartState} from "./gameState";

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
        this.states.push(new StartState(this), new PlayingState(this), new OverState(this))
        this.changeState(GameStates.START);
    }

    process(deltaTime: number): void {
        this.currentState.process(deltaTime, this.display)
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
    over: boolean = false;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.background = new Background(this)
    }
}