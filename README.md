# Gomoku
 A Web based Gomoku Game with a Alpha Beta Minimax AI and a multiplier mode.

 Frontend uses jQuery and Bootstrap4.
 
 Backend uses express framework. Single player uses AlphaBeta Minimax algotithm with a depth of five (including leaf nodes) for a almost instant response (a smooth gameplay can use up to 6). I also use web worker to achieve an asynchronous thinking (without blocking the UI). Multiplayer mode is powered by socket.io.
