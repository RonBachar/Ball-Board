const WALL = "WALL";
const FLOOR = "FLOOR";
const BALL = "BALL";
const GAMER = "GAMER";
const GLUE = "GLUE";
const PORTAL = " ";

const GAMER_IMG = '<img src="img/gamer.png" />';
const BALL_IMG = '<img src="img/ball.png" />';

// THE MODEL:
var gBoard;
var gGamerPos;
var gNewBallsInterval;
var gCollectedBalls;

function initGame() {
  gCollectedBalls = 0;
  document.querySelector("#balls-count").innerText = gCollectedBalls;
  gGamerPos = { i: 1, j: 10 };
  gBoard = buildBoard();
  renderBoard(gBoard);
}

function buildBoard() {
  // Create the Matrix

  var board = new Array(10);
  for (var i = 0; i < board.length; i++) {
    board[i] = new Array(12);
  }

  // Put FLOOR everywhere and WALL at edges
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      // Put FLOOR in a regular cell
      var cell = { type: FLOOR, gameElement: null };

      // Place Walls at edges
      if (
        i === 0 ||
        i === board.length - 1 ||
        j === 0 ||
        j === board[0].length - 1
      ) {
        cell.type = WALL;
      }

      if (
        (i === 5 && j === 0) ||
        (j === 6 && i === 0) ||
        (i === board.length - 1 && j === 6) ||
        (j === board[i].length - 1 && i === 5)
      ) {
        cell.type = FLOOR;
        // cell.gameElement = PORTAL;
      }

      // Add created cell to The game board
      board[i][j] = cell;
    }
  }

  // Place the gamer at selected position
  board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

  gNewBallsInterval = setInterval(renderBall, 1500);
  board[3][8].gameElement = BALL;
  board[7][4].gameElement = BALL;

  // console.log(board);
  return board;
}

// Render the board to an HTML table
function renderBoard(board) {
  var strHTML = "";
  for (var i = 0; i < board.length; i++) {
    strHTML += "<tr>\n";
    for (var j = 0; j < board[0].length; j++) {
      var currCell = board[i][j];

      var cellClass = getClassName({ i: i, j: j });

      // TODO - change to short if statement
      if (currCell.type === FLOOR) cellClass += " floor";
      else if (currCell.type === WALL) cellClass += " wall";

      //TODO - Change To ES6 template string
      strHTML +=
        '\t<td class="cell ' +
        cellClass +
        '"  onclick="moveTo(' +
        i +
        "," +
        j +
        ')" >\n';

      // TODO - change to switch case statement
      if (currCell.gameElement === GAMER) {
        strHTML += GAMER_IMG;
      } else if (currCell.gameElement === BALL) {
        strHTML += BALL_IMG;
      }

      strHTML += "\t</td>\n";
    }
    strHTML += "</tr>\n";
  }

  // console.log('strHTML is:');
  // console.log(strHTML);

  var elBoard = document.querySelector(".board");
  elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j) {
  var targetCell;
  console.log("this is i ", i, "this is j ", j);
  if (i === -1) {
    i = 9;
  }
  if (i === 10) {
    i = 0;
  }
  if (j === 12) {
    j = 0;
  }
  if (j === -1) {
    j = 11;
  }

  console.log("this is after i ", i, "this is after j ", j);
  if (!targetCell) {
    targetCell = gBoard[i][j];
  }

  if (targetCell.type === WALL) return;
  // Calculate distance to make sure we are moving to a neighbor cell
  var iAbsDiff = Math.abs(i - gGamerPos.i);
  var jAbsDiff = Math.abs(j - gGamerPos.j);

  // If the clicked Cell is one of the four allowed
  if (
    (iAbsDiff === 1 && jAbsDiff === 0) ||
    (jAbsDiff === 1 && iAbsDiff === 0)
  ) {
    if (targetCell.gameElement === BALL) {
      console.log("Collecting!");
      gCollectedBalls++;
      document.querySelector("#balls-count").innerText = gCollectedBalls;
      if (gCollectedBalls === 5) {
        let elRestartBtn = document.getElementById("restart-button");
        elRestartBtn.style.visibility = "visible";
        elRestartBtn.addEventListener("click", restartGame);
      }
    }

    // MOVING from current position
    // Model:
    gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
    // Dom:
    renderCell(gGamerPos, "");

    // MOVING to selected position
    // Model:
    gGamerPos.i = i;
    gGamerPos.j = j;
    gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
    // DOM:
    renderCell(gGamerPos, GAMER_IMG);
  } // else console.log('TOO FAR', iAbsDiff, jAbsDiff);
  document.querySelector("#balls-count").innerText = gCollectedBalls;
}

// Move the player by keyboard arrows
function handleKey(event) {
  var i = gGamerPos.i;
  var j = gGamerPos.j;

  switch (event.key) {
    case "ArrowLeft":
      moveTo(i, j - 1);
      break;
    case "ArrowRight":
      moveTo(i, j + 1);
      break;
    case "ArrowUp":
      moveTo(i - 1, j);
      break;
    case "ArrowDown":
      moveTo(i + 1, j);
      break;
  }
}

// Returns the class name for a specific cell
function getClassName(location) {
  var cellClass = "cell-" + location.i + "-" + location.j;
  return cellClass;
}

function renderBall() {
  var randIidx = getRandomInt(1, gBoard.length - 2);
  var randJidx = getRandomInt(1, gBoard.length - 2);
  var cell = gBoard[randIidx][randJidx];
  var isCellFound = false;

  while (!isCellFound) {
    if (cell.type === FLOOR && cell.gameElement === null) {
      isCellFound = true;
      cell.gameElement = BALL;
    } else {
      randIidx = getRandomInt(1, gBoard.length - 2);
      randJidx = getRandomInt(1, gBoard.length - 2);
      cell = gBoard[randIidx][randJidx];
    }
  }

  var ballPos = {
    i: randIidx,
    j: randJidx,
  };

  renderCell(ballPos, BALL_IMG);
}

function restartGame() {
  let approve = confirm("Are you Sure?");
  if (approve) initGame();
}
