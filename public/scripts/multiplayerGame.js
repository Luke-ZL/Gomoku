//prevent page refresh after clicking button
//also disable pressing enter to submit
//or it will cause page to refresh
//page refresh will cause re-connection and
//change of pid
//this is because by default button submit a
//POST request to itself
//https://stackoverflow.com/questions/45634088/how-to-prevent-page-from-reloading-after-form-submit-jquery/45634140
$(document).ready(function () {
    // Listen to submit event on the <form> itself!
    $('#selectRoomForm').submit(function (event) {
      event.preventDefault();
    });
  });



var socket = io();
var roomId;
const BLACK = 1, WHITE = -1;
var playerId = "null";
var playerColor = 0;
var pawnCount = 0;
var playerTurn = BLACK;
var gameStart = false;
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

function reset(color) {
    playerColor = color;
    playerTurn = BLACK;
    gameStart = false;
    pawnCount = 0;
    for(let i in board) {
        for(let j in board) {
            board[i][j] = 0;
        }
    }
    $("#Rid").text("NULL");
    $("#Rcolor").text("NULL");
    $("#Lcolor").text("black");
    $("td").removeClass("blackPawn");
    $("td").removeClass("whitePawn");
    $("td").removeClass("redBorder");
}

var connect = function() {
    roomId = parseInt($("#selectRoomInput").val());
    if (roomId < 100 && roomId >= 0) {
        socket.emit("join", roomId);
    }
}

socket.on("full", function(msg) {
    if (roomId == msg) window.location.assign("/full");
});

/*
You need to send a message through socket.io back to the user. 
This message you handle client side and there you redirect the 
user. Be careful though, redirecting the user like normal HTTP 
redirect will break the websocket connection. A better alternative 
is to handle it like a Single Page Application and change state 
on the client.
https://stackoverflow.com/questions/30284224/node-js-socket-io-redirect-user-to-other-page-after-joining-a-room
*/

socket.on("game", function(msg) { //[pid, playerCount, playerColor, roomId]
    if (roomId == msg[3]) {
        $("#selectRoomForm").remove();
        $("#board").removeClass("d-none");
        $("#leftPlayerInfo").removeClass("d-none");
        $("#rightPlayerInfo").removeClass("d-none");
        let colorStr = msg[2] == BLACK ? "black" : "white";
        if (playerId == "null") {
            playerId = msg[0][msg[1]-1];
            playerColor = msg[2];
            $("#roomId").text(msg[3].toString());
            $("#Lid").text(playerId);
            $("#Lcolor").text(colorStr);
            if (msg[1] == 2) {
                $("#Rid").text(msg[0][0]);
                colorStr = msg[2] == BLACK ? "white" : "black" ;
                $("#Rcolor").text(colorStr);
                gameReady();
            }
        } else {
            $("#Rid").text(msg[0][1]);
            $("#Rcolor").text(colorStr);
            gameReady();
        }
    }
});

socket.on("applyMove", function(msg){ //[playerColor, row, col]]
    //console.log("applyMove");
    let row = msg[1], col = msg[2], thisColor = msg[0];
    board[row][col] = thisColor;
    $("td").removeClass("redBorder");
    if (thisColor === BLACK) {
        $("#" + row + "i" + col).addClass("blackPawn");  //certain id which includes ' ', '.' etc. needs to be escaped, so I use 'i' as delim
        $("#" + row + "i" + col).removeClass("transparentBackground");
    } else {
        $("#" + row + "i" + col).addClass("whitePawn");
        $("#" + row + "i" + col).removeClass("transparentBackground");
    }
    $("#" + row + "i" + col).addClass("redBorder");
    pawnCount++;
    if (checkWinner(row, col)) {
        if (thisColor == playerColor) {
            alert("You WIN! Congrats!");
            reset(-playerColor);
            gameReady();
        } else {
            alert("You LOOSE! Oops!");
            reset(-playerColor);
            gameReady();
        }
    } else {
        if (pawnCount >= 225) {
            alert("Oops, it's a draw.");
            reset(-playerColor);
            gameReady();
        }
    }
    if (thisColor != playerColor) playerTurn = -playerTurn;
});

socket.on("enemyLeave", function(){
    reset(BLACK);
});



function gameReady() {
    gameStart = true;
    $("table").on("click", "td", function(){
        console.log([playerId, playerColor, playerTurn, gameStart]);
        let indexArr = $(this).attr("id").split("i");
        let row = parseInt(indexArr[0], 10), col = parseInt(indexArr[1], 10);
    
        if (gameStart && playerTurn == playerColor && board[row][col] == 0) {
            playerTurn = -playerTurn;
            socket.emit("tryMove", [roomId, playerColor, row, col]);
        }
    });

    $("td").hover(function() {
        if (playerTurn != playerColor) return;
        let colorStr = playerColor == BLACK ? "blackPawn" : "whitePawn";
        let indexArr = $(this).attr("id").split("i");
        let row = parseInt(indexArr[0], 10), col = parseInt(indexArr[1], 10);
        if (board[row][col] == 0) $(this).addClass(colorStr + " transparentBackground");
    }, function() {
        if (playerTurn != playerColor) return;
        let colorStr = playerColor == BLACK ? "blackPawn" : "whitePawn";
        let indexArr = $(this).attr("id").split("i");
        let row = parseInt(indexArr[0], 10), col = parseInt(indexArr[1], 10);
        if (board[row][col] == 0) {
            $(this).removeClass("transparentBackground " + colorStr);
        } 
    });
}




function checkWinner(row, col) {         
    let color = board[row][col];                               //4  2  6
    let dirFlag = [true, true, true, true, true, true, true, true];            //0  P  1
    let countRow = 1, countCol = 1, countDiaR = 1 , countDiaL = 1;             //7  3  5
    for (let i = 1; i <=4; i++ ) {
        if (dirFlag[0] == true) {
            if (col - i < 0) {
                dirFlag[0] = false;
            } else {
                if (board[row][col-i] === color) countRow++;
                else dirFlag[0] = false;
            }
        }
        if (dirFlag[1] == true) {
            if (col + i > 14) {
                dirFlag[1] = false;
            } else {
                if (board[row][col+i] === color) countRow++;
                else dirFlag[1] = false;
            }
        }
        if (dirFlag[2] == true) {
            if (row - i < 0) {
                dirFlag[2] = false;
            } else {
                if (board[row-i][col] === color) countCol++;
                else dirFlag[2] = false;
            }
        }
        if (dirFlag[3] == true) {
            if (row + i > 14) {
                dirFlag[3] = false;
            } else {
                if (board[row+i][col] === color) countCol++;
                else dirFlag[3] = false;
            }
        }
        if (dirFlag[4] == true) {
            if (row - i < 0 || col - i < 0) {
                dirFlag[4] = false;
            } else {
                if (board[row-i][col-i] === color) countDiaR++;
                else dirFlag[4] = false;
            }
        }
        if (dirFlag[5] == true) {
            if (row + i > 14 || col + i > 14) {
                dirFlag[5] = false;
            } else {
                if (board[row+i][col+i] === color) countDiaR++;
                else dirFlag[5] = false;
            }
        }
        if (dirFlag[6] == true) {
            if (row - i < 0 || col + i > 14) {
                dirFlag[6] = false;
            } else {
                if (board[row-i][col+i] === color) countDiaL++;
                else dirFlag[6] = false;
            }
        }
        if (dirFlag[7] == true) {
            if (row + i > 14 || col - i < 0) {
                dirFlag[7] = false;
            } else {
                if (board[row+i][col-i] === color) countDiaL++;
                else dirFlag[7] = false;
            }
        }
        if (countRow > 4 || countCol > 4 || countDiaL > 4 || countDiaR > 4) return true;
    }
        return false;
}
