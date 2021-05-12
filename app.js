let play_board = ["", "", "", "", "", "", "", "", ""];
let board_empty = true;
let board_full = false;
let playing_computer = true;
let currently_player_one = true;

const p1 = "X";
const p2 = "O";

const board_container = document.getElementById("play-area");
const main_menu = document.getElementById("main-menu");
const main_menu_button = document.getElementById("main-menu-btn");
const github_button = document.getElementById("github-link");
const close_menu_button = document.getElementById("close-menu");
const winner_element = document.getElementById("winner");
const reset_button = document.getElementById("reset-btn");

const check_board_full = () => {
    // Updates the board_full variable if no legal moves are left on the board
    let flag = true;
    play_board.forEach(element => {
        if (element != p1 && element != p2) {
            flag = false;
        }
    });
    board_full = flag;
};

const check_for_winner = () => {
    let result = check_match();
    if (result == p1) {
        winner_element.innerText = "Player 1 won :)";
        winner_element.classList.add("player1Win");
        board_full = true;
    } else if (result == p2) {
        winner_element.innerText = "Player 2 won :(";
        winner_element.classList.add('player2Win');
        board_full = true;
    } else if (board_full) {
        winner_element.innerText = "It's a Draw :/";
        winner_element.classList.add("draw");
    }
};

const check_match = () => {
    // Checks all columns, rows, and both diagonals for a winner
    // Returns the winning player's symbol (X/O) if a winner exists, empty string otherwise.
    for (i = 0; i < 3; i++ ){
        if ( (play_board[i*3] == play_board[i*3+1] && play_board[i*3] == play_board[i*3+2]) && (play_board[i*3] == p1 || play_board[i*3] == p2)){
            return play_board[i*3];
        }

        if ( (play_board[i] == play_board[i+3] && play_board[i] == play_board[i+6]) && (play_board[i] == p1 || play_board[i] == p2)){
            return play_board[i];
        }
    }

    if ( (play_board[0] == play_board[4] && play_board[0] == play_board[8]) && (play_board[0] == p1 || play_board[0] == p2) ){
        return play_board[0];
    }

    if ( (play_board[2] == play_board[4] && play_board[2] == play_board[6]) && (play_board[2] == p1 || play_board[2] == p2) ){
        return play_board[2];
    }

    return "";
}

const game_loop = () => {
    // The main loop of the game. Renders the Tic-Tac-Toe board, then does validation
    // checks to see if the game should go on.
    if (!board_empty)
        reset_button.classList.remove('hidden');
    
    render_board();
    check_board_full();
    check_for_winner();
}

const render_board = () => {
    board_container.innerHTML = "";
    play_board.forEach((e, i) => {
        board_container.innerHTML += `<div id="block_${i}" class="block" onClick="addPlayerMove(${i})">${play_board[i]}</div>`;
        if (e == p1 || e == p2) {
            document.querySelector(`#block_${i}`).classList.add("occupied");
        }
    });
};

const addPlayerMove = e => {
    // Completes a player move.
    // If two players are playing, this will also alternate the current player every move.
    if(!board_full && play_board[e] == "") {
        if (currently_player_one)
            play_board[e] = p1;
        else
            play_board[e] = p2;
        
        board_empty = false;

        game_loop();

        if (playing_computer)
            addComputerMove();
        else
            currently_player_one = !currently_player_one;
    }
}

const addComputerMove = () => {
    // Currently just picks a random legal move
    // TODO: Implement Minimax, then Alpha-beta pruning
    if (!board_full) {
        do {
            selected = Math.floor(Math.random() * 9);
        } while (play_board[selected] != "");
        play_board[selected] = p2;
        board_empty = false;
        game_loop();
    }
}

const reset_board = () => {
    // Resets all variables to default values.
    // Clears board, sets initial player, and removes any winning text
    // Also rehides reset button (You can only reset if a move has been made)
    play_board = ["", "", "", "", "", "", "", "", ""];
    board_full = false;
    board_empty = true;
    currently_player_one = true;
    reset_button.classList.add('hidden');
    winner_element.classList.remove("player1Win");
    winner_element.classList.remove("player2Win");
    winner_element.classList.remove("draw");
    winner_element.innerText = "";
    game_loop();
}

const play_computer = (bool) => {
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

    playing_computer = bool;
    reset_board();
}

const show_main_menu = () => {
    board_container.style.display = "none";
    main_menu.style.display = "grid";
    main_menu_button.style.display = "none";
    winner_element.style.display = "none";
    reset_button.style.display = "none";
}

const close_main_menu = () => {
    board_container.style.display = "grid";
    main_menu.style.display = "none";
    main_menu_button.style.display = "block";
    winner_element.style.display = "block";
    reset_button.style.display = "block";
}

const open_github = () => {
    open("https://github.com/dcl5255");
}