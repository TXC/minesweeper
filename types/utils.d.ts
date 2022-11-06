import Game from './Game';
declare const getRandomInteger: (min: number, max: number) => number;
declare const handleClick: (game: Game, cellId: string) => void;
declare const handleCtrlClick: (game: Game, cellId: string) => void;
declare const handleRightClick: (e: Event) => void;
declare const cellClickEvent: (game: Game, e: Event) => void;
declare const newGame: () => void;
declare const question: () => void;
declare const keyDown: (event: KeyboardEvent) => void;
declare const keyUp: (event: KeyboardEvent) => void;
export { getRandomInteger, handleClick, handleCtrlClick, handleRightClick, cellClickEvent, newGame, question, keyDown, keyUp };