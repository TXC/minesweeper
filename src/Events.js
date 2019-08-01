import Game from './Game';
export class Events {

    static ctrlIsPressed = false;

    static handleClick( id ) {
        if(Game.gameOver) {
            return false;
        }

        if( Events.ctrlIsPressed ) {
            Events.handleCtrlClick( id );
        } else {
            let cell = Game.board[id],
                $cell = document.getElementById( id ),
                neighbors,
                color;
            if( !cell.opened && !cell.flagged ) {
                if( cell.mined ) {
                    Game.loss();
                    $cell.innerHTML = Game.MINE;
                    $cell.classList.add('red');
                } else {
                    cell.opened = true;
                    if( cell.neighborMineCount > 0 ) {
                        $cell.innerText = cell.neighborMineCount;
                        $cell.classList.add(cell.getNumberColor());
                    } else {
                        $cell.innerHTML = '';
                        $cell.classList.add('empty');

                        neighbors = cell.getNeighbors();
                        neighbors.forEach( (neighbor) => {
                            if(
                                typeof Game.board[neighbor] !== 'undefined'
                                && !Game.board[neighbor].flagged
                                && !Game.board[neighbor].opened
                            ) {
                                this.handleClick( neighbor );
                            }
                        });
                    }
                }
            }
        }
    }

    static handleCtrlClick( id ) {
        let cell = Game.board[id];
        if( cell.opened && cell.neighborMineCount > 0 ) {
            let neighbors = cell.getNeighbors( ),
                flagCount = 0,
                flaggedCells = [],
                neighbor,
                lost = false,
                i;
            neighbors.forEach((neighbor) => {
                if( neighbor.flagged ) {
                    flaggedCells.push( neighbor );
                }
                flagCount += neighbor.flagged;
            });

            if( flagCount === cell.neighborMineCount ) {
                flaggedCells.some((flaggedCell) => {
                    if( flaggedCell.flagged && !flaggedCell.mined ) {
                        Game.loss();
                        lost = true;
                        return true;
                    }
                });

                if( !lost ) {
                    neighbors.forEach((neighbor) => {
                        if( !neighbor.flagged && !neighbor.opened ) {
                            Events.ctrlIsPressed = false;
                            Events.handleClick( neighbor.id );
                        }
                    });
                }
            }
        }
    }

    static handleRightClick( id ) {
        if( !Game.gameOver ) {
            let cell = Game.board[id],
                $cell = document.getElementById( id );
            if( !cell.opened ) {
                if( !cell.flagged && Game.minesRemaining > 0 ) {
                    cell.flagged = true;
                    $cell.innerHTML = Game.FLAG;
                    $cell.className = 'cell';
                    $cell.classList.add('red');
                    Game.minesRemaining--;
                } else if( cell.flagged && cell.neighborMineCount > 0 ) {
                    cell.flagged = false;
                    $cell.innerHTML = cell.neighborMineCount;
                    $cell.className = 'cell';
                    $cell.classList.add(cell.getNumberColor());
                    Game.minesRemaining++;
                } else if( cell.flagged ) {
                    cell.flagged = false;
                    $cell.innerHTML = '';
                    $cell.className = 'cell';
                    $cell.classList.add('black');
                    Game.minesRemaining++;
                }

                document.getElementById('mines-remaining').innerText = Game.minesRemaining;
            }
        }
    }

    static cellClickEvent(e) {
        Events.handleClick( e.currentTarget.getAttribute('id') );
        let isVictory = true,
            cells = Object.keys(Game.board);
        cells.some((cell) => {
            if( !Game.board[cell].mined && !Game.board[cell].opened ) {
                isVictory = false;
                return true;
            }
        });

        if( isVictory ) {
            Game.win();
        }
    }

    static newGame () {
        document.
            getElementById('new-game-button').
            addEventListener('click', () => {
                Game.board = Game.newGame();
            });
    }

    static question (event) {
        let el,
            style,
            div = document.getElementById('instructions');

        style = div.style;
        el = window.getComputedStyle(div);
        if(el.display === 'block') {
            style.display = '';
        } else {
            style.display = 'block';
        }
    }

    static keyDown(event) {
        if(process.env.NODE_ENV === 'production') {
            event.preventDefault();
        }
        if(event.key === 'Control' || event.key === 'Meta') {
            Events.ctrlIsPressed = true;
        }
    }

    static keyUp(event) {
        if(process.env.NODE_ENV === 'production') {
            event.preventDefault();
        }
        if(event.key === 'Control' || event.key === 'Meta') {
            Events.ctrlIsPressed = false;
        }
    }
}

export default Events;