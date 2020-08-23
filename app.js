const express = require("express");
const http = require("http");
const socket = require("socket.io");

const port = process.env.PORT || 3001;

app = express();
const server = http.createServer(app);
const io = socket(server);

const BLACK = 1, WHITE = -1;
var games = Array(100);
for (let i = 0; i < 100; i++) {
    games[i] = {
        playerCount : 0,
        pid: ["-1", "-1"] //playerId for the two players
    }
}

io.on("connect", function(socket){
    var playerId = Math.floor(Date.now() / 1000).toString() + Math.floor(Math.random() * 100);
    console.log(playerId + " connected.");

    socket.on("join", function(roomId) {
        if (games[roomId].playerCount < 2) {
            games[roomId].playerCount++;
            games[roomId].pid[games[roomId].playerCount - 1] = playerId;
            playerColor = games[roomId].playerCount % 2 == 1 ? BLACK : WHITE;
            socket.join(roomId.toString());
            io.to(roomId.toString()).emit("game", [games[roomId].pid, games[roomId].playerCount, playerColor, roomId]);
            //socket.emit("game", [games[roomId].pid, games[roomId].playerCount, playerColor, roomId]);
            //socket.broadcast.emit("game", [games[roomId].pid, games[roomId].playerCount, playerColor, roomId]);
        } else {
            socket.emit("full", roomId);
            return;
        }
    });

    socket.on("disconnect", function() {
        for (let i = 0; i< 100; i++) {
            if (games[i].pid[0] == playerId || games[i].pid[1] == playerId) {
                games[i].playerCount--;
                games[i].pid[0] = games[i].pid[0] == playerId ? games[i].pid[1] : games[i].pid[0];
                io.to(i.toString()).emit("enemyLeave");
                break;
            }
        }

        console.log(playerId + " disconnected.")
    });
});

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res){
    res.render("home");
});

app.get("/single", function(req, res) {
    res.render("single");
});

app.get("/multiplayer", function(req, res) {
    res.render("multiplayer");
});

app.get("/full", function(req, res) {
    res.render("full");
});

server.listen(port);
console.log("... server starts in port 3001");

// app.listen(3001, 'localhost', function() {
//     console.log("... server starts in port 3001");
// });
