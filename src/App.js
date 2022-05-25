import { useSelector } from 'react-redux';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Main from './components/Main';
import Navbar from './components/Navbar';

function App() {


  return (
    <div className="App">

      <Main />
    </div>
  );
}

export default App;
