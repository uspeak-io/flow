import logo from './logo.svg';
import './App.css';
import Login from './components/Login';
import Home from './components/Home';
import Room from './components/Room';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/rooms/:roomId" element={<Room />} />
      </Routes>
    </Router>
  );
}

export default App;
