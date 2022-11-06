import Cell from './Cell';
export declare class Game {
    static FLAG: string;
    static FLAGOFF: string;
    static MINE: string;
    static gameOver: boolean;
    static mines: number;
    static minesRemaining: number;
    static board: Array<Cell>;
    timer: number;
    timeout: number;
    static get cellPrefix(): string;
    static get boardSize(): number;
    loss(): void;
    win(): void;
    newGame(): void;
    setupBoard(): void;
    calculateNeighborMineCounts(): void;
    randomlyAssignMines(): void;
}
export default Game;
