

export enum Actions {
    JUMP = 'jump',
    LEFT = 'left',
    DUCK = 'duck',
    RIGHT = 'right',
    ROLL_ATTACK = 'roll_attack',
    DIVE_ATTACK = 'dive_attack'
}

interface KeyBindings {
    jump: string;
    left: string;
    duck: string;
    right: string;
    roll_attack: string
    dive_attack: string
}


export class Input {
    keys: string[] = [];
    keyBindings: KeyBindings;

    constructor(binding: KeyBindings) {
        this.keyBindings = binding;

        window.addEventListener('keydown', e => this.keyPressed(e));
        window.addEventListener('keyup', e => this.keyReleased(e));
    }

    keyPressed(e: KeyboardEvent): void {
        console.log(e.key)

        Object.entries(this.keyBindings).some(([attr, val]) => {
            if (val === e.key && this.keys.indexOf(attr) == -1) this.keys.push(attr);
        });

        console.log(this.keys)
    }

    keyReleased(e: KeyboardEvent): void {
        Object.entries(this.keyBindings).some(([attr, val]) => {
            if (val === e.key) this.keys.splice(this.keys.indexOf(attr), 1);
        });
    }
}