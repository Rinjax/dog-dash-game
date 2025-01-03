import Game from "./game";
import {States, Sitting, states, Running, Jumping, Falling} from "./playerState";
import Input from "./input";

export default class Player {
    game: Game;
    readonly width: number = 100;
    readonly height: number = 91.3;
    x: number= 0; //location on x axis
    y: number = 100; // location on y axis
    vx: number = 0; // velocity of x axis movement
    vy: number = 0; // velocity of y axis movement
    sprite: HTMLImageElement;
    spriteFrameY: number = 0;
    spriteFrameX: number = 0;
    states: States[];
    currentState: States;

    constructor(game: Game) {
        this.game = game;
        this.sprite = new Image();
        this.sprite.src = "./assets/sprites/player.png";
        this.states.push(new Sitting(this), new Running(this), new Jumping(this), new Falling(this))
    }

    update(control: Input): void {
        this.
    }

    draw(): void {
        //console.log('PLAYER DRAW')
        this.game.display.ctx.drawImage(this.sprite, 0,0,this.width, this.height, this.x, this.y, this.width, this.height);
    }

    onGround(): boolean {
        return true;
    }

    setState(state: states): void {
        this.currentState = this.states[state]
        this.currentState.enter()
    }
}