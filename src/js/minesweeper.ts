import Game from './Game'
import Layout from './Layout'

const Minesweeper = () => {
  const gameObj = new Game()
  gameObj.buildBoard()

  const LayoutObj = new Layout()
  LayoutObj.build()

  gameObj.newGame()
}
export {Minesweeper};
