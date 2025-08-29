function createPlayer(name, marker){
    return {name, marker};
}




function main(){
    const gameboard = (function(){
        let board = [1,2,3,4,5,6,7,8,9];

        const boardFormattedAsString = function(){
            return `${board[0]} ${board[1]} ${board[2]}\n${board[3]} ${board[4]} ${board[5]}\n${board[6]} ${board[7]} ${board[8]}`;
        }

        const placeMarker = function(marker, square){
            if(board[spotChoice] === "X" || board[spotChoice] === "O") return false;

            board[spotChoice] = marker;
            return true;
        }

        return {board, placeMarker, boardFormattedAsString};
    })();

    const gameMaster = (function(){
        const checkForWinner = function(board){
            //Checking horizontal and vertical
            for(let i = 0; i < 3; i+=3){
                if(board[i] === board[i+1] && board[i+1] === board[i+2]){
                    return {winningMarker: board[i]};
                }
                if(board[i] === board[i+3] && board[i+3] === board[i+6]){
                    return {winningMarker: board[i]};
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
                if(board[i] !== "X"){
                    if(board[i] !== "O"){
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

    const player1 = createPlayer("Adam", "X");
    const player2 = createPlayer("Ben", "O");

    let currentPlayer = player1;

    function addGridSquareListeners(){
        const gridSquares = document.querySelectorAll(".grid-square");
        gridSquares.forEach((square) => {
            square.addEventListener('click', function(e){
                const success = gameboard.placeMarker(currentPlayer.marker, square);
                if(!success) return;

                
            });
        });
    }
    addGridSquareListeners();

    //Game Loop
    while(true){
        console.log(gameboard.boardFormattedAsString());
        console.log();

        //gameMaster.playRound(currentPlayer, gameboard);

        //const winnerResult = gameMaster.checkForWinner(gameboard.board);

        if(!!winnerResult){
            if(winnerResult === "TIE"){
                console.log(`There has been a tie.`);
                console.log(`Tying Board:`);
                console.log(gameboard.displayBoard());
            } else {
                const winningPlayer = player1.marker === winnerResult.winningMarker ? player1.name : player2.name;
                console.log(`${winningPlayer} wins!`);
                console.log(`Winning Board:`);
                gameboard.displayBoard();
            }

            break;
        } 

        currentPlayer = currentPlayer === player1 ? player2 : player1;
    }
}

