import Game from "./Game";
import Events from "./Events";

export class Elements {
    static parentElement = document.getElementsByTagName('main')[0];

    static buildInterface() {
        Elements.title();
        Elements.instructions();
        Elements.messageBox();
        Elements.board();
        Elements.controls();
    }

    // Create title
    static title () {
        let node = document.createElement("h1");
        let text = document.createTextNode('MineSweeper');
        node.appendChild(text);

        let spanElement = document.createElement("span");
        spanElement.className = 'question';
        spanElement.innerHTML = '&#65046;';
        spanElement.addEventListener('click', Events.question);
        node.appendChild(spanElement);

        Elements.parentElement.appendChild(node)
    }

    // Create messagebox
    static messageBox () {
        let node = document.createElement("div");
        node.setAttribute('id', 'messageBox');
        Elements.parentElement.appendChild(node)
    }

    // Create board
    static board () {
        let row, column, id, node;

        let board = document.createElement("div");
        board.className = 'board';
        let parent = Elements.parentElement.appendChild(board);

        for( row = 0; row < Game.boardSize; row++ ) {
            for( column = 0; column < Game.boardSize; column++ ) {
                id = Game.cellPrefix + row + "" + column;
                node = document.createElement("div");
                node.className = 'cell';
                node.setAttribute('id', id);
                parent.appendChild(node);
            }
        }

    }

    // Create messagebox
    static instructions () {
        let node = document.createElement("div");
        node.className = 'instructions';
        node.setAttribute('id', 'instructions');

        node.appendChild(document.createTextNode('Left Click: Open Cell'));
        node.appendChild(document.createElement("br"));
        node.appendChild(document.createTextNode('Right Click: Place Flag'));
        node.appendChild(document.createElement("br"));
        node.appendChild(document.createTextNode('Ctrl + Left Click: Open Adjacent, Non-Flagged Cells'));
        node.appendChild(document.createElement("br"));

        Elements.parentElement.appendChild(node)
    }

    // Create control
    static controls () {
        let node = document.createElement("div");

        node.className = 'controls';

        // Time elapsed
        let display = document.createElement("div");
        display.className = 'user-display';
        display.appendChild(document.createTextNode('Time'));
        display.appendChild(document.createElement("br"));

        let spanElement = document.createElement("span");
        spanElement.setAttribute('id', 'time');
        spanElement.appendChild(document.createTextNode('0'));
        display.appendChild(spanElement);

        display.appendChild(document.createTextNode('s'));
        node.appendChild(display);

        // Button
        let buttonElement = document.createElement("button");
        buttonElement.className = 'button';
        buttonElement.setAttribute('id', 'new-game-button');
        buttonElement.appendChild(document.createTextNode('New Game'));
        node.appendChild(buttonElement);

        // Mines Remaining
        display = document.createElement("div");
        display.className = 'user-display';
        display.appendChild(document.createTextNode('Remaining'));
        display.appendChild(document.createElement("br"));

        spanElement = document.createElement("span");
        spanElement.setAttribute('id', 'mines-remaining');
        spanElement.appendChild(document.createTextNode('0'));
        display.appendChild(spanElement);

        node.appendChild(display);

        Elements.parentElement.appendChild(node)
    }
}
export default Elements;