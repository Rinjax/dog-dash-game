import {Game} from "./gameEnv";

interface LayerAsset {
    path: string;
    speedModifier: number;
}

export class Layer {
    game: Game;
    width: number;
    height: number;
    image: HTMLImageElement;
    speedModifier: number;
    x: number = 0;
    y: number = 0;

    constructor(
        {game, width, height, image, speedModifier}:
        {game: Game, width: number, height: number, image: string, speedModifier: number}
    ) {
        this.game = game;
        this.width = width;
        this.height = height;
        this.speedModifier = speedModifier;
        this.image = new Image();
        this.image.src = image;
    }

    update(): void {
        if (this.x < -this.width) this.x = 0;
        else this.x -= this.game.speed * this.speedModifier;
    }

    draw(): void {
        this.game.display.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        this.game.display.ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }
}

export class Background {
    game: Game
    groundMargin: number = 80;
    width: number = 1667;
    height: number = 500;
    layers: Layer[] = [];
    layerAssets: LayerAsset[] = [
        {path: './assets/backgrounds/layer-1.png', speedModifier: 0},
        {path: './assets/backgrounds/layer-2.png', speedModifier: 0.2},
        {path: './assets/backgrounds/layer-3.png', speedModifier: 0.4},
        {path: './assets/backgrounds/layer-4.png', speedModifier: 0.8},
        {path: './assets/backgrounds/layer-5.png', speedModifier: 1},
    ];

    constructor(game: Game) {
        this.game = game;
        this.layerAssets.forEach(asset => {
            this.layers.push(new Layer({
                game,
                width: this.width,
                height: this.height,
                image: asset.path,
                speedModifier: asset.speedModifier
            }))
        })
    }

    update(): void {
        this.layers.forEach((layer) => layer.update())
    }
    draw(): void {
        this.layers.forEach((layer) => layer.draw())
    }
}