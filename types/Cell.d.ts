import Game from './Game';
export declare class Cell {
    game: Game;
    row: number;
    column: number;
    opened: boolean;
    flagged: boolean;
    mined: boolean;
    neighborMineCount: number;
    element: HTMLElement;
    constructor(game: Game, row: number, column: number, opened: boolean, flagged: boolean, mined: boolean, neighborMineCount: number);
    get id(): string;
    get isMined(): boolean;
    getNeighbors(): string[];
    getNumberColor(): string;
    unhook(): void;
    hook(): void;
    open(): void;
    setFlag(): void;
    unsetFlag(): void;
}
export default Cell;
