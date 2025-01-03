export default class Input {
    keys: string[] = [];

    constructor() {
        window.addEventListener('keydown', e => this.keyPressed);
        window.addEventListener('keyup', e => this.keyReleased);
    }

    keyPressed(e: KeyboardEvent): void {
        if ((
            e.key === 'ArrowDown' ||
            e.key === 'ArrowLeft' ||
            e.key === 'ArrowRight' ||
            e.key === 'Space'
        ) && this.keys.indexOf(e.key) === -1) {
            this.keys.push(e.key);
        }
    }

    keyReleased(e: KeyboardEvent): void {
        if (
            e.key === 'ArrowDown' ||
            e.key === 'ArrowLeft' ||
            e.key === 'ArrowRight' ||
            e.key === 'Space'
        ) {
            this.keys.slice(this.keys.indexOf(e.key), 1);
        }
    }
}