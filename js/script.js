function main(){
    const xMarker = "X";
    const oMarker = "O";

    function playerPrototype(playerName){
        let name = playerName;
        const getName = () => name;

        const changeName = (newName) => {
            name = newName;
        }

        return {getName, changeName};
    }

    function createPlayer(playerName, playerMarker){
        const {getName, changeName} = playerPrototype(playerName);
        const marker = playerMarker;
        const getMarker = () => marker;

        return {getName, getMarker, changeName};
    } 

    const gameboard = (function(){
        let board = [1,2,3,4,5,6,7,8,9];

        const boardFormattedAsString = function(){
            return `${board[0]} ${board[1]} ${board[2]}\n${board[3]} ${board[4]} ${board[5]}\n${board[6]} ${board[7]} ${board[8]}`;
        }

        const placeMarker = function(marker, square){
            const squareIndex = square.getAttribute("square-id");
            if(board[squareIndex] === xMarker || board[squareIndex] === oMarker) return false;

            board[squareIndex] = marker;
            if(marker === xMarker){
                square.innerHTML = `<div class="marker x"></div>`
            } else {
                square.innerHTML = `<div class="marker o"></div>`;
            }

            return true;
        }

        return {board, placeMarker, boardFormattedAsString};
    })();

    const gameMaster = (function(){
        const checkForWinner = function(board){
            //Checking horizontal and vertical
            for(let i = 0; i < 3; i+=3){
                if(board[i] === board[i+1] && board[i+1] === board[i+2]){
                    return board[i];
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

        const playRound = function(player, board){
            function askPlayerForMarkerPlacement(player){
                let input = -1;
                while(isNaN(input) || input < 1 || input > 9){
                    input = parseInt(prompt(`${player.name}'s turn`));
                }

                return input;
            }

            let playerInput = askPlayerForMarkerPlacement(player) - 1;
            let markerPlacementResult = board.placeMarker(player.getMarker(), playerInput);
            while(!markerPlacementResult){
                playerInput = askPlayerForMarkerPlacement(player) - 1;
                markerPlacementResult = board.placeMarker(player.getMarker(), playerInput);
            }
        }

        return {playRound, checkForWinner};
    })();

    const player1 = createPlayer("Player 1", xMarker);
    const player2 = createPlayer("Player 2", oMarker);

    let currentPlayer = player1;

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
        const success = gameboard.placeMarker(currentPlayer.getMarker(), square);
        if(!success) return;

        const winnerResult = gameMaster.checkForWinner(gameboard.board);
        console.log(winnerResult);

        if(!!winnerResult){
            if(winnerResult === "TIE"){
                initiateTie();
            } else {
                const winningPlayer = winnerResult === xMarker ? player1 : player2;
                initiateWin(winningPlayer.getName());
            }
        }

        console.log(gameboard.boardFormattedAsString());

        currentPlayer = currentPlayer === player1 ? player2 : player1;
        square.removeEventListener('click', squareEvent)
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

            player1.changeName(player1Name);
            player2.changeName(player2Name);

            const label1 = document.getElementById("player-1-label");
            const label2 = document.getElementById("player-2-label");

            label1.innerHTML = `${player1.getName()}`;
            label2.innerHTML = `${player2.getName()}`;
        })
    }

    addGridSquareListeners();
    addFormListener();
}

main();