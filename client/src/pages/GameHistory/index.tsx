import { useNavigate } from 'react-router-dom';
import Unauthorized from '../../components/Unautorized';
import './style.css';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../services/axios';
import { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

export interface IGame {
  _id: string;
  size: number;
  date: string;
  result: string;
  status: string;
  moves: Move[];
  played_by: IPlayedBy;
}

interface IPlayedBy {
  _id: string;
  name: string;
}

interface Move {
  row: number;
  col: number;
  player: number;
  _id: string;
}

const GameHistory = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [gameList, setGameList] = useState<Array<IGame>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const viewGameHistory = (id: string) => {
    navigate(`/game-log/${id}`);
  }

  const fetchGame = async () => {
    try {
      setIsLoading(true);
      const res: AxiosResponse = await axiosInstance.get('/games?status=COMPLETED');
      if (res.data?.data) {
        setGameList(res.data?.data)
      }
      setIsLoading(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.error?.message);
      }
      console.log(error)
    }
  }

  useEffect(() => {
    fetchGame()
  }, [])


  if (!token) {
    return (<Unauthorized />)
  }

  if (isLoading) {
    return (
      <div className='div-center'>
        <h4>Loading....</h4>
      </div>
    )
  }

  return (
    <div className='history-container'>
      {gameList && gameList.length > 0 ? gameList.map((game, index) => (
        <div className='game-info-wrapper' key={game._id}>
          <h4 className='game-info'> {`GAME #${index + 1} @${game.date},  ${game.result === 'Draw' ? 'Game is a draw' : 'Winner: ' + game.result}`}</h4>
          <button className='btn btn-lg' onClick={() => viewGameHistory(game._id)}>
            View Game Log
          </button>
        </div>
      )) : (
        <div>
          <h4>No previous games has been found</h4>
        </div>
      )}

    </div>
  )
}

export default GameHistory