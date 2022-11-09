import Game from './Game'
import Cell from './Cell'
// @ts-ignore
import css from '../css/elements.module.css'

let ctrlIsPressed = false

const getRandomInteger = (min: number, max: number ): number => {
  return Math.floor( Math.random() * ( max - min + 1) ) + min
}

const handleClick = (cell: Cell) => {
  if (cell.opened || cell.flagged) {
    return
  }

  if (cell.armed) {
    Game.getInstance.loss()
    cell.exploded()
    return
  }

  cell.open()

  if (cell.neighborMineCount > 0) {
    return
  }

  cell.getNeighbors().forEach((neighbor) => {
    if(neighbor && !neighbor.opened && !neighbor.flagged) {
      handleClick(neighbor)
    }
  })
}

const handleCtrlClick = (cell: Cell) => {
  if (!cell.opened || !cell.neighborMineCount) {
    return
  }
  const neighbors = cell.getNeighbors(),
    flaggedCells: Cell[] = []
  let flagCount = 0,
    lost = false

  neighbors.forEach((neighbor) => {
    if(neighbor) {
      if (neighbor.flagged) {
        flaggedCells.push(neighbor)
      }
      flagCount += neighbor.flagged ? 1 : 0
    }
  })

  if(flagCount === cell.neighborMineCount) {
    flaggedCells.some((flaggedCell: Cell) => {
      if (flaggedCell.flagged && !flaggedCell.armed) {
        Game.getInstance.loss()
        lost = true
        return true
      }
    })
    if (lost) {
      return
    }
    neighbors.forEach((neighbor) => {
      if(neighbor && !neighbor.flagged && !neighbor.opened ) {
        ctrlIsPressed = false
        handleClick(neighbor)
      }
    })
  }
}

const handleRightClick = (e: Event) => {
  e.preventDefault()
  if (Game.getInstance.gameOver) {
    return
  }
  const cell = Game.board.find((el) => el.element === e.currentTarget)
  if (!cell || cell.opened) {
    return
  }

  if (!cell.flagged && Game.getInstance.minesRemaining > 0) {
    cell.setFlag()
  } else if (cell.flagged) {
    cell.unsetFlag()
  }
  const el = document.getElementById('mines-remaining')
  if (el === null) {
    return
  }
  el.innerText = Game.getInstance.minesRemaining.toString()
}

const cellClickEvent = (e: Event) => {
  e.preventDefault()
  if(Game.getInstance.gameOver) {
    return
  }

  const cell = Game.board.find((el) => el.element === e.currentTarget)
  if (!cell) {
    return
  }
  if(ctrlIsPressed) {
    handleCtrlClick(cell)
  } else {
    cell.element.dataset.status='empty'
    handleClick(cell)
  }

  let isVictory = true
  Game.board.some((cell) => {
    if (!cell.opened && !cell.armed) {
      isVictory = false
      return true
    }
  })

  if (isVictory) {
    Game.getInstance.win()
  }
}

const toggle = (element: HTMLElement | null) => {
  if (!element) {
    return
  }
  if(element.classList.contains(css.hidden)) {
    element.classList.remove(css.hidden)
  } else {
    element.classList.add(css.hidden)
  }
}

const keyDown = (event: KeyboardEvent) => {
  if(event?.key === 'Control' || event?.key === 'Meta') {
    ctrlIsPressed = true
  }
}

const keyUp = (event: KeyboardEvent) => {
  if(event?.key === 'Control' || event?.key === 'Meta') {
    ctrlIsPressed = false
  }
}

const range = (number: number): number[] => {
  return [...Array(number).keys()]
}

const randomString = (letters: number): string => {
  return [...Array(letters).keys()].map(() => {
      const r = Math.random() * 16 | 0
      return r.toString(16)
    }).join('')
}

export {
  getRandomInteger,
  handleClick,
  handleCtrlClick,
  handleRightClick,
  cellClickEvent,
  toggle,
  keyDown,
  keyUp,
  range,
  randomString,
}
