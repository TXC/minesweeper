# Minesweeper

## Rules of the Game

* The minesweeper board is a 10 x 10 square. We could make it other sizes, like the classic Windows version, but for demonstration purposes we will stick to the smaller, “beginner” version of the game.
* The board has a predetermined number of randomly placed mines. The player cannot see them.
* Cells can exist in one of two states: opened or closed. Clicking on a cell opens it. If a mine was lurking there, the game ends in failure. If there is no mine in the cell, but there are mines in one or more of its neighboring cells, then the opened cell shows the neighboring mine count. When none of the cell’s neighbors are mined, each one of those cells is opened automatically.
* Right clicking on a cell marks it with a flag. The flag indicates that the player knows there is a mine lurking there.
* Holding down the ctrl (Other)/meta (MacOS) button while clicking on an opened cell has some slightly complicated rules. If the number of flags surrounding the cell match its neighbor mine count, and each flagged cell actually contains a mine, then all closed, unflagged neighboring cells are opened automatically. However, if even one of these flags was placed on the wrong cell, the game ends in failure.
* The player wins the game if he/she opens all cells without mines.

## Install
 ```
 git clone https://github.com/TXC/minesweeper.git
 npm install
 npm run build
 ```
 And all files should be in `public`
 
 ## Links
 
