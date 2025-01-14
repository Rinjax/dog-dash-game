import Display from "./display";

export class Sprite {
    width: number = 0;
    height: number = 0;
    sprite: HTMLImageElement;
    spriteFrameY: number = 0;
    spriteFrameX: number = 0;
    spriteFrameXMax: number = 0;
    readonly spriteFPS: number = 20;
    spriteFrameInterval: number;
    spriteFrameTimer: number = 0;

    constructor(assetPath: string, height: number, width: number, frameXMax?: number) {
        this.height = height;
        this.width = width;
        this.spriteFrameXMax = frameXMax;
        this.sprite = new Image();
        this.sprite.src = assetPath;
        this.spriteFrameInterval = 1000 / this.spriteFPS;
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

    draw(display: Display, x: number, y: number): void {
        display.ctx.drawImage(
            this.sprite,
            this.spriteFrameX * this.width,
            this.spriteFrameY * this.height,
            this.width,
            this.height,
            x,
            y,
            this.width,
            this.height
        );
    }
}

export class PlayerSprite extends Sprite {
    constructor(assetPath: string, height: number, width: number) {
        super(assetPath, height, width);
        console.log(this);
    }

    setRunning(): void {
        this.spriteFrameX = 0;
        this.spriteFrameY = 3;
        this.spriteFrameXMax = 8;
    }

    setSitting(): void {
        this.spriteFrameX = 0;
        this.spriteFrameY = 5;
        this.spriteFrameXMax = 4;
    }

    setJumping(): void {
        this.spriteFrameX = 0;
        this.spriteFrameY = 1;
        this.spriteFrameXMax = 6;
    }

    setFalling(): void {
        this.spriteFrameX = 0;
        this.spriteFrameY = 2;
        this.spriteFrameXMax = 6;
    }

    setRolling(): void {
        this.spriteFrameX = 0;
        this.spriteFrameY = 6;
        this.spriteFrameXMax = 6;
    }

    setStunned(): void {
        this.spriteFrameX = 0;
        this.spriteFrameY = 4;
        this.spriteFrameXMax = 10;
    }

    setHurting(): void {
        this.spriteFrameX = 0;
        this.spriteFrameY = 9;
        this.spriteFrameXMax = 4;
    }
}

