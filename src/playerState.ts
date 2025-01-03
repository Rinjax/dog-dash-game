import Player from "./player";
import Input from "./input";

export enum states {
    SITTING,
    RUNNING,
    JUMPING,
    FALLING,
}

export interface States {
    enter(): void
    handle(input: Input): void
}

export abstract class State {
    state: number

    constructor(state: number) {
        this.state = state;
    }
}

export class Sitting extends State implements States {
    player: Player;

    constructor(player: Player) {
        super(states.SITTING);
        this.player = player;
    }

    enter(): void {
        this.player.spriteFrameY = 5;
    }

    handle(input: Input): void {
        if (input.keys.includes('ArrowLeft') || input.keys.includes('ArrowRight')) {
            this.player.setState(states.RUNNING)
        }
    }
}

export class Jumping extends State implements States {
    player: Player;

    constructor(player: Player) {
        super(states.JUMPING);
        this.player = player;
    }

    enter(): void {
        this.player.spriteFrameY = 5;
    }

    handle(input: Input): void {
        if (input.keys.includes('ArrowLeft') || input.keys.includes('ArrowRight')) {
            this.player.setState(states.RUNNING)
        }
    }
}

export class Running extends State implements States {
    player: Player;

    constructor(player: Player) {
        super(states.RUNNING);
        this.player = player;
    }

    enter(): void {
        this.player.spriteFrameY = 3;
    }

    handle(input: Input): void {
        if (input.keys.includes('ArrowLeft') || input.keys.includes('ArrowRight')) {
            this.player.setState(states.RUNNING)
        }
    }
}

export class Falling extends State implements States {
    player: Player;

    constructor(player: Player) {
        super(states.FALLING);
        this.player = player;
    }

    enter(): void {
        this.player.spriteFrameY = 5;
    }

    handle(input: Input): void {
        if (input.keys.includes('ArrowLeft') || input.keys.includes('ArrowRight')) {
            this.player.setState(states.RUNNING)
        }
    }
}