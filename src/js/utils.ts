import Game from './Game'
import Cell from './Cell'

let ctrlIsPressed = false

const getRandomInteger = (min: number, max: number ): number => {
  return Math.floor( Math.random() * ( max - min + 1) ) + min
}

const handleClick = (game: Game, cellId: string) => {
  const cell = Game.board.find((el) => el.id === cellId)
  if (cell && !cell.opened && !cell.flagged) {
    if (cell.isMined) {
      game.loss()
      //cell.element.innerHTML = Game.MINE
      cell.element.dataset.status = 'mine'
      cell.element.dataset.color = 'red'
      return
    }
    cell.open()
    if (cell.neighborMineCount > 0) {
      return
    }

    cell.getNeighbors().forEach((neighbor: string) => {
      const neighborCell = Game.board.find((el) => el.id === neighbor)
      if(neighborCell && !neighborCell.opened && !neighborCell.flagged) {
        handleClick(game, neighbor)
      }
    })
  }
}

const handleCtrlClick = (game: Game, cellId: string) => {
  const cell = Game.board.find((el) => el.id === cellId)
  if( cell && cell.opened && cell.neighborMineCount > 0 ) {
    let neighbors = cell.getNeighbors(),
      flagCount = 0,
      flaggedCells: Cell[] = [],
      lost = false

    neighbors.forEach((neighbor: string) => {
      const neighborCell = Game.board.find((el) => el.id === neighbor)
      if(neighborCell) {
        if (neighborCell.flagged) {
          flaggedCells.push(neighborCell)
        }
        flagCount += neighborCell.flagged ? 1 : 0
      }
    })

    if(flagCount === cell.neighborMineCount) {
      flaggedCells.some((flaggedCell: Cell) => {
        if (flaggedCell.flagged && !flaggedCell.mined) {
          game.loss()
          lost = true
          return true
        }
      })

      if(!lost) {
        neighbors.forEach((neighbor: string) => {
          const neighborCell = Game.board.find((el) => el.id === neighbor)
          if(neighborCell && !neighborCell.flagged && !neighborCell.opened ) {
            ctrlIsPressed = false
            handleClick(game, neighborCell.id)
          }
        })
      }
    }
  }
}

const handleRightClick = (e: Event) => {
  if( Game.gameOver ) {
    return
  }
  e.preventDefault()
  // @ts-ignore
  const cellId = e.currentTarget?.getAttribute?.('id')
  const cell = Game.board.find((el) => el.id === cellId)
  if (!cell || cell.opened) {
    return
  }

  if (!cell.flagged && Game.minesRemaining > 0) {
    cell.setFlag()
    Game.minesRemaining--
  } else if (cell.flagged) {
    cell.unsetFlag()
    Game.minesRemaining++
  }

  const el = document.getElementById('mines-remaining')
  if (el === null) {
    return
  }
  el.innerText = String(Game.minesRemaining)
}

const cellClickEvent = (game: Game, e: Event) => {
  if(Game.gameOver) {
    return
  }

  // @ts-ignore
  if (e.currentTarget && typeof e.currentTarget.getAttribute === 'function') {
    // @ts-ignore
    const cellId = e.currentTarget.getAttribute('id')
    if(ctrlIsPressed) {
      handleCtrlClick(game, cellId)
    } else {
      handleClick(game, cellId)
    }
  }

  let isVictory = true
  Game.board.some((cell: Cell) => {
    if( !cell.isMined && !cell.opened ) {
      isVictory = false
      return true
    }
  })

  if( isVictory ) {
    game.win()
  }
}

const newGame = () => {
  const btn = document.getElementById('new-game-button')
  if (!btn) {
    return
  }
  btn.addEventListener('click', () => (new Game).newGame())
}

const question = () => {
  let el,
    div = document.getElementById('instructions'),
    style = div?.style

  if (div === null || style === undefined) {
    return
  }
  el = window.getComputedStyle(div)
  if(el.display === 'block') {
    style.display = ''
  } else {
    style.display = 'block'
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

export {
  getRandomInteger,
  handleClick,
  handleCtrlClick,
  handleRightClick,
  cellClickEvent,
  newGame,
  question,
  keyDown,
  keyUp
}
