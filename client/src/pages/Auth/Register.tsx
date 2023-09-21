import { At, EnvelopeSimple, LockKey, User } from '@phosphor-icons/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../services/axios';
import './style.css';
import { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

const emailRegEx = /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/


const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleRegister = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (name === '') {
      setError('name is required!');
      return
    }
    if (username === '') {
      setError('Username is required!');
      return
    }
    if (email === '') {
      setError('Email is required!');
      return
    }
    if (!emailRegEx.test(email)) {
      setError('Invalid email!');
      return
    }
    if (password === '') {
      setError('Password is required!');
      return
    }

    const requestData = {
      name, username, email, password
    }
    try {
      const res: AxiosResponse = await axiosInstance.post('/register', requestData);
      toast.success(res.data?.message);
      navigate('/login');
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
        <p className="heading">Sign Up</p>
        <div className="inputContainer">
          <User className='inputIcon' size={16} weight="light" />
          <input type="text" className="inputField" value={name} onChange={(e) => setName(e.target.value)} id="name" placeholder="Full Name" />
        </div>
        <div className="inputContainer">
          <EnvelopeSimple className='inputIcon' size={16} weight="light" />
          <input type="text" className="inputField" value={email} onChange={(e) => setEmail(e.target.value)} id="email" placeholder="Email" />
        </div>
        <div className="inputContainer">
          <At className='inputIcon' size={16} weight="light" />
          <input type="text" className="inputField" value={username} onChange={(e) => setUsername(e.target.value)} id="username" placeholder="Username" />
        </div>

        <div className="inputContainer">
          <LockKey className='inputIcon' size={16} weight="light" />
          <input type="password" className="inputField" value={password} onChange={(e) => setPassword(e.target.value)} id="password" placeholder="Password" />
        </div>
        <p className='error'>{error}</p>
        <button id="button" onClick={(e) => handleRegister(e)}>Submit</button>
        <div className='mt-20'>
          Already have an account?
          <button type='button' className="btn-link pl-4" onClick={() => navigate('/login')}> Login</button>
        </div>
      </form>
    </div>
  )
}

export default Register