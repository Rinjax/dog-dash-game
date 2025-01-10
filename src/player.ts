import GameEnv from "./gameEnv";
import {Diving, Stunned, Falling, Jumping, Rolling, Running, Sitting, State, PlayerStates} from "./playerState";
import {Actions, Input} from "./input";
import {Particle} from "./particle";
import {PlayingState} from "./gameState";
import {PlayerSprite} from "./sprite";

export default class Player {
    game: GameEnv;
    sprite: PlayerSprite
    readonly width: number = 100;
    readonly height: number = 91.3;
    x: number= 0; //location on x axis
    y: number = 0 // location on y axis
    vx: number = 0; // velocity of x axis movement
    vxMax: number = 9;
    vy: number = 0; // velocity of y axis movement
    vyGravity: number = 0.7;
    vyMax: number = 22; // jump power
    states: State[] = [];
    currentState: State;
    particles: Particle[] = [];
    maxParticles: number = 100;
    stunTimer: number = 0;
    stunTimerMax: number = 4000;

    constructor(gameState: PlayingState) {
        this.game = gameState.game;
        this.sprite = new PlayerSprite('./assets/sprites/player.png');
        this.states.push(new Sitting(this.game), new Running(this.game), new Jumping(this.game), new Falling(this.game), new Rolling(this.game), new Diving(this.game), new Stunned(this.game))
        this.resetY();
    }

    update(input: Input, deltaTime: number): void {

        this.particles.forEach((p: Particle, i: number) => {
            p.update()
        })

        this.particles = this.particles.filter(e => !e.forDeletion);

        if (this.particles.length > this.maxParticles) {
            this.particles = this.particles.slice(0, this.maxParticles);
        }

        if (this.currentState.state === PlayerStates.STUNNED) {
           this.stunTimer += deltaTime;
           if (this.stunTimer > this.stunTimerMax) {
               this.setState(PlayerStates.SITTING)
               this.stunTimer = 0
           }
        } else {
            this.updateMovement(input);
        }

        this.currentState.handle(input)

        this.updateAnimation(deltaTime)
    }

    draw(): void {


        this.game.display.ctx.drawImage(
            this.sprite,
            this.spriteFrameX * this.width,
            this.spriteFrameY * this.height,
            this.width,
            this.height,
            this.x,
            this.y,
            this.width,
            this.height
        );

        this.particles.forEach((p: Particle) => p.draw())
    }

    onGround(): boolean {
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }

    setState(state: PlayerStates): void {
        this.currentState = this.states[state]
        this.currentState.enter()
    }

    updateMovement(input: Input): void {



        // horizontal movement
        this.x += this.vx;
        if (input.keys.includes(Actions.RIGHT)) this.vx = this.vxMax;
        else if (input.keys.includes(Actions.LEFT)) this.vx = -this.vxMax;
        else this.vx = 0;
        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;
    }

    updateAnimation(deltaTime: number): void {
        if (this.spriteFrameTimer > this.spriteFrameInterval) {
            this.spriteFrameTimer = 0;
            if (this.spriteFrameX < this.spriteFrameXMax) this.spriteFrameX++;
            else this.spriteFrameX = 0;
        } else {
            this.spriteFrameTimer += deltaTime
        }
    }

    resetY(): void {
        this.y = this.game.height - this.height - this.game.groundMargin;
    }
}