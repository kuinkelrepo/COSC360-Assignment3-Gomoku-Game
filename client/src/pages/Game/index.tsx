import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Unauthorized from '../../components/Unautorized';
import './style.css';
import { axiosInstance } from '../../services/axios';

export enum StoneColor {
  None,
  Black,
  White,
}

const Game: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const currentGameId = localStorage.getItem('currentGameId');

  const boardSize: number = Number(localStorage.getItem('boardSize')) || 15;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [board, setBoard] = useState<StoneColor[][]>(Array.from({ length: boardSize }, () => Array(boardSize).fill(StoneColor.None)));
  const [currentPlayer, setCurrentPlayer] = useState<StoneColor>(StoneColor.Black);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const tileSizeRef = useRef<number>(0);

  const drawBoard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    tileSizeRef.current = canvas.width / boardSize;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        const stone = board[row][col];
        ctx.beginPath();
        ctx.rect(col * tileSizeRef.current, row * tileSizeRef.current, tileSizeRef.current, tileSizeRef.current);
        ctx.strokeStyle = '#000';
        ctx.stroke();
        if (stone !== StoneColor.None) {
          ctx.beginPath();
          ctx.arc(
            col * tileSizeRef.current + tileSizeRef.current / 2,
            row * tileSizeRef.current + tileSizeRef.current / 2,
            tileSizeRef.current / 2.5,
            0,
            2 * Math.PI
          );
          ctx.fillStyle = stone === StoneColor.Black ? '#000' : '#fff';
          ctx.fill();
        }
      }
    }
  }, [board, boardSize]);

  const handleCanvasClick = async (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameOver) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const col = Math.floor((event.clientX - rect.left) / tileSizeRef.current);
    const row = Math.floor((event.clientY - rect.top) / tileSizeRef.current);


    if (board[row][col] === StoneColor.None) {
      const newBoard = [...board];
      newBoard[row][col] = currentPlayer;

      setBoard(newBoard);

      // Update the moves state with the new move
      setIsLoading(true);
      try {
        const response = await axiosInstance.put(`/games/${currentGameId}`, {
          moves: { row, col, player: currentPlayer },
        });

        // Handle the response from the server, e.g., check for a winner or draw.
        const updatedGame = response.data?.data;
        // 
        if (updatedGame.result === 'Black' || updatedGame.result === 'White') {
          setGameOver(true);
          updateWinStatus(currentPlayer);
        } else if (updatedGame.result === 'Draw') {
          setGameOver(true);
          updateDrawStatus();
        } else {
          setCurrentPlayer(prevPlayer =>
            prevPlayer === StoneColor.Black ? StoneColor.White : StoneColor.Black
          );
          updateTurnStatus();
        }
      } catch (error) {
        console.error('Error updating game:', error);
      }
      setIsLoading(false);
    }
  };

  const updateTurnStatus = useCallback(() => {
    const turnStatusElement = document.getElementById('turnStatus');
    if (turnStatusElement) {
      turnStatusElement.textContent = currentPlayer === StoneColor.Black ? 'Black' : 'White';
    }
  }, [currentPlayer]);

  const updateWinStatus = (winner: StoneColor) => {
    const winStatusElement = document.getElementById('winStatus');
    if (winStatusElement) {
      winStatusElement.textContent = `${winner === StoneColor.Black ? 'Black' : 'White'} wins!`;
      const winContainer = document.getElementById('winContainer');
      if (winContainer) {
        winContainer.style.display = 'flex';
      }
    }
  };

  const updateDrawStatus = () => {
    const drawStatusElement = document.getElementById('drawStatus');
    if (drawStatusElement) {
      drawStatusElement.textContent = "It's a draw!";
      const winContainer = document.getElementById('winContainer');
      if (winContainer) {
        winContainer.style.display = 'flex';
      }
    }
  };

  const resetGame = async () => {
    try {
      const response = await axiosInstance.put(`/games/reset/${currentGameId}`);
      if (response.status === 201) {
        setBoard(Array.from({ length: boardSize }, () => Array(boardSize).fill(StoneColor.None)));
        setCurrentPlayer(StoneColor.Black);
        setGameOver(false);
        drawBoard();
        updateTurnStatus();
        updateClearStatus();
      }
    } catch (error) {
      console.error('Error reseting game:', error);
    }
  };

  const leaveGame = () => {
    navigate('/game-history');
  };

  const updateClearStatus = () => {
    const winContainer = document.getElementById('winContainer');
    if (winContainer) {
      winContainer.style.display = 'none';
    }
    const winStatusElement = document.getElementById('winStatus');
    const drawStatusElement = document.getElementById('drawStatus');
    if (winStatusElement) {
      winStatusElement.textContent = '';
    }
    if (drawStatusElement) {
      drawStatusElement.textContent = '';
    }
  };

  useEffect(() => {
    drawBoard();
    updateTurnStatus();
  }, [drawBoard, updateTurnStatus]);

  if (!token) {
    return (<Unauthorized />)
  }

  return (
    <div className="game-container">
      <div id="container">
        <div id="activePlayer">
          <div>Turn: </div>
          <div id="turnStatus"></div>
        </div>
        <canvas
          ref={canvasRef}
          width={450}
          height={450}
          style={{ border: '1px solid #000' }}
          onClick={!isLoading ? handleCanvasClick : undefined}
        />
        <div id="actions">

          <button className='btn btn-lg' onClick={resetGame}>Restart</button>
          <button className='btn btn-lg' onClick={leaveGame}>Leave</button>
        </div>
        <div className={isLoading ? 'isLoading' : 'd-none'}>
          <h5>Loading...</h5>
        </div>
        <div id="winContainer">
          <div id="winStatus"></div>
          <div id="drawStatus"></div>
          <p>Click on "Restart" to play again.</p>
          <p>Click on "Leave" to save game details.</p>
        </div>
      </div>
    </div>
  );
};

export default Game;

