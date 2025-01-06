import Game from "./game";

export abstract class Particle {
    game: Game;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    forDeletion: boolean = false;

    protected constructor(game: Game) {
        this.game = game;
    }

    update(): void {
        this.x -= this.vx + this.game.speed;
        this.y -= this.vy
        this.size *= 0.95;
        if (this.size < 0.5) this.forDeletion = true;
    }

    abstract draw(): void;
}

export class DustParticle extends Particle {
    colour: string = 'rgba(0,0,0,0.2)';

    constructor(game: Game, x: number, y: number) {
        super(game);
        this.x = x;
        this.y = y;
        this.size = Math.random() * 10 + 7;
        this.vx = Math.random();
        this.vy = Math.random();
    }

    draw(): void {
        this.game.display.ctx.beginPath();
        this.game.display.ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        this.game.display.ctx.fillStyle = this.colour;
        this.game.display.ctx.fill();
    }
}

//export class SplashParticle extends Particle {}

export class FireParticle extends Particle {
    private readonly sprite: HTMLImageElement;
    private angle: number = 0;
    private readonly va: number = 0;

    constructor(game: Game, x: number, y: number) {
        super(game);
        this.sprite = new Image();
        this.sprite.src = './assets/sprites/fire.png';
        this.size = Math.random() * 80 + 50;
        this.x = x;
        this.y = y;
        this.vx = 2;
        this.vy = 0.5;
        this.va = Math.random() * 0.2 - 0.1;
    }

    update(): void {
        super.update();
        this.angle += this.va;
        this.x += Math.sin(this.angle * 10);
    }

    draw(): void {
        this.game.display.ctx.save();
        this.game.display.ctx.translate(this.x, this.y);
        this.game.display.ctx.rotate(this.angle);
        this.game.display.ctx.drawImage(this.sprite, 0, 0, this.size, this.size);
        this.game.display.ctx.restore();
    }
}