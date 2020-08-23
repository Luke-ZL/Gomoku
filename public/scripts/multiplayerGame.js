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

function reset() {
    playerColor = BLACK;
    playerTurn = BLACK;
    gameStart = false;
    board = [ 
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
    $("#Rid").text("NULL");
    $("#Rcolor").text("NULL");
    $("#Lcolor").text("black");
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
    console.log(msg);
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
            }
        } else {
            $("#Rid").text(msg[0][1]);
            $("#Rcolor").text(colorStr);
        }
    }
});

socket.on("enemyLeave", function(){
    reset();
});




