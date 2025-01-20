import Display from "./display";
import {Input} from "./input";
import {Background} from "./background";
import {GameState, GameStates, OverState, PlayingState, StartState} from "./gameState";

/**
 * GameEnv is the main wrapper around the whole game environment. Responsible for instantiating the states of the
 * game and all dependencies.
 */
export default class GameEnv {
    readonly height: number;
    readonly width: number;

    game: Game;
    display: Display;
    input: Input;
    states: GameState[] = [];
    currentState: GameState;

    constructor(canvasId: string, height: number, width: number) {
        this.height = height;
        this.width = width;
        this.display = new Display(canvasId, this.width, this.height);
        this.game = new Game(this.width, this.height);
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

/**
 * Game is the main class that holds the attributes of the playing game, such as the player's score, the game speed
 * and background (level)
 */
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

    /**
     * reset is a helper method to reset the game back to a fresh start
     */
    reset(): void {
        this.score = 0;
        this.speed = 1;
        this.over = false;
    }
}