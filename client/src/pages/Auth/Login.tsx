import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import { At, LockKey } from '@phosphor-icons/react';
import { AxiosError, AxiosResponse } from 'axios';
import { axiosInstance } from '../../services/axios';
import { toast } from 'react-toastify';


const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (username === '') {
      setError('Username is required!');
      return
    }
    if (password === '') {
      setError('Password is required!');
      return
    }
    const requestData = { username, password }
    try {
      const res: AxiosResponse = await axiosInstance.post('/login', requestData);
      toast.success(res.data?.message);
      localStorage.setItem('token', res.data?.token);
      setError('');
      navigate('/');
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.error?.message);
      }
      console.log(error)
    }
  }

  return (
    <div className='login-wrapper'>
      <form action="" className="form_main">
        <p className="heading">Login</p>
        <div className="inputContainer">
          <At className='inputIcon' size={16} weight="light" />
          <input type="text" className="inputField" value={username} onChange={(e) => setUsername(e.target.value)} id="username" placeholder="Username" />
        </div>
        <div className="inputContainer">
          <LockKey className='inputIcon' size={16} weight="light" />
          <input type="password" className="inputField" value={password} onChange={(e) => setPassword(e.target.value)} id="password" placeholder="Password" />
        </div>
        <p className='error'>{error}</p>
        <button id="button" type='button' onClick={(e) => handleLogin(e)}>Submit</button>
        <div className='mt-20'>
          Don't have an account?
          <button type='button' className="btn-link pl-4" onClick={() => navigate('/sign-up')}> Sign Up</button>
        </div>
      </form>
    </div>
  )
}

export default Login