import GameEnv from "./gameEnv";

const game = new GameEnv('#canvas', 500, 500);

let lastTime = 0;


function run(timestamp: number): void {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    game.process(deltaTime)
    requestAnimationFrame(run)
}

run(0)