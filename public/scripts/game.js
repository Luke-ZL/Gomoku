const BLACK = 0, WHITE = 1;
var playerColor = BLACK; //default is black

$("table").on("click", "td", function(){
    console.log("%s, %s", $(this).parent().attr("id"), $(this).attr("id"));
    $(this).toggleClass("clicked");
});

$(".resetBtn").on("click", function() {
    console.log($(this).attr("id"));
    playerColor = $(this).attr("id") === "buttonBlack" ? 0 : 1;
    reset();
});

function reset() {
    console.log(playerColor);
}
