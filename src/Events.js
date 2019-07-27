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
                neighbor,
                color,
                i;
            if( !cell.opened && !cell.flagged ) {
                if( cell.mined ) {
                    Game.loss();
                    $cell.innerHTML = Game.MINE;
                    $cell.style.color = 'red';
                } else {
                    cell.opened = true;
                    if( cell.neighborMineCount > 0 ) {
                        color = cell.getNumberColor();
                        $cell.innerText = cell.neighborMineCount;
                        $cell.style.color = color;
                    } else {
                        $cell.innerHTML = '';
                        $cell.style.backgroundImage = 'radial-gradient(#e6e6e6,#c9c7c7)';
                        neighbors = cell.getNeighbors();
                        for( i = 0; i < neighbors.length; i++ ) {
                            neighbor = neighbors[i];
                            if( typeof Game.board[neighbor] !== 'undefined'
                                && !Game.board[neighbor].flagged
                                && !Game.board[neighbor].opened
                            ) {
                                this.handleClick( neighbor );
                            }
                        }
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
            for( i = 0; i < neighbors.length; i++ ) {
                neighbor = Game.board[neighbors[i]];
                if( neighbor.flagged ) {
                    flaggedCells.push( neighbor );
                }
                flagCount += neighbor.flagged;
            }

            if( flagCount === cell.neighborMineCount ) {
                for( i = 0; i < flaggedCells.length; i++ ) {
                    if( flaggedCells[i].flagged && !flaggedCells[i].mined ) {
                        Game.loss();
                        lost = true;
                        break;
                    }
                }

                if( !lost ) {
                    for( i = 0; i < neighbors.length; i++ ) {
                        neighbor = Game.board[neighbors[i]];
                        if( !neighbor.flagged && !neighbor.opened ) {
                            Events.ctrlIsPressed = false;
                            Events.handleClick( neighbor.id );
                        }
                    }
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
                    $cell.style.color = 'red';
                    Game.minesRemaining--;
                } else if( cell.flagged && cell.neighborMineCount > 0 ) {
                    cell.flagged = false;
                    $cell.innerHTML = cell.neighborMineCount;
                    $cell.style.color = cell.getNumberColor();
                    Game.minesRemaining++;
                } else if( cell.flagged ) {
                    cell.flagged = false;
                    $cell.innerHTML = '';
                    $cell.style.color = 'black';
                    Game.minesRemaining++;
                }

                document.getElementById('mines-remaining').innerText = Game.minesRemaining;
            }
        }
    }

    static cellClickEvent(e) {
        Events.handleClick( e.currentTarget.getAttribute('id') );
        let isVictory = true,
            cells = Object.keys(Game.board),
            i;
        for( i = 0; i < cells.length; i++ ) {
            if( !Game.board[cells[i]].mined && !Game.board[cells[i]].opened ) {
                isVictory = false;
                break;
            }
        }

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

    static keyDown(event) {
        event.preventDefault();
        if(event.key === 'Control' || event.key === 'Meta') {
            console.log('Bla');
            Events.ctrlIsPressed = true;
        }
    }

    static keyUp(event) {
        event.preventDefault();
        if(event.key === 'Control' || event.key === 'Meta') {
            Events.ctrlIsPressed = false;
        }
    }
}

export default Events;