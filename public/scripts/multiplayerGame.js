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

var connect = function() {
    roomId = parseInt($("#selectRoomInput").val());
    console.log($("#selectRoomInput").val());
    if (roomId < 100 && roomId >= 0) {
        $("#selectRoomForm").addClass("d-none");
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

socket.on("game", function(msg) {
    if (roomId == msg) $("#selectRoomForm").remove();
});




