import Cell from './Cell'
import {getRandomInteger, keyDown, keyUp} from './utils'

class Game {
  private static instance: Game;
  gameOver = false
  private board: Array<Cell> = []
  private timer = 0
  private timeout = 0

  /**
   * Get class instance
   */
  static get getInstance() {
    if (!Game.instance) {
      console.error('Invalid instance')
      console.trace()
      throw 'Invalid instance'
    }
    return Game.instance
  }

  /**
   * Get board size
   */
  get boardSize(): number {
    const size = localStorage.getItem('board-size')
    if (size) {
      return Number(size)
    }
    const cssSize = getComputedStyle(document.documentElement).getPropertyValue('--board-size');
    if (cssSize) {
      return Number(cssSize)
    }
    return 10
  }

  /**
   * Set board size
   * @param {Number} size
   */
  set boardSize(size: number) {
    const sizeString = String(size)
    localStorage.setItem('board-size', sizeString)
    document.documentElement.style.setProperty('--board-size', sizeString);
    this.buildBoard()
  }

  /**
   * Get no. of mines
   */
  get mines(): number {
    const mines = localStorage.getItem('mines')
    if (mines) {
      return Number(mines)
    }
    return 10
  }

  /**
   * Set no. of mines
   */
  set mines(mines: number) {
    localStorage.setItem('mines', String(mines))
    this.newGame()
  }

  /**
   * Get remaining mines
   */
  get minesRemaining(): number {
    let flagged = 0
    this.board.forEach((cell) => {
      if (cell.flagged) {
        flagged++
      }
    })

    return (this.mines - flagged)
  }

  /**
   * Get current board
   */
  static get board(): Array<Cell> {
    return Game.getInstance.board
  }

  /**
   * Constructor
   */
  constructor() {
    Game.instance = this
  }

  /**
   * You clicked on a mine, you lose
   */
  loss() {
    this.gameOver = true
    const messageBox = document.getElementById('messageBox')
    if (!messageBox) {
      return
    }
    messageBox.innerText = 'Game Over!'
    Object.assign(messageBox.style, {color: 'white', backgroundColor: 'red'})

    this.board.forEach((cell: Cell) => {
      cell.display()
    })
    clearInterval(this.timeout)
  }

  /**
   * You avoided all mines, you win
   */
  win() {
    this.gameOver = true
    const messageBox = document.getElementById('messageBox')
    if (!messageBox) {
      return
    }
    messageBox.innerText = 'You Win!'
    const cssList = {
      color: 'white',
      backgroundColor: 'green',
    }
    Object.assign(messageBox.style, cssList)
    clearInterval(this.timeout)
  }

  buildBoard() {
    this.board = [...Array(Math.pow(this.boardSize, 2)).keys()].map((i) => {
      const dec = String(i / this.boardSize).split('.')
      if (!dec[1]) {
        dec[1] = '0'
      }
      return new Cell(Number(dec[0]), Number(dec[1]))
    })

  }
  /**
   * Create a new game
   */
  newGame(): void {
    const time = document.getElementById('time'),
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

    minesRemaining.innerText = this.minesRemaining.toString()
    this.gameOver = false

    document.removeEventListener('keydown', keyDown)
    document.removeEventListener('keyup', keyUp)

    document.addEventListener('keydown', keyDown)
    document.addEventListener('keyup', keyUp)

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
      time.innerText = this.timer.toString()
    }, 1000)
  }

  /**
   * Setup board for playing a game
   */
  setupBoard() {
    this.board.forEach((cell) => {
      cell.reset()
    })
    this.randomlyAssignMines()
    this.calculateNeighborMineCounts()
  }

  /**
   * Calculate cells around current cell for mines
   */
  calculateNeighborMineCounts () {
    let neighborMineCount = 0
    this.board.forEach((cell) => {
      if (!cell.armed) {
        neighborMineCount = 0
        cell.getNeighbors(true).forEach((neighbor) => {
          if (!neighbor) {
            return
          }
          neighborMineCount += neighbor.armed ? 1 : 0
        })
        cell.neighborMineCount = neighborMineCount
      }
    })
  }

  /**
   * Assign mines to cells
   */
  randomlyAssignMines () {
    const mineCoordinates: Array<string> = [],
      mines = this.mines

    let randomRowCoordinate: number,
      randomColumnCoordinate: number,
      cellId: string,
      obj: Cell | undefined

    console.log(`Has ${mines}`)
    for (let i = 0; i < mines; i++) {
      randomRowCoordinate = getRandomInteger( 0, this.boardSize )
      randomColumnCoordinate = getRandomInteger( 0, this.boardSize )
      cellId = 'R' + randomRowCoordinate + 'C' + randomColumnCoordinate
      while (mineCoordinates.includes(cellId)) {
        randomRowCoordinate = getRandomInteger( 0, this.boardSize )
        randomColumnCoordinate = getRandomInteger( 0, this.boardSize )
        cellId = 'R' + randomRowCoordinate + 'C' + randomColumnCoordinate
      }

      obj = Game.board.find((el) => el.row === randomRowCoordinate && el.column === randomColumnCoordinate)
      if (!obj) {
        i--
      } else {
        mineCoordinates.push(cellId)
        obj.armed = true
      }
    }
  }
}

export default Game
