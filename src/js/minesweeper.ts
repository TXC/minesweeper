import Game from './Game'
import Elements from './Elements'
import {keyDown, keyUp} from './utils'

const Minesweeper = () => {
  const gameObj = new Game()
  Elements.buildInterface(gameObj)

  document.addEventListener('keydown', keyDown);
  document.addEventListener('keyup', keyUp);
  gameObj.newGame()
}
export {Minesweeper};
