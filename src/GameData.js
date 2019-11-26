import React from 'react';

function GameData({ turn, gameResult, fen, pgn, history, prevMove, nextMove}) {
  let game_state = `${turn === 'w' ? 'White' : 'Black'}'s turn`;
  if (gameResult === 'checkmate') {
    game_state = `${turn === 'w' ? 'Black' : 'White'} wins (checkmate)`;
  }
  else if (gameResult === 'extinction') {
    game_state = `${turn === 'w' ? 'Black' : 'White'} wins (extinction)`;
  }
  else if (gameResult === 'repetition') {
    game_state = 'Draw (three-fold repetition)';
  }
  else if (gameResult === 'stalemate') {
    game_state = `Draw (stalemate)`;
  }
  else if (gameResult === 'insufficient') {
    game_state = `Draw (insufficient material)`;
  }
  else if (gameResult === 'fifty') {
    game_state = `Draw (fifty-move rule)`;
  }
  const mystyle = {
    fontSize: "2em"
  };
  const moves = history.map((move, index) => {
    return (
      <span>
        {index % 2 === 0 ? <span>{index/2 + 1}. </span> : ''}
				<span>{move} </span>
      </span>
    );
  });
  return (
    <div className="game-data">
      <div>FEN: {fen}</div>
      <div>PGN: {pgn}</div>
      <div style={mystyle}>STATE: {game_state}</div>
      <div className="moves">{moves}</div>
      <div>
        <button onClick={prevMove}> prev </button>
        <button onClick={nextMove}> next </button>
      </div>
    </div>
  );
}

export default GameData;
