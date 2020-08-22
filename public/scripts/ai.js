var cacheBoard = new Map();
var dir = [[0, -1], [0, 1], [-1, 0], [1, 0], [-1, -1], [1, 1], [-1, 1], [1, -1]];
const BLACK = 1, WHITE = -1, MAX_DEPTH = 3;

var test = [ 
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,-1,1,0,0,0,0,0,0,0,0],
    [0,0,0,0,-1,1,1,0,0,0,0,0,0,0,0],
    [0,0,0,0,1,-1,1,0,0,0,-1,0,0,0,0],
    [0,0,0,-1,0,0,-1,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  ]

//TODO, pass in pawnCount to avoid draw in minimax
onmessage = (event) => {
    postMessage(calculateMove(event.data.board, event.data.color, event.data.pawnCount));
}

function calculateMove(board, cpuColor, pawnCount) {
    /*console.log("heuristic score = ", heuristics(test, WHITE));
    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
            if (board[i][j] == 0) return i + "i" + j;
        }
    }
    return "-1i-1";*/
    let depth = 225 - pawnCount >= MAX_DEPTH ? MAX_DEPTH : 225 - pawnCount;
}

function alphabetaMinimax()

// return evaluation score for BLACK
function heuristics(board, colorTurn) { 
    let boardStr = board.join("");
    if (cacheBoard.has(boardStr)) return cacheBoard.get(boardStr); //check cache

    let blackCount = [0, 0, 0, 0, 0, 0]; //open 2, close 2, open 3, close 3, open 4, close 4
    let whiteCount = [0, 0, 0, 0, 0, 0];
    //row
    for (let i = 0; i < 15; i++) {
        let cur = board[i][0], curStreak = cur == 0 ? 0 : 1, blockedFront = true;
        for(let j = 1; j < 15; j++) {
            if (board[i][j] != 0) {
                if (board[i][j] == cur) {
                    curStreak++;
                    if (curStreak > 4) return cur == BLACK ? 1000000 : -1000000;
                }
                else {
                    if (cur != 0 && curStreak > 1 && blockedFront == false) {
                        if (cur == BLACK) blackCount[2 * (curStreak - 2) + 1]++;
                        else whiteCount[2 * (curStreak - 2) + 1]++;
                    }

                    blockedFront = cur == 0 ? false : true;
                    cur = board[i][j];
                    curStreak = 1;
                }
            } else {
                if (cur != 0 && curStreak > 1) {
                    if (blockedFront) {
                        console.log("j: %d", j);
                        if (cur == BLACK) blackCount[2 * (curStreak - 2) + 1]++;
                        else whiteCount[2 * (curStreak - 2) + 1]++;
                    } else {
                        if (cur == BLACK) blackCount[2 * (curStreak - 2)]++;
                        else whiteCount[2 * (curStreak - 2)]++;
                    }
                } 
                cur = 0;
                curStreak = 0;
            }
        }
        if (curStreak > 1 && blockedFront == false) {
            if (cur == BLACK) blackCount[2 * (curStreak - 2) + 1]++;
            else whiteCount[2 * (curStreak - 2) + 1]++;
        }
    }

    //col
    for (let j = 0; j < 15; j++) {
        let cur = board[0][j], curStreak = cur == 0 ? 0 : 1, blockedFront = true;
        for(let i = 1; i < 15; i++) {
            if (board[i][j] != 0) {
                if (board[i][j] == cur) {
                    curStreak++;
                    if (curStreak > 4) return cur == BLACK ? 1000000 : -1000000;
                }
                else {
                    if (cur != 0 && curStreak > 1 && blockedFront == false) {
                        if (cur == BLACK) blackCount[2 * (curStreak - 2) + 1]++;
                        else whiteCount[2 * (curStreak - 2) + 1]++;
                    }

                    blockedFront = cur == 0 ? false : true;
                    cur = board[i][j];
                    curStreak = 1;
                }
            } else {
                if (cur != 0 && curStreak > 1) {
                    if (blockedFront) {
                        console.log("j: %d", j);
                        if (cur == BLACK) blackCount[2 * (curStreak - 2) + 1]++;
                        else whiteCount[2 * (curStreak - 2) + 1]++;
                    } else {
                        if (cur == BLACK) blackCount[2 * (curStreak - 2)]++;
                        else whiteCount[2 * (curStreak - 2)]++;
                    }
                } 
                cur = 0;
                curStreak = 0;
            }
        }
        if (curStreak > 1 && blockedFront == false) {
            if (cur == BLACK) blackCount[2 * (curStreak - 2) + 1]++;
            else whiteCount[2 * (curStreak - 2) + 1]++;
        }
    }

    //diaR
    //let diaRHead = [[0,10],[0,9],[0,8],[0,7],[0,6],[0,5],[0,4],[0,3],[0,2],[0,1],[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[10,0]];
    for (let it1 = 0; it1 <= 10; it1++) {
        let cur = board[0][it1], curStreak = cur == 0 ? 0 : 1, blockedFront = true; //first row then col
        for (let it2 = 1; it2 < 15 - it1; it2++) {
            let i = it2, j = it1 + it2;
            if (board[i][j] != 0) {
                if (board[i][j] == cur) {
                    curStreak++;
                    if (curStreak > 4) return cur == BLACK ? 1000000 : -1000000;
                }
                else {
                    if (cur != 0 && curStreak > 1 && blockedFront == false) {
                        if (cur == BLACK) blackCount[2 * (curStreak - 2) + 1]++;
                        else whiteCount[2 * (curStreak - 2) + 1]++;
                    }

                    blockedFront = cur == 0 ? false : true;
                    cur = board[i][j];
                    curStreak = 1;
                }
            } else {
                if (cur != 0 && curStreak > 1) {
                    if (blockedFront) {
                        console.log("j: %d", j);
                        if (cur == BLACK) blackCount[2 * (curStreak - 2) + 1]++;
                        else whiteCount[2 * (curStreak - 2) + 1]++;
                    } else {
                        if (cur == BLACK) blackCount[2 * (curStreak - 2)]++;
                        else whiteCount[2 * (curStreak - 2)]++;
                    }
                } 
                cur = 0;
                curStreak = 0;
            }
        }
        if (curStreak > 1 && blockedFront == false) {
            if (cur == BLACK) blackCount[2 * (curStreak - 2) + 1]++;
            else whiteCount[2 * (curStreak - 2) + 1]++;
        }

        if (it1 ==0) continue; //prevent re-counting

        cur = board[it1][0]; curStreak = cur == 0 ? 0 : 1; blockedFront = true; 
        for (let it2 = 1; it2 < 15 - it1; it2++) {
            let i = it1 + it2, j = it2;
            if (board[i][j] != 0) {
                if (board[i][j] == cur) {
                    curStreak++;
                    if (curStreak > 4) return cur == BLACK ? 1000000 : -1000000;
                }
                else {
                    if (cur != 0 && curStreak > 1 && blockedFront == false) {
                        if (cur == BLACK) blackCount[2 * (curStreak - 2) + 1]++;
                        else whiteCount[2 * (curStreak - 2) + 1]++;
                    }

                    blockedFront = cur == 0 ? false : true;
                    cur = board[i][j];
                    curStreak = 1;
                }
            } else {
                if (cur != 0 && curStreak > 1) {
                    if (blockedFront) {
                        console.log("j: %d", j);
                        if (cur == BLACK) blackCount[2 * (curStreak - 2) + 1]++;
                        else whiteCount[2 * (curStreak - 2) + 1]++;
                    } else {
                        if (cur == BLACK) blackCount[2 * (curStreak - 2)]++;
                        else whiteCount[2 * (curStreak - 2)]++;
                    }
                } 
                cur = 0;
                curStreak = 0;
            }
        }
        if (curStreak > 1 && blockedFront == false) {
            if (cur == BLACK) blackCount[2 * (curStreak - 2) + 1]++;
            else whiteCount[2 * (curStreak - 2) + 1]++;
        }  
    }

    //diaL
    for (let it1 = 0; it1 <= 10; it1++) {
        let cur = board[0][14-it1], curStreak = cur == 0 ? 0 : 1, blockedFront = true;
        for (let it2 = 1; it2 < 15 - it1; it2++) {
            let i = it2, j = 14 - it1 - it2;
            if (board[i][j] != 0) {
                if (board[i][j] == cur) {
                    curStreak++;
                    if (curStreak > 4) return cur == BLACK ? 1000000 : -1000000;
                }
                else {
                    if (cur != 0 && curStreak > 1 && blockedFront == false) {
                        if (cur == BLACK) blackCount[2 * (curStreak - 2) + 1]++;
                        else whiteCount[2 * (curStreak - 2) + 1]++;
                    }

                    blockedFront = cur == 0 ? false : true;
                    cur = board[i][j];
                    curStreak = 1;
                }
            } else {
                if (cur != 0 && curStreak > 1) {
                    if (blockedFront) {
                        console.log("j: %d", j);
                        if (cur == BLACK) blackCount[2 * (curStreak - 2) + 1]++;
                        else whiteCount[2 * (curStreak - 2) + 1]++;
                    } else {
                        if (cur == BLACK) blackCount[2 * (curStreak - 2)]++;
                        else whiteCount[2 * (curStreak - 2)]++;
                    }
                } 
                cur = 0;
                curStreak = 0;
            }
        }
        if (curStreak > 1 && blockedFront == false) {
            if (cur == BLACK) blackCount[2 * (curStreak - 2) + 1]++;
            else whiteCount[2 * (curStreak - 2) + 1]++;
        }

        if (it1 ==0) continue; 

        cur = board[it1][14]; curStreak = cur == 0 ? 0 : 1; blockedFront = true; 
        for (let it2 = 1; it2 < 15 - it1; it2++) {
            let i = it1 + it2, j = 14 - it2;
            if (board[i][j] != 0) {
                if (board[i][j] == cur) {
                    curStreak++;
                    if (curStreak > 4) return cur == BLACK ? 1000000 : -1000000;
                }
                else {
                    if (cur != 0 && curStreak > 1 && blockedFront == false) {
                        if (cur == BLACK) blackCount[2 * (curStreak - 2) + 1]++;
                        else whiteCount[2 * (curStreak - 2) + 1]++;
                    }

                    blockedFront = cur == 0 ? false : true;
                    cur = board[i][j];
                    curStreak = 1;
                }
            } else {
                if (cur != 0 && curStreak > 1) {
                    if (blockedFront) {
                        console.log("j: %d", j);
                        if (cur == BLACK) blackCount[2 * (curStreak - 2) + 1]++;
                        else whiteCount[2 * (curStreak - 2) + 1]++;
                    } else {
                        if (cur == BLACK) blackCount[2 * (curStreak - 2)]++;
                        else whiteCount[2 * (curStreak - 2)]++;
                    }
                } 
                cur = 0;
                curStreak = 0;
            }
        }
        if (curStreak > 1 && blockedFront == false) {
            if (cur == BLACK) blackCount[2 * (curStreak - 2) + 1]++;
            else whiteCount[2 * (curStreak - 2) + 1]++;
        }  
    }

    console.log("heuristic begin");
    console.log(blackCount);
    console.log(whiteCount);
    console.log("heuristic end");

    let blackScore = calculateScore(colorTurn == BLACK, blackCount);
    let whiteScore = calculateScore(colorTurn == WHITE, whiteCount);
    let finalScore = blackScore - whiteScore;
    cacheBoard.set(boardStr, finalScore);
    return finalScore;
}

function calculateScore(isThisTurn, countArr) {
    let score = countArr[1] + 10 * countArr[0];
    if (isThisTurn) {
        if (countArr[4] + countArr[5] > 0) return 1000000; 
        score += countArr[3] * 1000; //close 3
        score += countArr[2] * 10000; //open 3
    } else {
        score += 200000 * countArr[5] + 100000 * countArr[4] + 500 * countArr[3] + 5000 * countArr[2];
    }
    return score;
}

