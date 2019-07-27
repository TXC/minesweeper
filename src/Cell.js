import Game from "./Game";

export class Cell {
    constructor(row, column, opened, flagged, mined, neighborMineCount) {
        this.row = row;
        this.column = column;
        this.opened = opened;
        this.flagged = flagged;
        this.mined = mined;
        this.neighborMineCount = neighborMineCount;
    }

    get id() {
        return Game.cellPrefix + this.row + "" + this.column;
    }

    isMined( ) {
        let cell = Game.board[this.id],
            mined = 0;
        if( typeof cell !== 'undefined' ) {
            mined = !!cell.mined;
        }
        return mined;
    }

    getNeighbors( ) {
        let row = this.row,
            column = this.column,
            neighbors = [],
            i, elem;

        neighbors.push(Game.cellPrefix + (row - 1) + "" + (column - 1) );
        neighbors.push(Game.cellPrefix + (row - 1) + "" + column );
        neighbors.push(Game.cellPrefix + (row - 1) + "" + (column + 1) );
        neighbors.push(Game.cellPrefix + row + "" + (column - 1) );
        neighbors.push(Game.cellPrefix + row + "" + (column + 1) );
        neighbors.push(Game.cellPrefix + (row + 1) + "" + (column - 1) );
        neighbors.push(Game.cellPrefix + (row + 1) + "" + column );
        neighbors.push(Game.cellPrefix + (row + 1) + "" + (column + 1) );

        for( i = 0; i < neighbors.length; i++) {
            elem = document.getElementById(neighbors[i]);
            if (elem == null) {
                neighbors.splice(i, 1);
                i--;
            }
        }
        return neighbors
    }

    getNumberColor( ) {
        switch(this.neighborMineCount) {
            case 1: return 'blue'; break;
            case 2: return 'green'; break;
            case 3: return 'red'; break;
            case 4: return 'orange'; break;
            default: return 'black';
        }
    }

}
export default Cell;