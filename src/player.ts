import GameEnv, {Game} from "./gameEnv";
import {
    Diving,
    Stunned,
    Falling,
    Jumping,
    Rolling,
    Running,
    Sitting,
    State,
    PlayerStates,
    Hurting
} from "./playerState";
import {Actions, Input} from "./input";
import {Particle} from "./particle";
import {PlayingState} from "./gameState";
import {PlayerSprite} from "./sprite";
import Display from "./display";

export default class Player {
    sprite: PlayerSprite
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
    lives: number = 5;
    isAttacking = false;
    isInvulnerable: boolean = false;
    invulnerabilityTimeOut: number = 0;
    invulnerabilityTimer: number = 0;
    invulnerabilityAnimationTimer: number = 0;
    invulnerabilityAnimationTimeOut: number = 500;



    constructor(game: Game) {
        this.sprite = new PlayerSprite('./assets/sprites/player.png', 91.3, 100);
        this.states.push(
            new Sitting(game, this),
            new Running(game, this),
            new Jumping(game, this),
            new Falling(game, this),
            new Rolling(game, this),
            new Diving(game, this),
            new Stunned(game, this),
            new Hurting(game, this),
        )
    }

    update(input: Input, deltaTime: number): void {

        if (this.isInvulnerable) {
            this.invulnerabilityTimer += deltaTime;
            if (this.invulnerabilityTimer > this.invulnerabilityTimeOut) {
                this.exitInvulnerability()
            }
        }

        this.particles.forEach((p: Particle, i: number) => {
            p.update()
        })

        this.particles = this.particles.filter(e => !e.forDeletion);

        if (this.particles.length > this.maxParticles) {
            this.particles = this.particles.slice(0, this.maxParticles);
        }

        this.currentState.handle(input, deltaTime)

        this.sprite.updateAnimation(deltaTime)
    }

    draw(display: Display): void {

        this.sprite.draw(display, this.x +10, this.y +10);
        this.particles.forEach((p: Particle) => p.draw(display))
    }

    setState(state: PlayerStates): void {
        this.currentState = this.states[state]
        this.currentState.enter()
    }

    enterInvulnerability(timeOut: number): void {
        this.isInvulnerable = true;
        this.invulnerabilityTimeOut = timeOut;
        this.invulnerabilityTimer = 0;
    }

    exitInvulnerability(): void {
        this.isInvulnerable = false;
        this.invulnerabilityTimeOut = 0;
    }
}