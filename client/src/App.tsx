import { Route, Routes } from "react-router-dom";
import './App.css';
import NavBar from './components/Navbar';
import Game from './pages/Game';
import GameHistory from "./pages/GameHistory";
import GameLog from "./pages/GameLog";
import Home from './pages/Home';
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <div className="app">
      <header className="app-header">
        <NavBar />
      </header>
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<Register />} />
          <Route path="/game" element={<Game />} />
          <Route path="/game-history" element={<GameHistory />} />
          <Route path="/game-log/:id" element={<GameLog />} />
        </Routes>
      </main>
      <footer>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </footer>
    </div>
  );
}

export default App;
