const Player = (mark, ai = false) => {
    const getMark = () => mark;
    const isAI = () => ai;

    let wins = 0;
    const getWins = () => wins;
    const addWin = () => (wins = wins + 1);

    const playMove = () => {
        if (!ai) {
            return;
        }

        return document.querySelector(
            `.tile[data-pos='${Math.floor(Math.random() * 9)}']`
        );
    };

    return { getMark, isAI, getWins, addWin, playMove };
};

let myself = Player("x", false);

const Board = (player1, player2) => {
    let board = [];
    let players = [player1, player2];
    let turn;

    if (player1.getMark() == "x") {
        turn = 0;
    } else {
        turn = 1;
    }

    const resetBoard = () => {
        board = [];
        for (let i = 0; i < 3; i++) {
            board.push(["", "", ""]);
        }
    };

    const getBoard = () => board;

    const getTurn = () => turn;

    const isValidMove = (tile) => {
        let row = Math.floor(tile / 3);
        let col = tile % 3;

        return board[row][col] == "";
    };

    const sendMove = (player, tileObj) => {
        let tile = tileObj.dataset.pos;

        if (player != players[turn]) {
            return -1;
        }

        if (!isValidMove(tile)) {
            return -1;
        }

        let row = Math.floor(tile / 3);
        let col = tile % 3;

        board[row][col] = player.getMark();
        turn = Math.abs(turn - 1);

        return tile;
    };

    const getWinMark = () => {
        
        const WINNING_COMBINATIONS = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]
        // Check rows & columns
        for (let i = 0; i < 3; i++) {


            // Rows
            if (!(board[i][0] ===  "" || board[i][1] === "" || board[i][2] === "")) {
                if (board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
                    return board[i][0];
                }
            }
                
                   
            // Cols
            if (!(board[0][i] ===  "" || board[1][i]  === "" || board[2][i]  === "")) {
                if (board[0][i]  === board[1][i]  && board[1][i]  === board[2][i] ) {
                    return board[0][i];
                }
            }
        }

        

        // Check diagonals
        if (!((board[0][0] === "" || board[1][1] === "" || board[2][2] === ""))) {
            if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
                return board[1][1];
            }
        }

        if (!((board[0][2] === "" || board[1][1] === "" || board[2][0] === ""))) {
            if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
                return board[1][1];
            }
        }

        return -1;
    };

    const getWinner = () => {
        let winMark = getWinMark();

        if (winMark == -1) {
            return -1;
        }

        if (winMark == player1.getMark()) {
            return player1;
        } else {
            return player2;
        }
    };

    const evalInput = (humanPlayer, tileObj) => {
        let move = sendMove(humanPlayer, tileObj);
        if (move == -1) {
            return;
        }

        tileObj.classList.add("active");
        tileObj.textContent = humanPlayer.getMark().toUpperCase();

        let winner = getWinner();
        if (winner != -1 ) {
            console.log(winner);
        }
    };

    const minimax = (state, depth, player) => {
        
    }

    resetBoard();
    return {
        resetBoard,
        getBoard,
        getTurn,
        sendMove,
        getWinner,
        evalInput,
        isValidMove
    };
};

/*
 * Game Setup
 */

// Get player mark
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let playerMark = urlParams.get("mark");
let aiMark = "";

// Ensure that only "x" and "y" are valid inputs
if (playerMark != "o") {
    playerMark = "x";
    aiMark = "o";
} else {
    aiMark = "x";
}

const humanPlayer = Player(playerMark);
const aiPlayer = Player(aiMark, true);
const gameBoard = Board(humanPlayer, aiPlayer);

// update turn card
const turnSpan = document.querySelector(".turn");
function toggleTurn() {
    if (gameBoard.getTurn() == 0) {
        turnSpan.textContent = "X";
    } else {
        turnSpan.textContent = "O";
    }
}

const tiles = document.querySelectorAll(".tile");
tiles.forEach((tile) => {
    tile.addEventListener("click", () => {
        if (tile.classList.contains("active")) {
            return;
        }

        gameBoard.evalInput(humanPlayer, tile);
        toggleTurn();

        if (gameBoard.getWinner() != -1) {
            return;
        }

        setTimeout(() => {

            let move = aiPlayer.playMove();
            while ( !gameBoard.isValidMove(move.dataset.pos) ) {
                move = aiPlayer.playMove();
            }

            gameBoard.evalInput(aiPlayer, move);
        }, 1);
        toggleTurn();
    });
});
