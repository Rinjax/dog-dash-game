import Game from "./game";

const game = new Game('#canvas', 500, 500);

let lastTime = 0;


function run(timestamp: number): void {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    game.draw()
    game.update(deltaTime)
    requestAnimationFrame(run)
}

run(0)