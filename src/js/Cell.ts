import Game from './Game'
import {cellClickEvent, handleRightClick} from './utils'

class Cell {
  row: number
  column: number
  opened: boolean
  flagged: boolean
  armed: boolean
  neighborMineCount: number
  private htmlElement: HTMLElement | undefined

  constructor(row: number, column: number, opened = false, flagged = false, armed = false, neighborMineCount = 0) {
    this.row = row
    this.column = column
    this.opened = opened
    this.flagged = flagged
    this.armed = armed
    this.neighborMineCount = neighborMineCount
  }

  reset() {
    this.unhook()
    this.opened = false
    this.flagged = false
    this.armed = false
    this.neighborMineCount = 0
    if (this.element instanceof HTMLElement) {
      delete this.element.dataset.status
      delete this.element.dataset.color
      this.element.innerText = ''
    }
    this.hook()
  }

  /**
   * Get corresponding element
   */
  get element(): HTMLElement {
    if (!this.htmlElement) {
      console.error('Invalid instance')
      console.trace()
      throw 'Invalid cell element'
    }
    return this.htmlElement
  }

  /**
   * Set corresponding element
   */
  set element(el: HTMLElement) {
    this.htmlElement = el
  }

  /**
   * Get cell ID
   */
  get id(): string {
    return 'R' + this.row + 'C' + this.column;
  }

  /**
   * Get info on surrounding cells
   * @param {Boolean} includeCorners
   */
  getNeighbors(includeCorners = false): Array<Cell | undefined> {
    const neighbors = []

    neighbors.push([this.row - 1, this.column])       // Top
    neighbors.push([this.row, this.column - 1])       // Left
    neighbors.push([this.row, this.column + 1])       // Right
    neighbors.push([this.row + 1, this.column])       // Bottom

    if (includeCorners) {
      neighbors.push([this.row - 1, this.column - 1]) // Top Left
      neighbors.push([this.row - 1, this.column + 1]) // Top Right
      neighbors.push([this.row + 1, this.column - 1]) // Bottom Left
      neighbors.push([this.row + 1, this.column + 1]) // Bottom Right
    }
    return neighbors.map((value) => {
      if (value[0] < 0 || value[1] < 0 || value[0] > Game.getInstance.boardSize || value[1] > Game.getInstance.boardSize) {
        return
      }
      return Game.board.find((el) => el.row === value[0] && el.column === value[1])
    }).filter((cell) => cell instanceof Cell)
  }

  /**
   * Get number coloring
   */
  getNumberColor(): string {
    switch (this.neighborMineCount) {
      case 0:
        return 'empty'
      case 1:
        return 'blue'
      case 2:
        return 'green'
      case 3:
        return 'red'
      case 4:
        return 'orange'
      default:
        return 'black'
    }
  }

  /**
   * Remove event
   */
  unhook() {
    this.element.setAttribute('style', '')
    this.element.removeEventListener('click', (e) => cellClickEvent(e))
    this.element.removeEventListener('contextmenu', (e) => handleRightClick(e))
  }

  /**
   * Hook event
   */
  hook() {
    this.element.removeAttribute('style')
    this.element.addEventListener('click', (e) => cellClickEvent(e))
    this.element.addEventListener('contextmenu', (e) => handleRightClick(e))
  }

  /**
   * Open cell when clicked
   */
  open() {
    this.opened = true

    if (this.neighborMineCount > 0) {
      this.element.innerText = String(this.neighborMineCount)
      this.element.dataset.status = ''
      this.element.dataset.color = this.getNumberColor()
    } else {
      this.element.innerHTML = ''
      this.element.dataset.status = 'empty'
      this.element.dataset.color = ''
    }
  }

  /**
   * Display cell when game is over
   */
  display() {
    if (this.armed && !this.flagged) {
      this.element.dataset.status = 'mine'
      this.element.dataset.color = 'black'
    } else if (!this.armed && this.flagged) {
      this.element.dataset.status = 'flagoff'
      this.element.dataset.color = 'black'
    }
  }

  /**
   * This is cell that triggered the game loss
   */
  exploded() {
    this.element.dataset.status = 'exploded'
    //this.element.dataset.color = 'red'
  }

  /**
   * Set flag on cell
   */
  setFlag() {
    this.flagged = true

    this.element.dataset.status = 'flag'
    this.element.dataset.color = 'red'
  }

  /**
   * Remove flag on cell
   */
  unsetFlag() {
    this.flagged = false

    //if (!this.opened && this.neighborMineCount > 0) {
    //  this.element.innerHTML = String(this.neighborMineCount)
    //  this.element.dataset.status = this.getNumberColor()
    //} else {
    this.element.innerHTML = ''
    this.element.dataset.status = ''
    this.element.dataset.color = ''
    //}
  }
}

export default Cell
