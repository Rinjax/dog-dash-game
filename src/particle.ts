import GameEnv, {Game} from "./gameEnv";
import Display from "./display";

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

    abstract draw(display: Display): void;
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

    draw(display: Display): void {
        display.ctx.beginPath();
        display.ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        display.ctx.fillStyle = this.colour;
        display.ctx.fill();
    }
}

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

    draw(display: Display): void {
        display.ctx.save();
        display.ctx.translate(this.x, this.y);
        display.ctx.rotate(this.angle);
        display.ctx.drawImage(this.sprite, 0, 0, this.size, this.size);
        display.ctx.restore();
    }
}

export class SplashParticle extends Particle {
    private readonly sprite: HTMLImageElement;
    private vyMax: number;
    vyGravity: number;
    angle: number = 0;
    va: number = 0;

    constructor(game: Game, x: number) {
        super(game);
        this.sprite = new Image();
        this.sprite.src = './assets/sprites/fire.png';
        this.size = 100;
        this.x = x;
        this.vx = Math.random() * 6 - 3;
        this.vy = 0;
        this.vyGravity = 1;
        this.vyMax =  Math.random() * 20 + 5;
        this.va = Math.random() * 0.2 - 0.1;
        this.size = Math.random() * 80 + 50;

        this.y = this.game.height - this.game.background.groundMargin - this.size
    }

    update(): void {
        //super.update();

        this.size *= 0.996;

       if (this.onGround()) {
           console.log(this.vyMax)
           this.vy -= this.vyMax;
           this.vyMax -= 2;
           if (this.vyMax <= 0 && this.onGround()) {
               this.forDeletion = true;
           }
       }
        this.y += this.vy;
        this.vy += this.vyGravity;
        this.x += this.vx + this.game.speed;

        this.angle += this.va;
        this.x += Math.sin(this.angle * 10);
    }

    draw(display: Display): void {
        display.ctx.save();
        display.ctx.translate(this.x, this.y);
       // display.ctx.rotate(this.angle);
        display.ctx.drawImage(this.sprite, 0, 0, this.size, this.size);
        display.ctx.restore();
    }

    onGround(): boolean {
        return this.y >= this.game.height - this.size - this.game.background.groundMargin;
    }
}