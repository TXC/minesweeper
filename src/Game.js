import Board from "./Board";

export class Game {
    static FLAG = "&#9873;";
    static FLAGOFF = "&#9872;";
    static MINE = "&#9881;";
    static MINEOFF = "";
    static cellPrefix = 'c';
    static boardSize = 10;
    static mines = 10;
    static timer = 0;
    static ctrlIsPressed = false;
    static timeout;
    static gameOver = false;
    static minesRemaining = Game.mines;
    static board = {};

    static loss() {
        this.gameOver = true;
        let messageBox = document.getElementById('messageBox'),
            domCell;
        messageBox.innerText = 'Game Over!';
        Object.assign(messageBox.style, { color : 'white', backgroundColor: 'red' });

        let cells = Object.keys(Game.board);
        cells.forEach((cell) => {
            if( Game.board[cell].mined && !Game.board[cell].flagged ) {
                domCell = document.getElementById(Game.board[cell].id);
                domCell.innerHTML = Game.MINE;
                domCell.classList.add('black');
            } else if ( !Game.board[cell].mined && Game.board[cell].flagged ) {
                domCell = document.getElementById(Game.board[cell].id);
                domCell.innerHTML = Game.FLAGOFF;
                domCell.classList.add('black');
            }
        });
        clearInterval(Game.timeout);
    }

    static win() {
        Game.gameOver = true;
        let messageBox = document.getElementById('messageBox');
        messageBox.innerText = 'You Win!';
        let cssList = {
            color: 'white',
            backgroundColor : 'green',
        };
        Object.assign(messageBox.style, cssList);
        clearInterval( Game.timeout );
    }

    static newGame() {
        let time = document.getElementById('time'),
            messageBox = document.getElementById('messageBox'),
            minesRemaining = document.getElementById('mines-remaining');
        time.innerText = '0';
        messageBox.innerText = 'Make a move';
        Object.assign(messageBox.style, {
            color: '',
            backgroundColor: ''
        });

        Game.minesRemaining = Game.mines;
        minesRemaining.innerText = Number(Game.minesRemaining).toString();
        Game.gameOver = false;


        (new Board());
        Board.initializeCells();
        Game.timer = 0;
        clearInterval(Game.timeout);

        Game.timeout = setInterval(function () {
            // This will be executed after 1,000 milliseconds
            Game.timer++;
            if( Game.timer >= 999 ) {
                Game.timer = 999;
            }
            time.innerText = Number(Game.timer).toString();
        }, 1000);
    }
}
export default Game;