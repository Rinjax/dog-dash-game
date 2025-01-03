import Game from "./game";

const game = new Game('#canvas', 500, 500);


function run(): void {
    game.draw()
    game.update()
    requestAnimationFrame(run)
}

run()