import Game from './Game'
import {randomString, toggle} from './utils'
// @ts-ignore
import css from '../css/elements.module.css'

class Layout {
  private readonly mainElement: DocumentFragment

  constructor() {
    this.mainElement = document.createDocumentFragment();
  }

  build() {
    const titleObj = this.title()
    const instructionObject = this.instructions()
    const questionMarkObject = this.questionMark(instructionObject)
    const settingsObject = this.settings()
    titleObj.appendChild(questionMarkObject)

    this.mainElement.appendChild(titleObj)
    this.mainElement.appendChild(instructionObject)
    this.mainElement.appendChild(settingsObject)
    this.mainElement.appendChild(this.messageBox())
    this.mainElement.appendChild(this.buttons(settingsObject))
    this.mainElement.appendChild(this.board())
    this.mainElement.appendChild(this.status())

    const mainElement = document.createElement('main')
    mainElement.appendChild(this.mainElement)
    const bodyElement = document.getElementsByTagName('body')[0]
    bodyElement.appendChild(mainElement);
  }

  /**
   * Create title
   */
  title(): HTMLElement {
    const node = document.createElement('h1')
    const text = document.createTextNode('MineSweeper')
    node.appendChild(text)

    return node
  }

  /**
   * Question mark symbol to title
   * @param {HTMLElement} element
   */
  questionMark(element: HTMLElement) {
    const spanElement = document.createElement('span')
    spanElement.className = css.question
    spanElement.addEventListener('click', () => toggle(element))
    return spanElement
  }

  /**
   * Create messagebox
   */
  messageBox(): HTMLElement {
    const node = document.createElement('div')
    node.className = css.messageBox
    node.setAttribute('id', 'messageBox')
    return node
  }

  /**
   * Create board
   */
  board(): HTMLElement {
    const board = document.createElement('div')
    board.id = 'board'
    board.className = css.board

    Game.board.forEach((cell) => {
      const node = document.createElement('div')
      //node.setAttribute('id', cell.id)
      board.appendChild(node)
      cell.element = node
    })
    return board
  }

  /**
   * Create messagebox
   */
  instructions(): HTMLElement {
    const node = document.createElement('div')
    node.classList.add(css.instructions, css.hidden)
    node.setAttribute('id', 'instructions')

    node.appendChild(document.createTextNode('Left Click: Open Cell'))
    node.appendChild(document.createElement('br'))
    node.appendChild(document.createTextNode('Right Click: Place Flag'))
    node.appendChild(document.createElement('br'))
    node.appendChild(document.createTextNode('Ctrl + Left Click: Open Adjacent, Non-Flagged Cells'))
    node.appendChild(document.createElement('br'))

    return node
  }

  /**
   * Create settingsbox
   */
  settings(): HTMLElement {
    const node = document.createElement('section')
    node.classList.add(css.modal, css.hidden)
    node.setAttribute('id', 'settings')

    const formObject = document.createElement('form')
    node.appendChild(formObject)

    const headerObject = document.createElement('div')
    headerObject.className = css.modalHeader

    const footerObject = document.createElement('div')
    footerObject.className = css.modalFooter

    const closeButtonObj = document.createElement('button')
    closeButtonObj.className = css.btnClose
    closeButtonObj.innerText = 'X'
    closeButtonObj.addEventListener('click', (e) => {
      e.preventDefault()
      toggle(node)
    })

    const submitButtonObj = document.createElement('button')
    submitButtonObj.className = css.btn
    submitButtonObj.innerText = 'Submit'

    const contentObj = document.createElement('div')
    contentObj.className = css.modalContent
    contentObj.innerHTML = '<p>Hello World, lorem ipsum, dolar sit!</p>'

    const sizeContainerObj = document.createElement('div')
    const sizeLabelObj = document.createElement('label')
    const sizeInputObj = document.createElement('input')
    const sizeIdString = randomString(5)
    sizeContainerObj.appendChild(sizeLabelObj)
    sizeContainerObj.appendChild(sizeInputObj)
    sizeLabelObj.setAttribute('for', sizeIdString)
    sizeLabelObj.textContent = 'Board Size'
    sizeInputObj.setAttribute('id', sizeIdString)
    sizeInputObj.setAttribute('value', Game.getInstance.boardSize.toString())
    sizeInputObj.setAttribute('type', 'number')
    sizeInputObj.setAttribute('min', '5')
    sizeInputObj.setAttribute('max', '20')
    sizeInputObj.setAttribute('step', '1')
    sizeInputObj.addEventListener('change', (e) => {
      if (e.target) {
        // @ts-ignore
        Game.getInstance.boardSize = e.target.valueAsNumber
      }
    })

    const minesContainerObj = document.createElement('div')
    const minesLabelObj = document.createElement('label')
    const minesInputObj = document.createElement('input')
    const minesIdString = randomString(5)
    minesContainerObj.appendChild(minesLabelObj)
    minesContainerObj.appendChild(minesInputObj)
    minesLabelObj.setAttribute('for', minesIdString)
    minesLabelObj.textContent = 'No. of mines'

    minesInputObj.setAttribute('id', minesIdString)
    minesInputObj.setAttribute('value', Game.getInstance.mines.toString())
    minesInputObj.setAttribute('type', 'number')
    minesInputObj.setAttribute('min', '5')
    minesInputObj.setAttribute('max', Math.pow(Game.getInstance.boardSize, 2).toString())
    minesInputObj.setAttribute('step', '1')
    minesInputObj.addEventListener('change', (e) => {
      if (e.target) {
        // @ts-ignore
        Game.getInstance.mines = e.target.valueAsNumber
      }
    })


    formObject.addEventListener('submit', (e) => {
      e.preventDefault()
      toggle(node)
    })

    contentObj.appendChild(sizeContainerObj)
    contentObj.appendChild(minesContainerObj)
    headerObject.appendChild(closeButtonObj)
    footerObject.appendChild(submitButtonObj)
    formObject.appendChild(headerObject)
    formObject.appendChild(contentObj)
    formObject.appendChild(footerObject)


    return node
  }

  /**
   * Create buttons
   */
  buttons(settingsObject: HTMLElement): HTMLElement {
    const node = document.createElement('div')
    node.className = css.buttons

    // Button
    const newGameElement = document.createElement('button')
    newGameElement.className = css.btn
    newGameElement.addEventListener('click', () => {
      Game.getInstance.newGame()
    })
    newGameElement.appendChild(document.createTextNode('New Game'))
    node.appendChild(newGameElement)

    const settingsElement = document.createElement('button')
    settingsElement.className = css.btn
    settingsElement.addEventListener('click', () => toggle(settingsObject))
    settingsElement.appendChild(document.createTextNode('Settings'))
    node.appendChild(settingsElement)

    return node
  }

  /**
   * Create control
   */
  status(): HTMLElement {
    const node = document.createElement('div')
    node.className = css.statuses

    // Time elapsed
    const displayTime = document.createElement('div')
    displayTime.className = css.status
    displayTime.appendChild(document.createTextNode('Time'))
    displayTime.appendChild(document.createElement('br'))

    const timeElement = document.createElement('span')
    timeElement.setAttribute('id', 'time')
    timeElement.appendChild(document.createTextNode('0'))
    displayTime.appendChild(timeElement)
    node.appendChild(displayTime)

    // Mines Remaining
    const displayRemaining = document.createElement('div')
    displayRemaining.className = css.status
    displayRemaining.appendChild(document.createTextNode('Remaining'))
    displayRemaining.appendChild(document.createElement('br'))

    const mineElement = document.createElement('span')
    mineElement.setAttribute('id', 'mines-remaining')
    mineElement.appendChild(document.createTextNode('0'))
    displayRemaining.appendChild(mineElement)

    node.appendChild(displayRemaining)

    return node
  }
}

export default Layout
