import GameEnv from "./gameEnv";

export class EnemyProcessor {
    game: GameEnv;
    enemies: Enemy[] = [];
    timer: number = 0;
    interval: number = 1000;

    constructor(game: GameEnv) {
        this.game = game;
    }

    update(deltaTime: number): void {
        if (this.timer >= this.interval) {
            this.addEnemy();
            this.timer = 0;
        } else {
            this.timer += deltaTime;
        }

        this.enemies.forEach(e => {
            e.update(deltaTime)
        });

        this. enemies = this.enemies.filter(e => !e.forDeletion);

        //console.log(this.enemies);
    }

    draw(): void {
        this.enemies.forEach(e => e.draw());
    }

    protected addEnemy(): void {
        if (this.game.speed > 0 && Math.random() > 0.6) this.enemies.push(new EnemyPlant(this.game));

        if (Math.random() > 0.8) this.enemies.push(new EnemyBird(this.game));
        else this.enemies.push(new EnemyFly(this.game));
    }
}

class Enemy {
    game: GameEnv
    score: number = 0;
    width: number;
    height: number;
    x: number;
    y: number;
    vx: number = 0;
    vy: number = 0;
    sprite: HTMLImageElement;
    spriteFrameY: number = 0;
    spriteFrameX: number = 0;
    spriteFrameXMax: number = 0;
    spriteFPS: number = 20;
    spriteFrameInterval: number;
    spriteFrameTimer: number = 0;
    forDeletion: boolean = false;

    constructor(game: GameEnv) {
        this.game = game;
        this.spriteFrameInterval = 1000 / this.spriteFPS
    }

    update(deltaTime: number): void {
        if (this.offEdgeScreen()) {
            this.forDeletion = true;
        } else {
            this.x -= this.vx + this.game.speed;
            this.y += this.vy;

            if (this.spriteFrameTimer > this.spriteFrameInterval) {
                this.spriteFrameTimer = 0;
                if (this.spriteFrameX < this.spriteFrameXMax) this.spriteFrameX++
                else this.spriteFrameX = 0;
            } else {
                this.spriteFrameTimer += deltaTime;
            }
        }
    }

    draw(): void {
        this.game.display.ctx.drawImage(
            this.sprite,
            this.spriteFrameX * this.width,
            0,
            this.width,
            this.height,
            this.x,
            this.y,
            this.width,
            this.height,
        )
    }

    offEdgeScreen(): boolean {
        return this.x + this.width < 0;
    }
}

class EnemyFly extends Enemy {
    angle: number = 0;
    va: number;

    constructor(game: GameEnv) {
        super(game);
        this.score = 2
        this.width = 60;
        this.height = 44;
        this.x = this.game.width;
        this.y = Math.random() * this.game.height * 0.5;
        this.vx = Math.random() + 1;
        this.vy = 0;
        this.va = Math.random() * 0.1 + 0.1;
        this.sprite = new Image();
        this.sprite.src = "./assets/sprites/enemy_fly.png";
        this.spriteFrameXMax = 5;
    }

    update(deltaTime: number): void {
        super.update(deltaTime);
        this.angle += this.va;
        this.y += Math.sin(this.angle);
    }
}

class EnemyPlant extends Enemy {

    constructor(game: GameEnv) {
        super(game);
        this.score = 3;
        this.width = 60;
        this.height = 87;
        this.x = this.game.width;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.sprite = new Image();
        this.sprite.src = './assets/sprites/enemy_plant.png';
        this.spriteFrameXMax = 1;
    }
}

class EnemyBird extends Enemy {
    constructor(game: GameEnv) {
        super(game);
        this.score = 5
        this.width = 81.33;
        this.height = 58;
        this.x = this.game.width;
        this.y = 1;
        this.vx = 0.03;
        this.vy = 0.03;
        this.sprite = new Image();
        this.sprite.src = "./assets/sprites/enemy_bird.png";
        this.spriteFrameXMax = 5;
    }

    update(deltaTime: number): void {
        this.y += (this.game.player.y - this.y ) * this.vy;
        this.x -= (this.x - this.game.player.x ) * this.vx;

        if (this.spriteFrameTimer > this.spriteFrameInterval) {
            this.spriteFrameTimer = 0;
            if (this.spriteFrameX < this.spriteFrameXMax) this.spriteFrameX++
            else this.spriteFrameX = 0;
        } else {
            this.spriteFrameTimer += deltaTime;
        }

    }
}