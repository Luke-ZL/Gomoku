onmessage = (event) => {
    postMessage(calculateMove(event.data.board, event.data.color));
}

function calculateMove(board, color) {
    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
            if (board[i][j] == 0) return i + "i" + j;
        }
    }
    return "-1i-1";
}

