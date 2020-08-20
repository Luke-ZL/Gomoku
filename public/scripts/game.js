const BLACK = 0, WHITE = 1;
var playerColor = BLACK; //default is black

$("table").on("click", "td", function(){
    console.log("%s", $(this).attr("id"));
    add(playerColor, $(this).attr("id"));
});

$(".resetBtn").on("click", function() {
    console.log($(this).attr("id"));
    playerColor = $(this).attr("id") === "buttonBlack" ? 0 : 1;
    reset();
});

function reset() {
    console.log(playerColor);
}

function add(color, id) {
    if (color == BLACK) {
       $("#" + id).addClass("blackPawn");  // certainid which includes ' ', '.' etc. needs to be escaped, so I use 'i' as delim
    }
}