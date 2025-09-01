function main(){
    const xMarker = "X";
    const oMarker = "O";

    class Player{
        #name;
        #marker;

        constructor(name, marker){
            this.#name = name;
            this.#marker = marker;
        }

        get name() {return this.#name};
        set name(name){this.#name = name};
        get marker(){return this.#marker};
        set marker(marker){this.#marker = marker};
    }

    const player1 = new Player("Player 1", xMarker);
    const player2 = new Player("Player 2", oMarker);

    let currentPlayer = player1;

    const gameboard = (function(){
        let board = [1,2,3,4,5,6,7,8,9];

        const boardFormattedAsString = function(){
            return `${board[0]} ${board[1]} ${board[2]}\n${board[3]} ${board[4]} ${board[5]}\n${board[6]} ${board[7]} ${board[8]}`;
        }

        const placeMarker = function(marker, square){
            const squareIndex = square.getAttribute("square-id");
            if(board[squareIndex] === xMarker || board[squareIndex] === oMarker) return false;

            board[squareIndex] = String(marker);
            if(marker === xMarker){
                square.innerHTML = `<div class="marker x"></div>`
            } else {
                square.innerHTML = `<div class="marker o"></div>`;
            }

            return true;
        }

        const getBoard = () => board;

        const reset = function(){
            board = [1,2,3,4,5,6,7,8,9];
        }

        return {getBoard, placeMarker, boardFormattedAsString, reset};
    })();

    const gameMaster = (function(){
        const checkForWinner = function(board){
            console.log(board);

            //Checking horizontal and vertical
            for(let i = 0; i < 3; i++){
                if(board[i*3] === board[i*3+1] && board[i*3+1] === board[i*3+2]){
                    return board[i*3];
                }
            }

            for(let i = 0; i < 3; i++){
                if(board[i] === board[i+3] && board[i+3] === board[i+6]){
                    return board[i];
                }
            }

            //Checking diagonals
            if(board[0] === board[4] && board[4] === board[8]){
                return {winningMarker: board[0]};
            }
            if(board[2] === board[4] && board[4] === board[6]){
                return {winningMarker: board[2]};
            }

            //Check for tie
            let isTie = true;
            for(let i = 0; i < 9; i++){
                if(board[i] !== xMarker){
                    if(board[i] !== oMarker){
                        isTie = false;
                    }
                }
            }

            if(isTie){
                return "TIE";
            }

            return null;
        }

        return {checkForWinner};
    })();

    const pageMaster = (function(){
        const reset = () => {
            const squares = document.querySelectorAll(".grid-square");
            squares.forEach(square => {
                square.innerHTML = ``;
                square.classList.remove("no-hover");
            });

            const overlay = document.getElementById("overlay");
            overlay.classList.remove("make-visible");

            const label1 = document.getElementById("player-1-label");
            const label2 = document.getElementById("player-2-label");
            label1.innerHTML = "Player 1";
            label2.innerHTML = "Player 2";

            resetGridSquareListeners();
        };

        return {reset};
    })();


    function toggleOverlay(bool){
        const overlay = document.getElementById("overlay");
        overlay.classList.add("make-visible");
    }

    function initiateTie(){
        const overlayText = document.getElementById("overlay-text");
        overlayText.innerHTML = `TIE`;

        toggleOverlay(true);
    }

    function initiateWin(playerName){
        const overlayText = document.getElementById("overlay-text");
        overlayText.innerHTML = `${playerName} wins!`;

        toggleOverlay(true);
    }

    function squareEvent(e){
        const square = e.target;
        const success = gameboard.placeMarker(currentPlayer.marker, square);
        if(!success) return;

        const winnerResult = gameMaster.checkForWinner(gameboard.getBoard());
        console.log(winnerResult);

        if(!!winnerResult){
            if(winnerResult === "TIE"){
                initiateTie();
            } else {
                const winningPlayer = winnerResult === xMarker ? player1 : player2;
                initiateWin(winningPlayer.name);
            }
        }

        console.log(gameboard.boardFormattedAsString());

        currentPlayer = currentPlayer === player1 ? player2 : player1;
        square.removeEventListener('click', squareEvent);
        square.classList.add("no-hover");
    }
    
    function addGridSquareListeners(){
        const gridSquares = document.querySelectorAll(".grid-square");
        gridSquares.forEach((square, index) => {
            square.setAttribute('square-id', index);
            square.addEventListener('click', squareEvent);
        });
    }

    function addFormListener(){
        const form = document.getElementById("name-input-form");
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);

            const player1Name = formData.get("player1Name");
            const player2Name = formData.get("player2Name");

            player1.name = player1Name;
            player2.name = player2Name;

            const label1 = document.getElementById("player-1-label");
            const label2 = document.getElementById("player-2-label");

            label1.innerHTML = `${player1.name}`;
            label2.innerHTML = `${player2.name}`;
        })
    }

    function addResetListener(){
        const resetButton = document.getElementById("reset-button");
        resetButton.addEventListener('click', () => {
            gameboard.reset();
            pageMaster.reset();
        });
    }

    function resetGridSquareListeners(){
        const squares = document.querySelectorAll(".grid-square");
        squares.forEach(square => {
            square.removeEventListener('click', squareEvent);
            square.addEventListener('click', squareEvent);
        });
    }

    addGridSquareListeners();
    addFormListener();
    addResetListener();
}

main();