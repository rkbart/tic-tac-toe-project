let board = document.getElementById("board");

let gameBoard = [
    ['', '', ''], 
    ['', '', ''], 
    ['', '', ''] 
]

let playerTurn1 = true;
let history = [];
let historyIndex = -1; // tracks the current position in the history array
let gameFininshed = false;
let winnerContainer = document.getElementById("winner-container");

function createBoard(){
    board.innerHTML = ""; // clear #board div
    winnerContainer.style.visibility = "hidden";
    winnerContainer.textContent = "";

    for(let i = 0; i < 9; i++){ // loop 9 times
        let tictactoeGrid = document.createElement("div"); // create grid div for cells
        tictactoeGrid.classList.add("tictactoeBox"); //give class name to grid div and CSS
        let gridId = `box${i}`; // declare gridId variable with box[i] as value (cell id)
        tictactoeGrid.setAttribute("id", gridId); // assign id = box[i] for cells inside grid
        board.appendChild(tictactoeGrid); // add grid with cells
        tictactoeGrid.addEventListener("click", () => { //on click, run function addMove
            if (!gameFininshed){
                addMove(gridId, i); // add id to clicked gird, run updateBoard(), saveHistory(), checkWinner() 
            }
        });
    }
}
// handles player's move. updates visual representation of the game board, switch turn, save moves, check if someone has won or draw. 
                // gridId, i
function addMove(element, boxNumber) { // does nothing if cell is occupied
    let specificGrid = document.getElementById(element); // gridId
    if (!specificGrid.textContent) { // checks if the textContent of specificGrid is falsy or empty (no "X" or "O" in that cell).
        specificGrid.textContent = playerTurn1 ? "X" : "O";  // if playerTurn1 is true, set textContent to "X", else "O"
        playerTurn1 = playerTurn1 ? false : true; // toggle between playerTurn 1 true and false
        updateBoard(specificGrid, boxNumber); //calls the updateBoard function, passing in the specificGrid and boxNumber as parameters
        saveHistory();
        checkWinner();
    }
}

// updates the internal representation of the game board based on the player's move. calculates the correct row and column for the box number and sets that position in the gameBoard to reflect the current player's symbol ("X" or "O").
                    // gridId, index 
function updateBoard(element, boxNumber) { // element = gridId/cell where the player just placed "X" or "O" 
// boxNumber = the index of that cell in the game board (ranging from 0 to 8)
    let row = Math.floor(boxNumber / 3); // calculates the row number where the move was made
    let column = boxNumber % 3; // calculates the column number where the move was made
    gameBoard[row][column] = element.innerText; // assigns innerText of element (which is either "X" or "O") to the appropriate position in the gameBoard based on row and column
}

let prev = document.getElementById("prev");
let next = document.getElementById("next");

function showControls(){ // displays previous and next buttons
    prev.style.display = "flex";
    next.style.display = "flex";
    gameFininshed = true; // changes value to true
}

// Check rows, columns, and diagonals for a winner
function checkWinner() {
    for (let i = 0; i < 3; i++) { // loops 3 times (0 1 2)
        // checks if all three cells in the current row (indexed by i) are the same and not empty
        // first gameBoard[i][0] checks if condition is true or truthy, then checks if gameBoard[0][0] is equal to other cells in the same index 
        if (gameBoard[i][0] && gameBoard[i][0] === gameBoard[i][1] && gameBoard[i][0] === gameBoard[i][2]) {
            highlightCells([`box${i * 3}`, `box${i * 3 + 1}`, `box${i * 3 + 2}`]); // Highlight row cells
            displayWinner(gameBoard[i][0]);
            showControls();
            return; 
        }
        // checks if all three cells in the current column (indexed by i) are the same and not empty
        if (gameBoard[0][i] && gameBoard[0][i] === gameBoard[1][i] && gameBoard[0][i] === gameBoard[2][i]) {
            highlightCells([`box${i}`, `box${i + 3}`, `box${i + 6}`]); // Highlight column cells
            displayWinner(gameBoard[0][i]);
            showControls();
            return;
        }
    }

    //  checks the diagonal from the top-left corner to the bottom-right corner and not empty
    if (gameBoard[0][0] && gameBoard[0][0] === gameBoard[1][1] && gameBoard[0][0] === gameBoard[2][2]) {
        highlightCells([`box0`, `box4`, `box8`]); // Highlight diagonal cells
        displayWinner(gameBoard[0][0]);
        showControls();
        return;
    } //diagonal from the top-right corner to the bottom-left corner
    if (gameBoard[0][2] && gameBoard[0][2] === gameBoard[1][1] && gameBoard[0][2] === gameBoard[2][0]) {
        highlightCells([`box2`, `box4`, `box6`]); // Highlight diagonal cells
        displayWinner(gameBoard[0][2]);
        showControls();
        return;
    }

    // Check for a draw
    let allCellsFilled = true;

    for (const box of gameBoard.flat()) { // iterate over all content of flattened gameBoard
        if (!box) { // if variable box is falsey or empty
            allCellsFilled = false; //  make allCellsFilled is false
            break; // stop from running
        };
    };

    if (allCellsFilled) { // if allCellsFilled is true or not empty
        displayWinner("It's a draw! Nobody ");
        showControls();
        };

};

function highlightCells(cells) {
    cells.forEach(gridId => {
        let cell = document.getElementById(gridId); 
        cell.style.backgroundColor = "#5FAD9A"; // Highlight cell directly
        cell.style.color = "#162A25";
        cell.classList.add("pulse-animation"); // Add pulsing effect
    });
}

function saveHistory() { // store the elements from the existing history array up to the specified historyIndex
    const newHistory = [];
    // 0 is less than or equal to -1 = false (do nothing at initial value of historyIndex)
    // 0 is less than or equal to 0 = true then newHistory = history[0]
    for (let i = 0; i <= historyIndex; i++) { // iterate through each index of the history array that needs to be copied
        newHistory.push(history[i]); // current element of history at index i is added (or "pushed") to the newHistory array. This effectively copies all elements from history up to historyIndex
    }
    history = newHistory; // Replace history with the new array (contains only the elements up to historyIndex)
    
    // Create a copy of the gameBoard
    const boardCopy = [];
    //  iterates over each row of the gameBoard array
    for (let i = 0; i < gameBoard.length; i++) {  // loops 3 times every time because gameBoard = [0,1,2]
        boardCopy.push(gameBoard[i].slice()); // each row of gameBoard is copied using slice() and added to the boardCopy array. This creates a new row for each existing row
    }
    
    history.push(boardCopy); // add the new board state to history
    // After creating the copy of the game board, boardCopy is pushed into the history array. This saves the current state of the game board in the history
    historyIndex++; // Increment the history index (prepares the index for the next time a state is saved, indicating that the history has grown by one new entry)
}

// controls
// resets to initial state
document.getElementById("reset").addEventListener("click", () => {
    gameBoard = [['', '', ''], ['', '', ''], ['', '', '']]; 
    playerTurn1 = true; // 
    history = [];
    historyIndex = -1;
    prev.style.display = "none";
    next.style.display = "none";
    gameFininshed = false;
    chooseFirstPlayer();
    createBoard();
});

prev.addEventListener("click", () => { // on click
    if (historyIndex > 0) { // if historyIndex is greater than 0 
        historyIndex--; //  decreases the value of historyIndex by 1
        gameBoard = history[historyIndex];  // updates the gameBoard to reflect the previous state stored in the history array
        renderBoard(); // runs renderBoard(), updating the visual representation of the gameBoard 
    }
});

next.addEventListener("click", () => {
    // -1 is less than 0 = true then history index++ = 0 then gameboard = history[0] (does not move if the length is only 1)
    if (historyIndex < history.length - 1) { // checks if the historyIndex is less than history.length - 1
                                             // verifies whether there are more future states to navigate to
        historyIndex++; // moves one step forward in the history, allowing access to the next game state.
        gameBoard = history[historyIndex]; // updates the gameBoard to reflect the next state stored in the history array
                                           // retrieves the game state at the current (now incremented) historyIndex
        renderBoard(); // runs renderBoard(), updating the visual representation of the gameBoard 
    }
    console.log(`history ${history}`);
});

function renderBoard() { // displays 
    const boxes = document.querySelectorAll(".tictactoeBox"); // select all elements that have the class name "tictactoeBox" 
    
    for (let i = 0; i < boxes.length; i++) { // loops 9 times
        boxes[i].textContent = gameBoard[Math.floor(i / 3)][i % 3]; // display lahat ng content ng gameboard
    }
   
    let filledCount = 0;
    
    // counter ng box na may laman (if true, increment filledCount)
    for (let row = 0; row < gameBoard.length; row++) { // iterates over each row of the gameBoard
        for (let col = 0; col < gameBoard[row].length; col++) { // iterates over each column in the current row of the gameBoard
            if (gameBoard[row][col]) { // checks if the cell at the current position (specified by row and col) in the gameBoard is filled (truthy)
            // If gameBoard[row][col] contains a value (like a string, number, etc.), the condition evaluates to true. If it’s empty or null, it evaluates to false    
                filledCount++; // increments the filledCount variable by 1 each time a filled cell is found.
             }
        }
    }
playerTurn1 = (filledCount % 2 === 0) ? true : false;
    // checks if filledCount is even. If even (true), it assigns true to playerTurn1, indicating that it is player one's turn. If odd, it assigns false, indicating that it’s player two's turn

}

// function to prompt the player to choose who plays first (case insensitive)
// function chooseFirstPlayer() {
//     let firstPlayer = prompt("Who plays first? Enter X or O:");

//     // If Cancel is pressed, firstPlayer will be null
//     if (firstPlayer === null) {
//         alert("You must choose X or O to start the game!");
//         location.reload(); // Refreshes the page
//     } else {
//         firstPlayer = firstPlayer.toUpperCase(); // convert to uppercase pra hindi na case sensitive

//         // Loop until valid input is given
//         while (firstPlayer !== "X" && firstPlayer !== "O") {
//             firstPlayer = prompt("Invalid input. Please enter X or O:").toUpperCase();
//         }
//         playerTurn1 = (firstPlayer === "X") ? true : false; // if firstplayer is X (true), playerTurn 1 = true
//     }

// }

function displayWinner(winner) {
    winnerContainer.style.visibility = "visible";
    let winnerText = document.createElement("span");
    winnerText.setAttribute = ("id","winner-text");
    winnerText.textContent = `Player ${winner} wins!`;
    winnerContainer.appendChild(winnerText);

}

function chooseFirstPlayer() { // creates a modal where user needs to input who plays first
    
    const modal = document.createElement("div");
    modal.id = "customPrompt";
    modal.classList.add("modal");

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    const promptText = document.createElement("p");
    promptText.textContent = "Who plays first? Enter X or O:";

    const inputField = document.createElement("input");
    inputField.id = "firstPlayerInput";
    inputField.type = "text";
    inputField.placeholder = "X or O";
    inputField.autocomplete = "off";

    const confirmButton = document.createElement("button");
    confirmButton.textContent = "Confirm";
    confirmButton.id = "confirmButton";

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.id = "cancelButton";

    // Append the elements to modalContent
    modalContent.appendChild(promptText);
    modalContent.appendChild(inputField);
    modalContent.appendChild(confirmButton);
    modalContent.appendChild(cancelButton);

    // Append modalContent to the modal
    modal.appendChild(modalContent);

    // Append modal to the body
    document.body.appendChild(modal);

        // Handle Confirm button click
    confirmButton.addEventListener("click", function () {
        let firstPlayer = inputField.value.toUpperCase();
        if (firstPlayer === "X" || firstPlayer === "O") {
            playerTurn1 = (firstPlayer === "X") ? true : false;
            modal.style.display = "none"; // Hide modal
        } else {
            alert("Invalid input. Please enter X or O.");
        }
    });

    // Handle Cancel button click
    cancelButton.addEventListener("click", function () {
        alert("You must choose X or O to start the game!");
        location.reload(); // Reload the page
    });
}

chooseFirstPlayer();
createBoard();
