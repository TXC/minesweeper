import Game from './Game';
import Events from './Events';

function Minesweeper () {
    let node, text,
        parent = document.getElementsByClassName('board')[0],
        row, column, id;
    for( row = 0; row < Game.boardSize; row++ ) {
        for( column = 0; column < Game.boardSize; column++ ) {
            id = Game.cellPrefix + row + "" + column;
            node = document.createElement("DIV");
            node.className = 'cell';
            node.setAttribute('id', id);
            parent.appendChild(node);
        }
    }

    // Create messagebox
    node = document.createElement("div");
    node.setAttribute('id', 'messageBox');
    text = document.createTextNode('Make a Move!');
    node.appendChild(text);
    parent.parentNode.insertBefore(node, parent.nextSibling);

    document.addEventListener('keydown', Events.keyDown);
    document.addEventListener('keyup', Events.keyUp);
    Game.newGame();
}
export { Minesweeper };