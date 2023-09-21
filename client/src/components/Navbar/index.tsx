import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import './style.css';

const NavBar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const token = localStorage.getItem('token');


  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <nav>
      <ul>
        <li>
          <NavLink to='/' className='brand'>Gomoku</NavLink>
        </li>
      </ul>
      <ul>
        {!token && !(pathname === '/login') &&
          <li>
            <NavLink to='/login'>Login</NavLink>
          </li>
        }
        {token && (pathname === '/') &&
          <li>
            <NavLink to='/game-history'>Previous Games</NavLink>
          </li>
        }
        {token &&
          <li>
            <button className='btn' onClick={handleLogout}>Logout</button>
          </li>
        }
      </ul>
    </nav>
  )
}

export default NavBar
