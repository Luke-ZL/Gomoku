# Gomoku
## Introduction
 A Web based Gomoku Game with a Alpha Beta Minimax AI and a multiplayer mode.

 Frontend uses jQuery and Bootstrap4.

 Backend uses express framework. Single player uses AlphaBeta Minimax algotithm with a depth of five (including leaf nodes) for a almost instant response (a smooth gameplay can use up to 6). I also use web worker to achieve an asynchronous thinking (without blocking the UI). Multiplayer mode is powered by socket.io.

 The [game](http://gomokutoday-env.eba-rphfdajs.us-west-1.elasticbeanstalk.com/) is deployed on aws. Check it out!
 
## Components
[views](https://github.com/Luke-ZL/Gomoku/tree/master/views) contains all the Embedded JavaScript templates(.ejs) files that are used in this project. All pages use the same header template header.ejs which contains the common NavBar, and the same foot template foot.ejs.

[public](https://github.com/Luke-ZL/Gomoku/tree/master/public) contains all the [assets](https://github.com/Luke-ZL/Gomoku/tree/master/public/assets), [scripts](https://github.com/Luke-ZL/Gomoku/tree/master/public/assets) and stylesheets(https://github.com/Luke-ZL/Gomoku/tree/master/public/stylesheets) used in the project.

[node_modules](https://github.com/Luke-ZL/Gomoku/tree/master/node_modules) contains express framework and socket.io library that are used in this project.

## Running
```
$ node appp.js
```
and open localost:3001
