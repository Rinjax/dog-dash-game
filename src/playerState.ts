import {Actions, Input} from "./input";
import GameEnv from "./gameEnv";
import {DustParticle, FireParticle, SplashParticle} from "./particle";

export enum PlayerStates {
    SITTING,
    RUNNING,
    JUMPING,
    FALLING,
    ROLLING,
    DIVING,
    STUNNED,
}

export abstract class State {
    game: GameEnv;
    state: number

    protected constructor(game: GameEnv, state: PlayerStates) {
        this.game = game;
        this.state = state;
    }

    abstract enter(): void;
    abstract handle(input: Input): void;
}

export class Sitting extends State {
    constructor(game: GameEnv) {
        super(game, PlayerStates.SITTING);
        
    }

    enter(): void {
        this.game.player.spriteFrameX = 0;
        this.game.player.spriteFrameY = 5;
        this.game.player.spriteFrameXMax = 4;
        this.game.player.game.speed = 0
    }

    handle(input: Input): void {
        if (input.keys.includes(Actions.LEFT) || input.keys.includes(Actions.RIGHT)) {
            this.game.player.setState(PlayerStates.RUNNING)
        }
    }
}

export class Running extends State {
    constructor(game: GameEnv) {
        super(game, PlayerStates.RUNNING);
    }

    enter(): void {
        this.game.player.spriteFrameX = 0;
        this.game.player.spriteFrameY = 3;
        this.game.player.spriteFrameXMax = 8;
        this.game.player.game.speed = 2
        this.game.player.resetY();
    }

    handle(input: Input): void {
        this.game.player.particles.unshift(
            new DustParticle(
                this.game,
                this.game.player.x + (this.game.player.width / 3),
                this.game.player.y + this.game.player.height - 2
            )
        );

        if (input.keys.includes(Actions.DUCK)) {
            this.game.player.setState(PlayerStates.SITTING)
        } else if (input.keys.includes(Actions.JUMP)) {
            this.game.player.setState(PlayerStates.JUMPING)
        } else if (input.keys.includes(Actions.ROLL_ATTACK)) {
            this.game.player.setState(PlayerStates.ROLLING)
        }
    }
}

export class Jumping extends State {
    constructor(game: GameEnv) {
        super(game, PlayerStates.JUMPING);
    }

    enter(): void {
        this.game.player.spriteFrameX = 0;
        if (this.game.player.onGround()) this.game.player.vy -= this.game.player.vyMax;
        this.game.player.spriteFrameY = 1;
        this.game.player.spriteFrameXMax = 6;
        this.game.player.game.speed = 4
    }

    handle(input: Input): void {
        if (input.keys.includes(Actions.ROLL_ATTACK)) {
            this.game.player.setState(PlayerStates.ROLLING)
        } else if (input.keys.includes(Actions.DIVE_ATTACk)) {
            this.game.player.setState(PlayerStates.DIVING)
        } else if (this.game.player.vy > this.game.player.vyGravity) {
            this.game.player.setState(PlayerStates.FALLING)
        } else if (!input.keys.includes(Actions.JUMP)) {
            this.game.player.vy = this.game.player.vyGravity
            this.game.player.setState(PlayerStates.FALLING)
        } else {
            this.game.player.y += this.game.player.vy;
            this.game.player.vy += this.game.player.vyGravity
        }
    }
}

export class Falling extends State {
    constructor(game: GameEnv) {
        super(game, PlayerStates.FALLING);
    }

    enter(): void {
        this.game.player.spriteFrameX = 0;
        this.game.player.spriteFrameY = 2;
        this.game.player.spriteFrameXMax = 6;
        this.game.player.game.speed = 4;
    }

    handle(input: Input): void {
        if (input.keys.includes(Actions.ROLL_ATTACK)) {
            this.game.player.setState(PlayerStates.ROLLING);
        } else if (input.keys.includes(Actions.DIVE_ATTACk)) {
            this.game.player.setState(PlayerStates.DIVING);
        } else if (this.game.player.onGround()) {
            this.game.player.vy = 0;
            this.game.player.setState(PlayerStates.RUNNING);
        } else {
            this.game.player.y += this.game.player.vy;
            this.game.player.vy += this.game.player.vyGravity
        }
    }
}

export class Rolling extends State {
    constructor(game: GameEnv) {
        super(game, PlayerStates.ROLLING);
        
    }

    enter(): void {
        console.log("ATTACK")
        this.game.player.spriteFrameX = 0;
        this.game.player.spriteFrameY = 6;
        this.game.player.spriteFrameXMax = 6;
        this.game.player.game.speed = 6;
    }

    handle(input: Input): void {
        if (!input.keys.includes(Actions.ROLL_ATTACK)) {
            if (this.game.player.onGround()) this.game.player.setState(PlayerStates.RUNNING);
            else this.game.player.setState(PlayerStates.JUMPING);
        }

        this.game.player.particles.unshift(
            new FireParticle(
                this.game,
                this.game.player.x - 25 ,
                this.game.player.y - 25,
            )
        );

        if (input.keys.includes(Actions.JUMP) && this.game.player.onGround()) {
            console.log("JUMP ROLL")
            this.game.player.vy -= this.game.player.vyMax;
            this.game.player.y += this.game.player.vy;
        }

        if (!this.game.player.onGround()) {
            this.game.player.vy += this.game.player.vyGravity;
            this.game.player.y += this.game.player.vy;

        } else {
            this.game.player.vy = 0;
            this.game.player.resetY();
        }
    }
}

export class Diving extends State {
    yModifier: number = 5;

    constructor(game: GameEnv) {
        super(game, PlayerStates.DIVING);
    }

    enter(): void {
        this.game.player.spriteFrameX = 0;
        this.game.player.spriteFrameY = 6;
        this.game.player.spriteFrameXMax = 6;
        this.game.player.game.speed = 0;
    }

    handle(input: Input): void {
        /*if (!input.keys.includes(Actions.ROLL_ATTACK)) {
            if (this.game.player.onGround()) this.game.player.setState(states.RUNNING);
            else this.game.player.setState(states.FALLING);
        }*/

        this.game.player.particles.unshift(
            new FireParticle(
                this.game,
                this.game.player.x - 5 ,
                this.game.player.y - 10,
            )
        );

        if (this.game.player.onGround()) {
            console.log("HERE", this.game.player.y, this.game.player.x);
            for (let i=0; i<30; i++) {
                this.game.player.particles.unshift(
                    new SplashParticle(
                        this.game,
                        this.game.player.x - 10,
                        this.game.player.y - 10,
                    )
                );
            }
            this.game.player.resetY();
            this.game.player.setState(PlayerStates.STUNNED)


            return
        }

        this.game.player.vy += this.game.player.vyGravity * this.yModifier;
        this.game.player.y += this.game.player.vy;

        /*if (input.keys.includes(Actions.JUMP) && this.game.player.onGround()) {
            console.log("JUMP ROLL")
            this.game.player.vy -= this.game.player.vyMax;
            this.game.player.y += this.game.player.vy;
        }

        if (!this.game.player.onGround()) {
            this.game.player.vy += this.game.player.vyGravity;
            this.game.player.y += this.game.player.vy;

        } else {
            this.game.player.vy = 0;
            this.game.player.resetY();
        }*/
    }
}

export class Stunned extends State {
    constructor(game: GameEnv) {
        super(game, PlayerStates.STUNNED);
    }

    enter(): void {
        this.game.player.spriteFrameX = 0;
        this.game.player.spriteFrameY = 4;
        this.game.player.spriteFrameXMax = 10;
        this.game.player.game.speed = 0.1;
        this.game.player.resetY();
    }

    handle(input: Input): void {

        //this.game.player.resetY();

    }
}