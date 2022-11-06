import Game from './Game'
import {question} from './utils'
// @ts-ignore
import css from '../css/elements.module.css'

export class Elements {
  parentElement: HTMLElement
  game: Game

  constructor(gameObj: Game) {
    this.parentElement = document.getElementsByTagName('main')[0]
    this.game = gameObj
  }

  build() {
    this.title();
    this.instructions();
    this.messageBox();
    this.board();
    this.controls();
  }

  static buildInterface(gameObj: Game) {
    const ElementObj = new Elements(gameObj)
    ElementObj.build()
  }

  // Create title
  title() {
    let node = document.createElement("h1");
    let text = document.createTextNode('MineSweeper');
    node.appendChild(text);

    let spanElement = document.createElement("span");
    spanElement.className = css.question
    spanElement.innerHTML = '&#65046;';
    spanElement.addEventListener('click', question);
    node.appendChild(spanElement);

    this.parentElement.appendChild(node)
  }

  // Create messagebox
  messageBox() {
    let node = document.createElement("div");
    node.className = css.messageBox;
    node.setAttribute('id', 'messageBox');
    this.parentElement.appendChild(node)
  }

  // Create board
  board() {
    let node;

    const board = document.createElement("div");
    board.className = css.board;
    let parent = this.parentElement.appendChild(board);

    for (let row = 0; row < Game.boardSize; row++) {
      for (let column = 0; column < Game.boardSize; column++) {
        node = document.createElement("div");
        node.setAttribute('id', Game.cellPrefix + row + "" + column);
        parent.appendChild(node);
      }
    }
  }

  // Create messagebox
  instructions() {
    let node = document.createElement("div");
    node.className = css.instructions;
    node.setAttribute('id', 'instructions');

    node.appendChild(document.createTextNode('Left Click: Open Cell'));
    node.appendChild(document.createElement("br"));
    node.appendChild(document.createTextNode('Right Click: Place Flag'));
    node.appendChild(document.createElement("br"));
    node.appendChild(document.createTextNode('Ctrl + Left Click: Open Adjacent, Non-Flagged Cells'));
    node.appendChild(document.createElement("br"));

    this.parentElement.appendChild(node)
  }

  // Create control
  controls() {
    const node = document.createElement("div");
    node.className = css.controls;

    // Time elapsed
    const displayTime = document.createElement("div");
    displayTime.className = css.userDisplay;
    displayTime.appendChild(document.createTextNode('Time'));
    displayTime.appendChild(document.createElement("br"));

    const timeElement = document.createElement("span");
    timeElement.setAttribute('id', 'time');
    timeElement.appendChild(document.createTextNode('0'));
    displayTime.appendChild(timeElement);

    displayTime.appendChild(document.createTextNode('s'));
    node.appendChild(displayTime);

    // Button
    const buttonElement = document.createElement("button");
    buttonElement.className = css.button;
    buttonElement.setAttribute('id', 'new-game-button');
    buttonElement.appendChild(document.createTextNode('New Game'));
    node.appendChild(buttonElement);

    // Mines Remaining
    const displayRemaining = document.createElement("div");
    displayRemaining.className = css.userDisplay;
    displayRemaining.appendChild(document.createTextNode('Remaining'));
    displayRemaining.appendChild(document.createElement("br"));

    const mineElement = document.createElement("span");
    mineElement.setAttribute('id', 'mines-remaining');
    mineElement.appendChild(document.createTextNode('0'));
    displayRemaining.appendChild(mineElement);

    node.appendChild(displayRemaining);

    this.parentElement.appendChild(node)
  }
}

export default Elements;
