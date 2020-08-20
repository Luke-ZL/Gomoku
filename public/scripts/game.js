const BLACK = 1, WHITE = -1, DEBUG = 1;
var playerColor = BLACK; //default is black
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

    //TODO: check move validity
    board[row][col] = playerColor;
    console.log(board);
    add(playerColor, $(this).attr("id"));
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
}

function add(color, id) {
    if (color === BLACK) {
       $("#" + id).addClass("blackPawn");  // certainid which includes ' ', '.' etc. needs to be escaped, so I use 'i' as delim
    } else {
        $("#" + id).addClass("whitePawn");
    }
}