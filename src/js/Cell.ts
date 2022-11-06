import Game from './Game'
import {cellClickEvent, handleRightClick} from "./utils";

export class Cell {
  game: Game
  row: number
  column: number
  opened: boolean
  flagged: boolean
  mined: boolean
  neighborMineCount: number
  element: HTMLElement

  constructor(game: Game, row: number, column: number, opened: boolean, flagged: boolean, mined: boolean, neighborMineCount: number) {
    this.game = game
    this.row = row
    this.column = column
    this.opened = opened
    this.flagged = flagged
    this.mined = mined
    this.neighborMineCount = neighborMineCount
    const element = document.getElementById(this.id)
    if (!element) {
      throw "Invalid element"
    }
    this.element = element
  }

  get id(): string {
    return Game.cellPrefix + this.row + "" + this.column;
  }

  get isMined(): boolean {
    return this.mined
  }

  getNeighbors(): string[] {
    let row = this.row,
      column = this.column,
      neighbors = [],
      i, elem

    neighbors.push(Game.cellPrefix + (row - 1) + "" + (column - 1))
    neighbors.push(Game.cellPrefix + (row - 1) + "" + column)
    neighbors.push(Game.cellPrefix + (row - 1) + "" + (column + 1))
    neighbors.push(Game.cellPrefix + row + "" + (column - 1))
    neighbors.push(Game.cellPrefix + row + "" + (column + 1))
    neighbors.push(Game.cellPrefix + (row + 1) + "" + (column - 1))
    neighbors.push(Game.cellPrefix + (row + 1) + "" + column)
    neighbors.push(Game.cellPrefix + (row + 1) + "" + (column + 1))

    for (i = 0; i < neighbors.length; i++) {
      elem = document.getElementById(neighbors[i]);
      if (elem == null) {
        neighbors.splice(i, 1)
        i--
      }
    }
    return neighbors
  }

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

  unhook() {
    this.element.removeEventListener('click', (e) => cellClickEvent(this.game, e))
  }

  hook() {
    this.element.removeAttribute('style')
    this.element.addEventListener('click', (e) => cellClickEvent(this.game, e))
    this.element.addEventListener('contextmenu', (e) => handleRightClick(e))
  }

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

  setFlag() {
    this.flagged = true
    //this.element.innerHTML = Game.FLAG
    this.element.dataset.status = 'flag'
    this.element.dataset.color = 'red'
  }

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
