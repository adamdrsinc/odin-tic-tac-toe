function createPlayer(name, marker){
    return {name, marker};
}

function run(){
    const player1 = createPlayer("Adam", "X");
    const player2 = createPlayer("Ben", "O");

    const gameboard = (function(){
        let board = Array(9).fill("");

        return {board};
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

            return null;
        }

        const playRound = function(board){
            
        }

        return {checkForWinner};
    })();

    while(true){
        gameMaster.playRound(gameboard.board);

        const winnerResult = gameMaster.checkForWinner(gameboard.board);

        if(!!winnerResult){
            const winningPlayer = player1.marker === winnerResult.winningMarker ? player1.name : player2.name;
            console.log(`${winningPlayer} wins!`);
            break;
        } 
    }
}

run();