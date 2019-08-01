import Game from './Game';
import Events from './Events';
import Elements from './Elements';

function Minesweeper (event) {
    Elements.buildInterface();

    document.addEventListener('keydown', Events.keyDown);
    document.addEventListener('keyup', Events.keyUp);
    Game.newGame();
}
export { Minesweeper };