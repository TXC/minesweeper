import Cell from './Cell'
import {getRandomInteger} from './utils'

export class Game {
  static FLAG: string = "&#9873"
  static FLAGOFF: string = "&#9872"
  static MINE: string = "&#9881"
  static gameOver: boolean = false
  static mines: number = 10
  static minesRemaining: number = Game.mines
  static board: Array<Cell> = []
  timer: number = 0
  timeout: number = 0

  static get cellPrefix() {
    return 'c'
  }

  static get boardSize() {
    return 10
  }

  loss() {
    Game.gameOver = true
    let messageBox = document.getElementById('messageBox')
    if (messageBox === null) {
      return
    }
    messageBox.innerText = 'Game Over!'
    Object.assign(messageBox.style, {color: 'white', backgroundColor: 'red'})

    Game.board.forEach((cell: Cell) => {
      if (cell.mined && !cell.flagged) {
        cell.element.dataset.status = 'mine'
        cell.element.dataset.color = 'black'
      } else if (!cell.mined && cell.flagged) {
        cell.element.dataset.status = 'flagoff'
        cell.element.dataset.color = 'black'
      }
    })
    clearInterval(this.timeout)
  }

  win() {
    Game.gameOver = true
    let messageBox = document.getElementById('messageBox')
    if (messageBox === null) {
      return
    }
    messageBox.innerText = 'You Win!'
    let cssList = {
      color: 'white',
      backgroundColor: 'green',
    }
    Object.assign(messageBox.style, cssList)
    clearInterval(this.timeout)
  }

  newGame(): void {
    let time = document.getElementById('time'),
      messageBox = document.getElementById('messageBox'),
      minesRemaining = document.getElementById('mines-remaining')

    if (time === null || messageBox === null || minesRemaining === null) {
      return
    }

    time.innerText = '0'
    messageBox.innerText = 'Make a move'
    Object.assign(messageBox.style, {
      color: '',
      backgroundColor: ''
    })

    Game.minesRemaining = Game.mines
    minesRemaining.innerText = Number(Game.minesRemaining).toString()
    Game.gameOver = false

    this.setupBoard()
    this.timer = 0
    clearInterval(this.timeout)

    this.timeout = setInterval(() => {
      if (time === null) {
        return
      }
      // This will be executed after 1,000 milliseconds
      this.timer++
      if (this.timer >= 999) {
        this.timer = 999
      }
      time.innerText = Number(this.timer).toString()
    }, 1000)
  }

  setupBoard() {
    let cell

    for (let row = 0; row < Game.boardSize; row++) {
      for (let column = 0; column < Game.boardSize; column++) {
        cell = new Cell(this, row, column, false, false, false, 0)
        cell.unhook()
        cell.hook()
        Game.board.push(cell)
      }
    }
    this.randomlyAssignMines()
    this.calculateNeighborMineCounts()
  }

  calculateNeighborMineCounts () {
    let neighborMineCount = 0,
      cellId: string,
      obj

    for( let row = 0; row < Game.boardSize; row++ ) {
      for( let column = 0; column < Game.boardSize; column++ ) {
        cellId = Game.cellPrefix + row + "" + column
        obj = Game.board.find((el) => el.id === cellId)
        if( obj && !obj.isMined ) {
          neighborMineCount = 0
          obj.getNeighbors().forEach( (neighbor: string) => {
            const neighborCell = Game.board.find((el) => el.id === neighbor)
            if (neighborCell) {
              neighborMineCount += neighborCell.isMined ? 1 : 0
            }
          })
          obj.neighborMineCount = neighborMineCount
        }
      }
    }
  }

  randomlyAssignMines () {
    let mineCoordinates: Array<string> = [],
      randomRowCoordinate,
      randomColumnCoordinate,
      cellId: string,
      obj
    for (let i = 0; i < Game.mines; i++) {
      randomRowCoordinate = getRandomInteger( 0, Game.boardSize )
      randomColumnCoordinate = getRandomInteger( 0, Game.boardSize )
      cellId = Game.cellPrefix + randomRowCoordinate + "" + randomColumnCoordinate
      while (mineCoordinates.includes(cellId)) {
        randomRowCoordinate = getRandomInteger( 0, Game.boardSize )
        randomColumnCoordinate = getRandomInteger( 0, Game.boardSize )
        cellId = Game.cellPrefix + randomRowCoordinate + "" + randomColumnCoordinate
      }

      obj = Game.board.find((el) => el.id === cellId)
      if (!obj) {
        i--
      } else {
        mineCoordinates.push(obj.id)
        obj.mined = true
      }
    }
  }
}

export default Game
