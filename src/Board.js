import Game from './Game';
import Events from "./Events";
import Cell from "./Cell";

export class Board {
    constructor() {
        let row,
            column,
            id;
        for (row = 0; row < Game.boardSize; row++) {
            for (column = 0; column < Game.boardSize; column++) {
                id = Game.cellPrefix + row + "" + column;
                Game.board[id] = new Cell(row, column, false, false, false, 0);
            }
        }
        Board.randomlyAssignMines();
        Board.calculateNeighborMineCounts();
    }

    static randomlyAssignMines( ) {
        let mineCoordinates = [],
            randomRowCoordinate,
            randomColumnCoordinate,
            cell,
            i,
            elem;
        for( i = 0; i < Game.mines; i++ ) {
            randomRowCoordinate = Board.getRandomInteger( 0, Game.boardSize );
            randomColumnCoordinate = Board.getRandomInteger( 0, Game.boardSize );
            cell = Game.cellPrefix + randomRowCoordinate + "" + randomColumnCoordinate;
            while( mineCoordinates.includes( cell ) ) {
                randomRowCoordinate = Board.getRandomInteger( 0, Game.boardSize );
                randomColumnCoordinate = Board.getRandomInteger( 0, Game.boardSize );
                cell = Game.cellPrefix + randomRowCoordinate + "" + randomColumnCoordinate;
            }

            elem = document.getElementById(cell);
            if (elem == null) {
                i--;
            } else {
                mineCoordinates.push(cell);
                Game.board[cell].mined = true;
            }
        }
    }

    static getRandomInteger( min, max ) {
        return Math.floor( Math.random() * ( max - min + 1) ) + min;
    }

    static calculateNeighborMineCounts( ) {
        let cell,
            neighborMineCount = 0,
            i,
            row,
            column,
            id,
            neighbors;
        for( row = 0; row < Game.boardSize; row++ ) {
            for( column = 0; column < Game.boardSize; column++ ) {
                id = Game.cellPrefix + row + "" + column;
                cell = Game.board[id];
                if( !cell.mined ) {
                    neighbors = cell.getNeighbors( );
                    neighborMineCount = 0;
                    for( i = 0; i < neighbors.length; i++ ) {
                        neighborMineCount += Game.board[neighbors[i]].isMined();
                    }
                    cell.neighborMineCount = neighborMineCount;
                }
            }
        }
    }

    static initializeCells( ) {
        let row  = 0,
            column = 0,
            cells = document.getElementsByClassName('cell'),
            i,
            cssList = {
                color : 'black',
                backgroundImage : 'radial-gradient(#fff,#e6e6e6)'
            };
        for (i=0; i < cells.length; i++) {
            Object.assign(cells.item(i).style, cssList);

            column++;
            if( column >= Game.boardSize ) {
                column = 0;
                row++;
            }

            cells.item(i).removeEventListener('click', Events.cellClickEvent);
            cells.item(i).addEventListener('click', Events.cellClickEvent);
            cells.item(i).addEventListener('contextmenu', (e) => {
                e.preventDefault();
                Events.handleRightClick( e.currentTarget.getAttribute('id') );
                return false;
            });
        }
    }
}

export default Board;