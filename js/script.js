function main(){
    const xMarker = "X";
    const oMarker = "O";

    function createPlayer(name, marker){
        return {name, marker};
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
            let markerPlacementResult = board.placeMarker(player.marker, playerInput);
            while(!markerPlacementResult){
                playerInput = askPlayerForMarkerPlacement(player) - 1;
                markerPlacementResult = board.placeMarker(player.marker, playerInput);
            }
        }

        return {playRound, checkForWinner};
    })();

    const player1 = createPlayer("Adam", xMarker);
    const player2 = createPlayer("Ben", oMarker);

    let currentPlayer = player1;

    function squareEvent(e){
        const square = e.target;
        const success = gameboard.placeMarker(currentPlayer.marker, square);
        if(!success) return;

        const winnerResult = gameMaster.checkForWinner(gameboard.board);

        if(!!winnerResult){
            if(winnerResult === "TIE"){
                console.log(`There has been a tie.`);
                console.log(`Tying Board:`);
            } else {
                console.log(`${currentPlayer.name} wins!`);
                console.log(`Winning Board:`);
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

    addGridSquareListeners();
}

main();