import Game from './Game';
export declare class Elements {
    parentElement: HTMLElement;
    game: Game;
    constructor(gameObj: Game);
    build(): void;
    static buildInterface(gameObj: Game): void;
    title(): void;
    messageBox(): void;
    board(): void;
    instructions(): void;
    controls(): void;
}
export default Elements;
