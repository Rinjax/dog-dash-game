import {Actions, Input} from "./input";
import {Game} from "./gameEnv";
import {DustParticle, FireParticle, SplashParticle} from "./particle";
import Player from "./player";

export enum PlayerStates {
    SITTING,
    RUNNING,
    JUMPING,
    FALLING,
    ROLLING,
    DIVING,
    STUNNED,
    HURTING
}

export abstract class State {
    game: Game;
    player: Player;
    state: number;


    protected constructor(game: Game, player: Player, state: number) {
        this.game = game;
        this.player = player;
        this.state = state;
    }

    abstract enter(): void;
    abstract handle(input: Input, deltaTime: number): void;

    updateXMovement(input: Input): void {

        // horizontal movement
        this.player.x += this.player.vx;
        if (input.keys.includes(Actions.RIGHT)) this.player.vx = this.player.vxMax;
        else if (input.keys.includes(Actions.LEFT)) this.player.vx = -this.player.vxMax;
        else this.player.vx = 0;
        if (this.player.x < 0) this.player.x = 0;
        if (this.player.x > this.game.width - this.player.sprite.width) this.player.x = this.game.width - this.player.sprite.width;
    }

    onGround(): boolean {
        return this.player.y >= this.game.height - this.player.sprite.height - this.game.background.groundMargin;
    }

    resetY(): void {
        let r = this.game.height - this.player.sprite.height - this.game.background.groundMargin;
        console.log('YY', this.game.height, this.player.sprite.height, this.game.background.groundMargin, r);
        this.player.y = this.game.height - this.player.sprite.height - this.game.background.groundMargin;
    }
}

export class Sitting extends State {
    constructor(game: Game, player: Player) {
        super(game, player, PlayerStates.SITTING);
        
    }

    enter(): void {
        this.player.isAttacking = false;
        this.player.sprite.setSitting();
        this.game.speed = 0;
    }

    handle(input: Input, deltaTime: number): void {

        if (input.keys.includes(Actions.LEFT) || input.keys.includes(Actions.RIGHT)) {
            this.player.setState(PlayerStates.RUNNING)
        }
    }
}

export class Running extends State {
    constructor(game: Game, player: Player) {
        super(game, player, PlayerStates.RUNNING);
    }

    enter(): void {
        this.player.isAttacking = false;
        this.player.sprite.setRunning()
        this.game.speed = 2
        this.resetY();
    }

    handle(input: Input, deltaTime: number): void {
        this.player.particles.unshift(
            new DustParticle(
                this.game,
                this.player.x + (this.player.sprite.width / 3),
                this.player.y + this.player.sprite.height - 2
            )
        );

        this.updateXMovement(input);

        if (input.keys.includes(Actions.DUCK)) {
            this.player.setState(PlayerStates.SITTING)
        } else if (input.keys.includes(Actions.JUMP)) {
            this.player.setState(PlayerStates.JUMPING)
        } else if (input.keys.includes(Actions.ROLL_ATTACK)) {
            this.player.setState(PlayerStates.ROLLING)
        }
    }
}

export class Jumping extends State {
    constructor(game: Game, player: Player) {
        super(game, player, PlayerStates.JUMPING);
    }

    enter(): void {
        if (this.onGround()) this.player.vy -= this.player.vyMax;
        this.player.isAttacking = false;
        this.player.sprite.setJumping()
        this.game.speed = 4
    }

    handle(input: Input, deltaTime: number): void {

        if (input.keys.includes(Actions.ROLL_ATTACK)) {
            this.player.setState(PlayerStates.ROLLING)
        } else if (input.keys.includes(Actions.DIVE_ATTACK)) {
            this.player.setState(PlayerStates.DIVING)
        } else if (this.player.vy > this.player.vyGravity) {
            this.player.setState(PlayerStates.FALLING)
        } else if (!input.keys.includes(Actions.JUMP)) {
            this.player.vy = this.player.vyGravity
            this.player.setState(PlayerStates.FALLING)
        } else {
            this.player.y += this.player.vy;
            this.player.vy += this.player.vyGravity

            this.updateXMovement(input);
        }
    }
}

export class Falling extends State {
    constructor(game: Game, player: Player) {
        super(game, player, PlayerStates.FALLING);
    }

    enter(): void {
        this.player.isAttacking = false;
        this.player.sprite.setFalling()
        this.game.speed = 4;
    }

    handle(input: Input, deltaTime: number): void {

        if (input.keys.includes(Actions.ROLL_ATTACK)) {
            this.player.setState(PlayerStates.ROLLING);
        } else if (input.keys.includes(Actions.DIVE_ATTACK)) {
            this.player.setState(PlayerStates.DIVING);
        } else if (this.onGround()) {
            this.player.vy = 0;
            this.player.setState(PlayerStates.RUNNING);
        } else {
            this.player.y += this.player.vy;
            this.player.vy += this.player.vyGravity
            this.updateXMovement(input);
        }
    }
}

export class Rolling extends State {
    constructor(game: Game, player: Player) {
        super(game, player, PlayerStates.ROLLING);
        
    }

    enter(): void {
        this.player.isAttacking = true;
        this.player.sprite.setRolling()
        this.game.speed = 6;
    }

    handle(input: Input, deltaTime: number): void {

        if (!input.keys.includes(Actions.ROLL_ATTACK)) {
            if (this.onGround()) this.player.setState(PlayerStates.RUNNING);
            else this.player.setState(PlayerStates.JUMPING);
        }

        this.player.particles.unshift(
            new FireParticle(
                this.game,
                this.player.x - 25 ,
                this.player.y - 25,
            )
        );

        if (input.keys.includes(Actions.JUMP) && this.onGround()) {
            console.log("JUMP ROLL")
            this.player.vy -= this.player.vyMax;
            this.player.y += this.player.vy;
        }

        if (!this.onGround()) {
            this.player.vy += this.player.vyGravity;
            this.player.y += this.player.vy;

        } else {
            this.player.vy = 0;
            this.resetY();
        }

        this.updateXMovement(input);
    }
}

export class Diving extends State {
    yModifier: number = 5;

    constructor(game: Game, player: Player) {
        super(game, player, PlayerStates.DIVING);
    }

    enter(): void {
        this.player.isAttacking = true;
        this.player.sprite.setRolling();
        this.game.speed = 0;
    }

    handle(input: Input, deltaTime: number): void {

        this.player.particles.unshift(
            new FireParticle(
                this.game,
                this.player.x - 5 ,
                this.player.y - 10,
            )
        );

        if (this.onGround()) {
            for (let i=0; i<30; i++) {
                this.player.particles.unshift(
                    new SplashParticle(
                        this.game,
                        this.player.x - 10,
                        this.player.y - 10,
                    )
                );
            }
            this.resetY();
            this.player.setState(PlayerStates.STUNNED)


            return
        }

        this.player.vy += this.player.vyGravity * this.yModifier;
        this.player.y += this.player.vy;
    }
}

export class Stunned extends State {
    stunTimer: number = 0;
    stunTimeOut: number = 4000;

    constructor(game: Game, player: Player) {
        super(game, player, PlayerStates.STUNNED);
    }

    enter(): void {
        this.player.isAttacking = false;
        this.player.sprite.setStunned();
        this.game.speed = 0;
        this.resetY();
    }

    handle(input: Input, deltaTime: number): void {

        this.stunTimer += deltaTime;
        if (this.stunTimer > this.stunTimeOut) {
            this.player.setState(PlayerStates.SITTING)
            this.stunTimer = 0
        }
    }
}

export class Hurting extends State {
    hurtTimer: number = 0;
    hurtTimeOut: number = 1300;

    constructor(game: Game, player: Player) {
        super(game, player, PlayerStates.STUNNED);
    }

    enter(): void {
        this.player.enterInvulnerability(6000)
        this.player.isAttacking = false;
        this.player.sprite.setHurting();
        this.game.speed = 0;
        this.resetY();
    }

    handle(input: Input, deltaTime: number): void {

        this.hurtTimer += deltaTime;
        if (this.hurtTimer > this.hurtTimeOut) {
            this.player.setState(PlayerStates.RUNNING)
            this.hurtTimer = 0
        }
        if (this.player.x > 0) {
            this.player.x--
        }

        if (!this.onGround()) {
            this.player.y += this.player.vy;
            this.player.vy += this.player.vyGravity
        }
    }
}