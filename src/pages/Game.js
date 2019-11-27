import React, { Component } from 'react';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Chessboard from 'chessboardjsx';
import Chess from 'chess.js';
import * as mutations from '../graphql/mutations';
import * as queries from '../graphql/queries';
import * as subscriptions from '../graphql/subscriptions';
import * as Games from '../Constants/GameComponentConstants';
import * as Colors from '../Constants/Colors';
import '../variant-style.css';
import './Game.css';
import Clock from '../components/Clock';
import GameData from '../GameData';

const YOUR_TURN_MESSAGE = 'It\'s your turn!';

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fen: '',
      time: '',
      squareStyles: {},
      yourTurn: false,
      history: [],
      gameOver: false,
      gameResult: '',
      winner: '',
      reverseHistory: [],
    };
    this.game = null;
    this.opponent = null; // the opponent. null if user created or joined game anonymously
    this.gameId = null;
    this.orientation = '';
    this.gameUpdateSubscription = null;
    this.moveFrom = null;
    this.gameInfo = null;
    this.boardId = '';
  }

  async componentDidMount() {
    const gameId = this.props.match.params.id;
    const queryResult = await API.graphql(graphqlOperation(queries.getGame, { id: gameId }));
    this.gameInfo = queryResult.data.getGame;
    if (this.gameInfo.history) {
      console.log('getting history from db', this.gameInfo);
      this.setState({
        history: [...this.gameInfo.history],
        gameOver: !!this.gameInfo.result,
        gameResult: this.gameInfo.result,
        winner: this.gameInfo.winner,
      });
    }
    // let currentGame = localStorage.getItem('currentGame');
    // if (currentGame && currentGame === this.gameId) {
    const user = await this.getUserInfo();
    const userId = typeof (user) === 'object' ? user.attributes.sub : user;
    if (this.gameInfo.creator.id === userId) {
      this.orientation = this.gameInfo.creatorOrientation;
      this.opponent = this.gameInfo.opponent;
    } else if (this.gameInfo.opponent.id === userId) {
      this.orientation = this.gameInfo.creatorOrientation === 'white' ? 'black' : 'white';
      this.opponent = this.gameInfo.creator;
    }
    console.log(this.orientation, userId, this.gameInfo.opponent.id, this.gameInfo.creator.id);
    let initialFen = '';
    let yourTurn = this.orientation === 'white';
    this.gameId = this.gameInfo.id;
    const { variant } = this.gameInfo;
    switch (variant) {
    case Games.ANTICHESS:
      this.game = new Chess(Games.STANDARD_FEN, 1);
      initialFen = Games.STANDARD_FEN;
      break;
    case Games.GRID_CHESS:
      this.game = new Chess(Games.STANDARD_FEN, 2);
      initialFen = Games.STANDARD_FEN;
      this.boardId = 'grid-board';
      break;
    case Games.EXTINCTION_CHESS:
      this.game = new Chess(Games.STANDARD_FEN, 3);
      initialFen = Games.STANDARD_FEN;
      break;
    case Games.STANDARD_CHESS:
      this.game = new Chess();
      initialFen = Games.STANDARD_FEN;
      break;
    default:
      this.game = new Chess();
      initialFen = Games.STANDARD_FEN;
    }
    if (this.gameInfo.result) {
      // if a game was ended, play all the moves to the end
      this.gameInfo.history.forEach((move) => {
        this.game.move(move);
      });
      this.setState({
        fen: this.game.fen(),
      });
      return;
    }
    if (this.gameInfo.fen !== 'init') {
      initialFen = this.gameInfo.fen;
      this.game.load(initialFen);
      yourTurn = this.game.turn() === this.orientation[0];
    }
    this.setState({ fen: initialFen, yourTurn });
    this.gameUpdateSubscription = API.graphql(graphqlOperation(
      subscriptions.onUpdateGameState, { id: gameId },
    )).subscribe({
      next: (gameData) => {
        const gameState = gameData.value.data.onUpdateGameState;
        if (this.gameInfo.id === gameState.id) {
          this.game.load(gameState.fen);
          const yourTurn = this.game.turn() === this.orientation[0];
          this.setState({
            fen: gameState.fen,
            yourTurn,
            history: gameState.history,
            gameResult: gameState.result,
            gameOver: !!gameState.gameResult,
            winner: gameState.winner,
          });
        }
      },
    });
  }

  getUserInfo = async () => {
    let userInfo;
    await Auth.currentAuthenticatedUser().then((user) => {
      userInfo = { ...user };
    }).catch(async (e) => {
      await Auth.currentCredentials().then((credential) => {
        userInfo = credential.identityId.split(':')[1];
      });
    });
    return userInfo;
  }

  onSquareClick = async (square) => {
    if (this.state.gameOver || this.game.turn() !== this.orientation[0]) return;
    const piece = this.game.get(square);
    if (this.moveFrom !== null) {
      const move = this.game.move({ from: this.moveFrom, to: square });
      if (move !== null) {
        const updateGameData = {};
        updateGameData.id = this.gameId;
        updateGameData.fen = this.game.fen();
        updateGameData.history = [...this.state.history, move.san];
        this.setState({
          fen: this.game.fen(),
          squareStyles: {},
          yourTurn: false,
          history: [...this.state.history, move.san],
        });
        // end the game if necessary
        const result = this.updateGameResult();
        if (result) {
          updateGameData.result = result;
          updateGameData.winner = this.game.turn();
          console.log('game end', this.game.turn(), result);
        }
        const updated = await API.graphql(graphqlOperation(
          mutations.updateGameState, { input: updateGameData },
        ));
        console.log('moved', updated, move.san, this.state.history, updateGameData);
        this.moveFrom = null;
        return;
      }
    }
    const newSquareStyles = {};
    if (piece !== null && piece.color === this.orientation[0]) {
      this.moveFrom = square;
      const validMoves = this.game.moves({ square, verbose: true });
      newSquareStyles[square] = { backgroundColor: Colors.BOARD_HIGHLIGHT_COLOR };
      validMoves.forEach((move) => {
        newSquareStyles[move.to] = {
          background: `radial-gradient(circle, ${Colors.BOARD_HIGHLIGHT_COLOR} 18%, transparent 15%)`,
          borderRadius: '50%',
        };
      });
    }
    this.setState({ squareStyles: newSquareStyles });
  }

  updateGameResult = () => {
    if (this.game.game_over() || this.state.history.length >= 50) {
      let result = 'fifty'; // fifty move rule
      if (this.game.in_checkmate()) {
        result = 'checkmate';
      } else if (this.gameInfo.variant === Games.EXTINCTION_CHESS && this.game.extinguished()) {
        result = 'extinction';
      } else if (this.game.in_stalemate()) {
        result = 'stalemate';
      } else if (this.game.insufficient_material()) {
        result = 'insufficient';
      } else if (this.game.in_threefold_repetition()) {
        result = 'repetition';
      }
      this.setState({
        gameOver: true,
        gameResult: result,
      });
      return result;
    }
    /* (we will pass the value of this.state.gameResult to GameData) */
  }

  prevMove = () => {
    if (this.game.history().length > 0) {
      const reverseHistory = [...this.state.reverseHistory, this.game.history().pop()];
      this.game.undo();
      this.setState({
        fen: this.game.fen(),
        reverseHistory,
      }, () => console.log(this.game.fen(), this.state.fen));
      console.log(this.game.history(), this.state.reverseHistory);
    }
  }

  nextMove = () => {
    const reverseHistory = [...this.state.reverseHistory];
    if (reverseHistory.length > 0) {
      const move = reverseHistory.pop();
      const newMove = this.game.move(move);
      this.setState({
        fen: this.game.fen(),
        reverseHistory,
      }, () => console.log(this.game.fen(), this.state.fen));
      console.log(move, newMove.san, this.game.history(), reverseHistory);
    }
  }

  render() {
    const { state } = this;
    return (
      <Grid container spacing={1}>
        <Grid container item md={4}>
          <GameData
            history={state.history}
            fen={state.fen}
            gameResult={state.gameResult}
            winner={state.winner}
            prevMove={this.prevMove}
            nextMove={this.nextMove}
            currentMove={state.history.length - state.reverseHistory.length}
          />
        </Grid>
        <Grid container item md={4}>
          <Box display="flex" flexDirection="column">
            <Paper style={{ border: '1px solid #D3D3D3', marginBottom: '2px' }}>
              <Typography style={{ fontFamily: 'AppleSDGothicNeo-Bold', color: Colors.CHARCOAL, marginLeft: '5px' }} variant="h5" component="h5">
                You vs
                {' '}
                {this.opponent !== null ? this.opponent.username : 'Anonymous'}
              </Typography>
              <Typography style={{ fontFamily: 'AppleSDGothicNeo-Bold', color: Colors.CHARCOAL, marginLeft: '5px' }} variant="h6" component="h6">
                Variant:
                {' '}
                {this.gameInfo !== null ? this.gameInfo.variant : ''}
              </Typography>
              <Typography style={{ fontFamily: 'AppleSDGothicNeo-Bold', color: '#008000', marginLeft: '5px' }} component="p">
                {state.yourTurn === true ? YOUR_TURN_MESSAGE : ''}
              </Typography>
            </Paper>
            <div id={this.boardId}>
              <Chessboard
                position={state.fen}
                lightSquareStyle={{ backgroundColor: Colors.LIGHT_SQUARE }}
                darkSquareStyle={{ backgroundColor: Colors.DARK_SQUARE }}
                orientation={this.orientation}
                squareStyles={state.squareStyles}
                onSquareClick={this.onSquareClick}
              />
            </div>
            <Clock />
          </Box>
        </Grid>
        <Grid container item md={4}>
          {/* // for chat box */}
        </Grid>
      </Grid>
    );
  }
}

export default Game;
