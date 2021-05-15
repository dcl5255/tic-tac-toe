let playBoard = ["", "", "", "", "", "", "", "", ""];
let boardEmpty = true;
let boardFull = false;
let playingComputer = true;
let currentlyPlayerOne = true;

const p1 = "&#10060;";
const p2 = "&#128309;";

const board_container = document.getElementById("play-area");
const main_menu = document.getElementById("main-menu");
const main_menu_button = document.getElementById("main-menu-btn");
const github_button = document.getElementById("github-link");
const close_menu_button = document.getElementById("close-menu");
const winner_element = document.getElementById("winner");
const reset_button = document.getElementById("reset-btn");


function checkBoardFull (board){
    // Checks if the given board is full, or if the match is over
    match_result = checkMatch(board);
    game_won = match_result != "";

    if (game_won)
        return true;

    for (var i = 0; i < board.length; i++){
        if (board[i] == "")
            return false;
    }

    return true;
};

const updateWinnerText = () => {
    let result = checkMatch(playBoard);
    if (result == p1) {
        winner_element.innerText = "Player 1 won :)";
        winner_element.classList.add("player1Win");
    } else if (result == p2) {
        winner_element.innerText = "Player 2 won :(";
        winner_element.classList.add('player2Win');
    } else if (boardFull) {
        winner_element.innerText = "It's a Draw :/";
        winner_element.classList.add("draw");
    }
};

const checkMatch = (board) => {
    // Checks all columns, rows, and both diagonals for a winner
    // Returns the winning player's symbol (X/O) if a winner exists, empty string otherwise.
    for (i = 0; i < 3; i++ ){
        if ( (board[i*3] == board[i*3+1] && board[i*3] == board[i*3+2]) && (board[i*3] == p1 || board[i*3] == p2)){
            return board[i*3];
        }

        if ( (board[i] == board[i+3] && board[i] == board[i+6]) && (board[i] == p1 || board[i] == p2)){
            return board[i];
        }
    }

    if ( (board[0] == board[4] && board[0] == board[8]) && (board[0] == p1 || board[0] == p2) ){
        return board[0];
    }

    if ( (board[2] == board[4] && board[2] == board[6]) && (board[2] == p1 || board[2] == p2) ){
        return board[2];
    }

    return "";
};

const gameLoop = () => {
    // The main loop of the game. Renders the Tic-Tac-Toe board, then does validation
    // checks to see if the game should go on.
    if (!boardEmpty)
        reset_button.classList.remove('hidden');
    
    renderBoard();
    boardFull = checkBoardFull(playBoard);
    updateWinnerText();
};

const renderBoard = () => {
    board_container.innerHTML = "";
    playBoard.forEach((e, i) => {
        board_container.innerHTML += `<div id="block_${i}" class="block" onClick="addPlayerMove(${i})">${playBoard[i]}</div>`;
        if (e == p1 || e == p2) {
            document.querySelector(`#block_${i}`).classList.add("occupied");
        }
    });
};

const addMoveToBoard = (player, move) => {
    playBoard[move] = player;
    boardEmpty = false;
}

const addPlayerMove = (e) => {
    // Completes a player move.
    // If two players are playing, this will also alternate the current player every move.
    if(!boardFull && playBoard[e] == "") {
        if (currentlyPlayerOne)
            addMoveToBoard(p1, e);
        else
            addMoveToBoard(p2, e);

        gameLoop();

        if (playingComputer){
            addComputerMove();
        }else
            currentlyPlayerOne = !currentlyPlayerOne;
    }
};

const addComputerMove = (random=false) => {
    // Currently just picks a random legal move
    // TODO: Implement Minimax, then Alpha-beta pruning
    if (!boardFull) {
        if (random){
            selected = selectRandomMove(playBoard);
        } else{
            selected = alpha_beta_pruning(playBoard)[0];
            
            //[selected, evaluation, leaves] = alpha_beta_pruning(playBoard);
            //console.log(`Move: ${selected}, Optimal Play Evaluation: ${evaluation}, ${leaves} leaves searched.`)
        }
        addMoveToBoard(p2, selected);

        gameLoop();
    }
};

const resetBoard = () => {
    // Resets all variables to default values.
    // Clears board, sets initial player, and removes any winning text
    // Also rehides reset button (You can only reset if a move has been made)
    playBoard = ["", "", "", "", "", "", "", "", ""];
    boardEmpty = true;
    boardFull = false;
    currentlyPlayerOne = true;
    reset_button.classList.add('hidden');
    winner_element.classList.remove("player1Win");
    winner_element.classList.remove("player2Win");
    winner_element.classList.remove("draw");
    winner_element.innerText = "";

    if (playingComputer && Math.random() > 0.5){
        addComputerMove(random=true);
    }

    gameLoop();
};

const playComputer = (bool) => {
    // Hides main menu and shows reset button, main menu button, the game board, 
    // and winning text
    main_menu.style.display = "none";
    main_menu_button.style.display = "block";
    board_container.style.display = "grid";
    reset_button.style.display = "block";
    winner_element.style.display = "block";
    
    // 'Shows' the new main menu buttons
    close_menu_button.style.display = "block";
    github_button.style.display = "block";

    playingComputer = bool;

    resetBoard();
};

const showMainMenu = () => {
    board_container.style.display = "none";
    main_menu.style.display = "grid";
    main_menu_button.style.display = "none";
    winner_element.style.display = "none";
    reset_button.style.display = "none";
};

const closeMainMenu = () => {
    board_container.style.display = "grid";
    main_menu.style.display = "none";
    main_menu_button.style.display = "block";
    winner_element.style.display = "block";
    reset_button.style.display = "block";
};

const openGithub = () => {
    open("https://github.com/dcl5255/tic-tac-toe");
};

function legalMoves(board) {
    // Returns all legal moves on a given board
    // a legal move is an onoccupied space
    moves = [];

    for (i = 0; i < board.length; i++){
        if (board[i] == ""){
            moves.push(i);
        }
    }

    return moves;
}

function* successors(board, computer_turn){
    // Returns every successive board stemming from the given board
    // and the move that resulted in the new board
    moves = legalMoves(board);

    for (const move of moves) {
        new_board = [...board];
        computer_turn ? new_board[move] = p2 : new_board[move] = p1;
        yield [new_board, move];
    }
}

function selectRandomMove(board) {
    // Find a random legal move and return it
    do {
        selected = Math.floor(Math.random() * 9);
    } while (board[selected] != "");

    return selected;
}

function minimax(board, computer_turn = true, limit=100, move=[], leaves=0) {
    // Uses minimax search algorithm to find the best move, evaluation, and number of checked leaves
    if (limit == 0 || checkBoardFull(board)) {
        leaves = leaves + 1;
        winner = checkMatch(board);
        if (winner == p1){
            evaluation = -1;
        } else if (winner == p2) {
            evaluation = 1;
        } else{
            evaluation = 0;
        }

        return [move, evaluation, leaves];
    }

    if (computer_turn) {
        let best_move = null;
        let max_eval = Number.NEGATIVE_INFINITY;

        const board_successors = successors(board, computer_turn);
        for (let successor of board_successors){
            let new_board = successor[0];
            let new_move = successor[1];

            [junk, current_eval, leaves] =  minimax(new_board, !computer_turn, limit - 1, new_move, leaves);
            if (current_eval > max_eval){
                max_eval = current_eval;
                best_move = new_move;
            }
        }
        return [best_move, max_eval, leaves];

    }else{
        let best_move = null;
        let min_eval = Number.POSITIVE_INFINITY;

        const board_successors = successors(board, computer_turn);
        for (let successor of board_successors){
            let new_board = successor[0];
            let new_move = successor[1];

            [junk, current_eval, leaves] =  minimax(new_board, !computer_turn, limit - 1, new_move, leaves);
            if (current_eval < min_eval){
                min_eval = current_eval;
                best_move = new_move;
            }
        }
        return [best_move, min_eval, leaves];
    }
}

function alpha_beta_pruning(board, computer_turn = true, limit=100, move=[], leaves=0, alpha = Number.NEGATIVE_INFINITY, beta = Number.POSITIVE_INFINITY) {
    // Uses a modified minimax search algorithm to find the best move, evaluation, and number of checked leaves
    // Eliminates branches using alpha-beta pruning
    if (limit == 0 || checkBoardFull(board)) {
        leaves = leaves + 1;
        winner = checkMatch(board);
        if (winner == p1){
            evaluation = -1;
        } else if (winner == p2) {
            evaluation = 1;
        } else{
            evaluation = 0;
        }

        return [move, evaluation, leaves, limit];
    }

    if (computer_turn) {
        let best_move = null;
        let max_eval = Number.NEGATIVE_INFINITY;
        let best_depth = Number.NEGATIVE_INFINITY;

        const board_successors = successors(board, computer_turn);
        for (let successor of board_successors){
            let new_board = successor[0];
            let new_move = successor[1];

            [junk, current_eval, leaves, current_depth] = alpha_beta_pruning(new_board, !computer_turn, limit - 1, new_move, leaves, alpha, beta);
            if (current_eval >= max_eval){
                if(current_eval > max_eval || current_depth > best_depth){
                    max_eval = current_eval;
                    best_move = new_move;
                    best_depth = current_depth;
                }
            }
            if (max_eval >= beta)
                return [best_move, max_eval, leaves, best_depth];
            if (max_eval > alpha)
                alpha = max_eval;
        }
        return [best_move, max_eval, leaves, best_depth];

    }else{
        let best_move = null;
        let min_eval = Number.POSITIVE_INFINITY;
        let best_depth = Number.NEGATIVE_INFINITY;

        const board_successors = successors(board, computer_turn);
        for (let successor of board_successors){
            let new_board = successor[0];
            let new_move = successor[1];

            [junk, current_eval, leaves, current_depth] =  alpha_beta_pruning(new_board, !computer_turn, limit - 1, new_move, leaves, alpha, beta);
            if (current_eval <= min_eval){
                if(current_eval < min_eval || current_depth > best_depth){
                    min_eval = current_eval;
                    best_move = new_move;
                    best_depth = current_depth;
                }
            }
            if (min_eval <= alpha)
                return [best_move, min_eval, leaves, best_depth];
            if (min_eval < beta)
                beta = min_eval;
        }
        return [best_move, min_eval, leaves, best_depth];
    }
}