import GameEnv, {Game} from "./gameEnv";
import {Diving, Stunned, Falling, Jumping, Rolling, Running, Sitting, State, PlayerStates} from "./playerState";
import {Actions, Input} from "./input";
import {Particle} from "./particle";
import {PlayingState} from "./gameState";
import {PlayerSprite} from "./sprite";
import Display from "./display";

export default class Player {
    //game: Game;
    sprite: PlayerSprite
    //readonly width: number = 100;
    //readonly height: number = 91.3;
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

    constructor(game: Game) {
        this.sprite = new PlayerSprite('./assets/sprites/player.png');
        this.states.push(new Sitting(game, this), new Running(game, this), new Jumping(game, this), new Falling(game, this), new Rolling(game, this), new Diving(game, this), new Stunned(game, this))
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
            this.currentState.handle(input);
        }

        this.sprite.updateAnimation(deltaTime)
    }

    draw(display: Display): void {
        this.sprite.draw(display, this.x, this.y);
        this.particles.forEach((p: Particle) => p.draw(display))
    }



    setState(state: PlayerStates): void {
        this.currentState = this.states[state]
        this.currentState.enter()
    }




}