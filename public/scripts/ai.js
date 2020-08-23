var cacheBoard = new Map();
var cpuColor = 0;
var boardIndexArray = [...Array(225).keys()];
var dir = [[0, -1], [0, 1], [-1, 0], [1, 0], [-1, -1], [1, 1], [-1, 1], [1, -1]];
const BLACK = 1, WHITE = -1, MAX_DEPTH = 4;

onmessage = (event) => {
    postMessage(calculateMove(event.data.board, event.data.color, event.data.pawnCount));
}

function calculateMove(board, aiColor, pawnCount) {
    //shuffle the board Index array to add randomness
    shuffle(boardIndexArray);

    cpuColor = aiColor;
    let depth = 225 - pawnCount >= MAX_DEPTH ? MAX_DEPTH : 225 - pawnCount;

    let res = alphabetaMinimax(board, depth, -Infinity, Infinity, 1); 
    return res[1] + "i" + res[2];
}

function checkAfinity(board, row, col) {
    for (let i = 0; i < dir.length; i++) {
        if (row + dir[i][0] >= 0 && col + dir[i][1] >= 0 && row + dir[i][0] < 15 && col + dir[i][1] < 15) {
            if (board[row+dir[i][0]][col+dir[i][1]] != 0) return true;
        }
    }
}

function alphabetaMinimax(board, depth, alpha, beta, isCpu) {  //isCpu : 1; notCpu : -1
    if (depth == 0) return [cpuColor * heuristic(board, isCpu * cpuColor), -1, -1];
                            //make heuristic relative to cpu
    if (isCpu == 1) {
        let maxScore = -Infinity;
        let bestMove = [-1, -1];
        let moveCount = 0;                                                              //for debug purpose
        for (let i = 0; i < 225; i++) {
            let row = Math.floor(boardIndexArray[i] / 15), col = boardIndexArray[i] % 15;
            if (board[row][col] == 0 && checkAfinity(board, row, col)) {
                moveCount++;                                                            //for debug purpose
                if (depth == MAX_DEPTH) console.log("checking %d move: ", moveCount);   //for debug purpose
                board[row][col] = cpuColor;

                if (checkWinner(board, row, col)) {
                    board[row][col] = 0;
                    return [10000000, row, col];
                }

                let curScore = alphabetaMinimax(board, depth-1, alpha, beta, -isCpu)[0];
                if (curScore > maxScore) {
                    maxScore = curScore;
                    bestMove = [row, col];
                }
                board[row][col] = 0;
                alpha = Math.max(alpha, maxScore);
                if (alpha >= beta) break;
            }
        }
        return [maxScore, bestMove[0], bestMove[1]];
    } else {
        let minScore = Infinity;
        let bestMove = [-1, -1];
        for (let i = 0; i < 225; i++) {
            let row = Math.floor(boardIndexArray[i] / 15), col = boardIndexArray[i] % 15;
            if (board[row][col] == 0 && checkAfinity(board, row, col)) {
                board[row][col] = -cpuColor;

                if (checkWinner(board, row, col)) {
                    board[row][col] = 0;
                    return [-10000000, row, col];
                }

                let curScore = alphabetaMinimax(board, depth-1, alpha, beta, -isCpu)[0];
                if (curScore < minScore) {
                    minScore = curScore;
                    bestMove = [row, col];
                }
                board[row][col] = 0;
                beta = Math.min(beta, minScore);
                if (alpha >= beta) break;
            }
        }
        return [minScore, bestMove[0], bestMove[1]];
    }
}

// return evaluation score for BLACK
function heuristic(board, colorTurn) { 
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
                    if (curStreak > 4) return cur == BLACK ? 10000000 : -10000000;
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
                    if (curStreak > 4) return cur == BLACK ? 10000000 : -10000000;
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
                    if (curStreak > 4) return cur == BLACK ? 10000000 : -10000000;
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
                    if (curStreak > 4) return cur == BLACK ? 10000000 : -10000000;
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
                    if (curStreak > 4) return cur == BLACK ? 10000000 : -10000000;
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
                    if (curStreak > 4) return cur == BLACK ? 10000000 : -10000000;
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
    /*
    console.log("heuristic begin");
    console.log(blackCount);
    console.log(whiteCount);
    console.log("heuristic end");
    */
    let blackScore = calculateScore(colorTurn == BLACK, blackCount);
    let whiteScore = calculateScore(colorTurn == WHITE, whiteCount);
    let finalScore = blackScore - whiteScore;
    cacheBoard.set(boardStr, finalScore);
    return finalScore;
}

function calculateScore(isThisTurn, countArr) {
    let score = countArr[1] + 10 * countArr[0];
    if (isThisTurn) {
        if (countArr[4] + countArr[5] > 0) return 10000000; 
        score += countArr[3] * 2000; //close 3
        if (countArr[2] > 1) score += 200000; //more than 1 open 3 will almost guarantee a lose;
        else score += countArr[2] * 50000; //open 3
    } else {
        score += 200000 * countArr[4] + 10000 * countArr[5] + 1000 * countArr[3];
        if (countArr[2] > 1) score += 100000;
        else score += 10000 * countArr[2];
    }
    return score;
}


//add some randomness to the AI thinking
//https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
//I think the default iterator's iterating sequence is not modified due to it's shift in place nature
//for in will not be shuffled
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}



function checkWinner(board, row, col) {    
    color = board[row][col];                                               //4  2  6
    let dirFlag = [true, true, true, true, true, true, true, true];        //0  P  1
    let countRow = 1, countCol = 1, countDiaR = 1 , countDiaL = 1;         //7  3  5
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