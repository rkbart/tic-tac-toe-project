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

function createBoard(){
    board.innerHTML = ""; // clear #board div
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

function showControls(){
    prev.style.display = "flex";
    next.style.display = "flex";
    gameFininshed = true;
}

// Check rows, columns, and diagonals for a winner
function checkWinner() {
    for (let i = 0; i < 3; i++) { // loops 3 times (0 1 2)
        // checks if all three cells in the current row (indexed by i) are the same and not empty
        // first gameBoard[i][0] checks if condition is true or truthy, then checks if gameBoard[0][0] is equal to other cells in the same index 
        if (gameBoard[i][0] && gameBoard[i][0] === gameBoard[i][1] && gameBoard[i][0] === gameBoard[i][2]) {
            highlightCells([`box${i * 3}`, `box${i * 3 + 1}`, `box${i * 3 + 2}`]); // Highlight row cells
            setTimeout(() => alert(`${gameBoard[i][0]} wins!`), 10);
            showControls();
            return; // exits the function, stopping further checks since a winner has already been found
        }
        // checks if all three cells in the current column (indexed by i) are the same and not empty
        if (gameBoard[0][i] && gameBoard[0][i] === gameBoard[1][i] && gameBoard[0][i] === gameBoard[2][i]) {
            highlightCells([`box${i}`, `box${i + 3}`, `box${i + 6}`]); // Highlight column cells
            setTimeout(() => alert(`${gameBoard[0][i]} wins!`), 10);
            showControls();
            return;
        }
    }

    //  checks the diagonal from the top-left corner to the bottom-right corner and not empty
    if (gameBoard[0][0] && gameBoard[0][0] === gameBoard[1][1] && gameBoard[0][0] === gameBoard[2][2]) {
        highlightCells([`box0`, `box4`, `box8`]); // Highlight diagonal cells
        setTimeout(() => alert(`${gameBoard[0][0]} wins!`), 10);
        showControls();
        return;
    } //diagonal from the top-right corner to the bottom-left corner
    if (gameBoard[0][2] && gameBoard[0][2] === gameBoard[1][1] && gameBoard[0][2] === gameBoard[2][0]) {
        highlightCells([`box2`, `box4`, `box6`]); // Highlight diagonal cells
        setTimeout(() => alert(`${gameBoard[0][2]} wins!`), 10);
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
        setTimeout(() => alert("It's a draw!"), 10);
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

function saveHistory() {
    // Create a new history array up to historyIndex
    const newHistory = [];
    // store the elements from the existing history array up to the specified historyIndex
    //           0 is less than or equal to -1 = false (do nothing)
        //       0 is less than or equal to 0 = true then newHistory = history[0]
    for (let i = 0; i <= historyIndex; i++) { // iterate through each index of the history array that needs to be copied
        newHistory.push(history[i]); // current element of history at index i is added (or "pushed") to the newHistory array. This effectively copies all elements from history up to historyIndex
        console.log("i = " + i);
        console.log("new history" + newHistory);
    }
    history = newHistory; // Replace history with the new array (contains only the elements up to historyIndex)
    console.log("history" + history);

    // Create a copy of the gameBoard
    const boardCopy = [];
    //  iterates over each row of the gameBoard array
    for (let i = 0; i < gameBoard.length; i++) {  // loops 3 times every time because gameBoard = [0,1,2]
        boardCopy.push(gameBoard[i].slice()); // each row of gameBoard is copied using slice() and added to the boardCopy array. This creates a new row for each existing row
        console.log("boardCopy i = " + i);
        console.log("board copy" + boardCopy);
    }
    
    history.push(boardCopy); // add the new board state to history
    // After creating the copy of the game board, boardCopy is pushed into the history array. This saves the current state of the game board in the history
    console.log("history" + history);
    historyIndex++; // Increment the history index (prepares the index for the next time a state is saved, indicating that the history has grown by one new entry)
    console.log("history index = " + historyIndex);

}

// controls
// resets to initial state
document.getElementById("reset").addEventListener("click", () => {
    gameBoard = [['', '', ''], ['', '', ''], ['', '', '']]; 
    playerTurn1 = true; // 
    // chooseFirstPlayer(); // Ask player who goes first
    history = [];
    historyIndex = -1;
    prev.style.display = "none";
    next.style.display = "none";
    gameFininshed = false;
    chooseFirstPlayer();
    createBoard();
});
// previous button
document.getElementById("prev").addEventListener("click", () => { // on click
    if (historyIndex > 0) { // if historyIndex is greater than 0 
        historyIndex--; //  decreases the value of historyIndex by 1
        gameBoard = history[historyIndex];  // updates the gameBoard to reflect the previous state stored in the history array
        renderBoard(); // runs renderBoard(), updating the visual representation of the gameBoard 
    }
});
// next button
document.getElementById("next").addEventListener("click", () => {
    console.log(`history length ${history.length}`);
    console.log(`historyIndex ${historyIndex}`);
            // -1 is less than 0 = true then history index++ = 0 then gameboard = history[0]
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
        // console.log(`boxes[index].textContent = ${boxes[index].textContent}`);
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
    // playerTurn1 = filledCount % 2 === 0; //  checks if filledCount is even. If even (true), it assigns true to playerTurn1, indicating that it is player one's turn. If odd, it assigns false, indicating that it’s player two's turn

}

// Function to prompt the player to choose who plays first (case insensitive)
function chooseFirstPlayer() {
    let firstPlayer = prompt("Who plays first? Enter X or O:").toUpperCase(); // Convert input to uppercase
    while (firstPlayer !== "X" && firstPlayer !== "O") {
        firstPlayer = prompt("Invalid input. Please enter X or O:").toUpperCase(); // Convert input to uppercase
    }
    playerTurn1 = firstPlayer === "X"; // Set playerTurn1 based on the choice
}

chooseFirstPlayer();
createBoard();
