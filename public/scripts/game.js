const BLACK = 1, WHITE = -1, DEBUG = 1;
var playerColor = BLACK; //default is black
var playerTurn = true;
var pawnCount = 0;
var board = [ 
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  ]

if (DEBUG) {
    $("td").addClass("debug");
}

$("table").on("click", "td", function(){
    let indexArr = $(this).attr("id").split("i");
    let row = parseInt(indexArr[0], 10), col = parseInt(indexArr[1], 10);

    if (playerTurn && board[row][col] == 0) {
        console.log("Player played %d, %d", row, col);
        playerTurn = false;
        board[row][col] = playerColor;
        console.log(board);
        add(playerColor, $(this).attr("id"));
        pawnCount++;
        
        //checkWinner condition
        if (checkWinner(playerColor, row, col)) {
            alert("You WIN! Congrats!");
        } else {
            if (pawnCount === 225) {
                alert("Oops, it's a draw.");
            } else {
                aiMove();
            }
        }

        
    }
});

$(".resetBtn").on("click", function() {
    playerColor = $(this).attr("id") === "buttonBlack" ? BLACK : WHITE;
    reset();
});

function reset() {
    $("td").removeClass("blackPawn whitePawn");
    for(let i in board) {
        for(let j in board) {
            board[i][j] = 0;
        }
    }
    if (playerColor === WHITE) {
        add(BLACK, "7i7");
        board[7][7] = BLACK;
    }
    playerTurn = true;
    pawnCount = 0;
}

function add(color, id) {
    if (color === BLACK) {
       $("#" + id).addClass("blackPawn");  //certain id which includes ' ', '.' etc. needs to be escaped, so I use 'i' as delim
    } else {
        $("#" + id).addClass("whitePawn");
    }
}

function aiMove() {
    var worker = new Worker("../scripts/ai.js");

    worker.onmessage = function(event) {
        pawnCount++;
        add(-playerColor, event.data);
        let indexArr = event.data.split("i");
        let row = parseInt(indexArr[0], 10), col = parseInt(indexArr[1], 10);
        board[row][col] = -playerColor;
        if (checkWinner(-playerColor, row, col)) {
            alert("You LOOSE! Oops!");
        } else {
            if (pawnCount === 225) {
                alert("Oops, it's a draw.");
            } else {
                playerTurn = true;
            }
        }
    }

    var data = {
        "board": board,
        "color": -playerColor,
        "pawnCount": pawnCount
    };
    worker.postMessage(data);
}

function checkWinner(color, row, col) {                                    //4  2  6
    let dir = [true, true, true, true, true, true, true, true];            //0  P  1
    let countRow = 1, countCol = 1, countDiaR = 1 , countDiaL = 1;         //7  3  5
    for (let i = 1; i <=4; i++ ) {
        if (dir[0] == true) {
            if (col - i < 0) {
                dir[0] = false;
            } else {
                if (board[row][col-i] === color) countRow++;
                else dir[0] = false;
            }
        }
        if (dir[1] == true) {
            if (col + i > 14) {
                dir[1] = false;
            } else {
                if (board[row][col+i] === color) countRow++;
                else dir[1] = false;
            }
        }
        if (dir[2] == true) {
            if (row - i < 0) {
                dir[2] = false;
            } else {
                if (board[row-i][col] === color) countCol++;
                else dir[2] = false;
            }
        }
        if (dir[3] == true) {
            if (row + i > 14) {
                dir[3] = false;
            } else {
                if (board[row+i][col] === color) countCol++;
                else dir[3] = false;
            }
        }
        if (dir[4] == true) {
            if (row - i < 0 || col - i < 0) {
                dir[4] = false;
            } else {
                if (board[row-i][col-i] === color) countDiaR++;
                else dir[4] = false;
            }
        }
        if (dir[5] == true) {
            if (row + i > 14 || col + i > 14) {
                dir[5] = false;
            } else {
                if (board[row+i][col+i] === color) countDiaR++;
                else dir[5] = false;
            }
        }
        if (dir[6] == true) {
            if (row - i < 0 || col + i > 14) {
                dir[6] = false;
            } else {
                if (board[row-i][col+i] === color) countDiaL++;
                else dir[6] = false;
            }
        }
        if (dir[7] == true) {
            if (row + i > 14 || col - i < 0) {
                dir[7] = false;
            } else {
                if (board[row+i][col-i] === color) countDiaL++;
                else dir[7] = false;
            }
        }
        if (countRow > 4 || countCol > 4 || countDiaL > 4 || countDiaR > 4) return true;
    }
    console.log("color: %d, countRow: %d, countCol: %d, countDiaL: %s, countDiaR: %d", color, countRow, countCol, countDiaL, countDiaR);
    return false;
}