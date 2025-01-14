import {Game} from "./gameEnv";
import Display from "./display";
import Player from "./player";
import {PlayerStates} from "./playerState";
import {Sprite} from "./sprite";

export class EnemyProcessor {
    game: Game;
    player: Player;
    enemies: EnemyBasic[] = [];
    enemyExplosions: EnemyKilled[] = [];
    timer: number = 0;
    interval: number = 10000;

    constructor(game: Game, player: Player) {
        this.game = game;
        this.player = player;
    }

    protected addEnemy(): void {
        if (this.game.speed > 0 && Math.random() > 0.6) this.enemies.push(new EnemyPlant(this.game, this.player));

        if (Math.random() > 0.8) this.enemies.push(new EnemyBird(this.game, this.player));
        else if (Math.random() > 0.8) this.enemies.push(new EnemyWorm(this.game, this.player));
        else this.enemies.push(new EnemyFly(this.game, this.player));
    }

    protected checkCollision(enemy: EnemyBasic): boolean{
        return (
            enemy.x < this.player.x + this.player.sprite.width &&
            enemy.x + enemy.sprite.width > this.player.x &&
            enemy.y < this.player.y + this.player.sprite.height &&
            enemy.y + enemy.sprite.height > this.player.y
        )
    }

    processKilledEnemies(deltaTime: number, display: Display): void {
        this.enemyExplosions.forEach(e => {
            e.update(deltaTime);
            e.draw(display)
        })

        this.enemyExplosions = this.enemyExplosions.filter(e => !e.forDeletion)
    }

    processEnemies(deltaTime: number, display: Display): void {
        if (this.timer >= this.interval) {
            this.addEnemy();
            this.timer = 0;
        } else {
            this.timer += deltaTime;
        }

        this.enemies.forEach(e => {
            e.update(deltaTime)
            if (this.checkCollision(e)) {
                if (this.player.isAttacking) {
                    e.forDeletion = true;
                    this.game.score += e.score;
                    this.enemyExplosions.push(new EnemyKilled(this.game, e.x, e.y))

                }else if (this.player.isInvulnerable) {
                    e.forDeletion = true;
                    return;
                } else if (!this.player.isInvulnerable && this.player.currentState.state != PlayerStates.HURTING) {
                    this.player.setState(PlayerStates.HURTING)
                    this.game.score--
                    this.player.lives--
                    if (this.player.lives <= 0) {
                        this.game.over = true;
                    }
                }
            }

            e.draw(display)
        });

        this.enemies = this.enemies.filter(e => !e.forDeletion);
    }
}

class Enemy {
    game: Game
    x: number;
    y: number;
    vx: number = 0;
    vy: number = 0;
    sprite: Sprite;
    forDeletion: boolean = false;

    constructor(game: Game, sprite: Sprite) {
        this.game = game;
        this.sprite = sprite;
    }

    update(deltaTime: number): void {
        if (this.offEdgeScreen()) {
            this.forDeletion = true;
        } else {
            this.x -= this.vx + this.game.speed;
            this.y += this.vy;

            this.sprite.updateAnimation(deltaTime);
        }
    }

    draw(display: Display): void {
        this.sprite.draw(display, this.x, this.y);
    }

    offEdgeScreen(): boolean {
        return this.x + this.sprite.width < 0;
    }
}

class EnemyBasic extends Enemy{
    game: Game
    player: Player;
    score: number = 0;

    constructor(game: Game, player: Player, sprite: Sprite) {
        super(game, sprite);
        this.player = player;
    }
}

class EnemyKilled extends Enemy {
    constructor(game: Game, x: number, y: number) {
        super(game, new Sprite('./assets/sprites/boom.png', 90, 100, 4));
        this.x = x;
        this.y = y;
    }

    update(deltaTime: number) {
        super.update(deltaTime);
        if (this.sprite.spriteFrameX === this.sprite.spriteFrameXMax) this.forDeletion = true;
    }
}


class EnemyFly extends EnemyBasic {
    angle: number = 0;
    va: number;

    constructor(game: Game, player: Player) {
        super(game, player, new Sprite("./assets/sprites/enemy_fly.png", 44, 60, 5));
        this.score = 2
        this.x = this.game.width;
        this.y = Math.random() * this.game.height * 0.5;
        this.vx = Math.random() + 1;
        this.vy = 0;
        this.va = Math.random() * 0.1 + 0.1;
    }

    update(deltaTime: number): void {
        super.update(deltaTime);
        this.angle += this.va;
        this.y += Math.sin(this.angle);
    }
}

class EnemyPlant extends EnemyBasic {

    constructor(game: Game, player: Player) {
        super(game, player, new Sprite("./assets/sprites/enemy_plant.png", 87, 60, 1));
        this.score = 3;
        this.x = this.game.width;
        this.y = this.game.height - this.game.background.groundMargin - (this.sprite.height - 10);
    }
}

class EnemyBird extends EnemyBasic {
    constructor(game: Game, player: Player) {
        super(game, player, new Sprite("./assets/sprites/enemy_bird.png", 58, 81.33, 5));
        this.score = 5
        this.x = this.game.width;
        this.y = 1;
        this.vx = 0.03;
        this.vy = 0.03;
    }

    update(deltaTime: number): void {
        // track player's location
        this.y += (this.player.y - this.y ) * this.vy;
        this.x -= (this.x - this.player.x ) * this.vx;

        this.sprite.updateAnimation(deltaTime);
    }
}

class EnemyWorm extends EnemyBasic {

    constructor(game: Game, player: Player) {
        super(game, player, new Sprite("./assets/sprites/enemy_worm.png", 60, 80, 5));
        this.score = 3;
        this.x = this.game.width;
        this.y = this.game.height - this.game.background.groundMargin - (this.sprite.height - 10);
        this.vx = Math.random() + 1;
    }
}