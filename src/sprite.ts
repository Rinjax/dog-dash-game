
class Sprite {
    readonly width: number = 100;
    readonly height: number = 91.3;
    sprite: HTMLImageElement;
    spriteFrameY: number = 0;
    spriteFrameX: number = 0;
    spriteFrameXMax: number = 0;
    readonly spriteFPS: number = 20;
    spriteFrameInterval: number;
    spriteFrameTimer: number = 0;

    constructor(assetPath: string) {
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
}

export class PlayerSprite extends Sprite {
    constructor(assetPath: string) {
        super(assetPath);
    }

    setRunning(): void {
        this.spriteFrameX = 0;
        this.spriteFrameY = 3;
        this.spriteFrameXMax = 8;
    }
}