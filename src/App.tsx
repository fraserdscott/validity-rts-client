import React from 'react';
import { Routes, Route } from "react-router-dom";
import './App.css';
import Lobbies from './Lobbies';
import Lobby from './Lobby';

function App() {
  return (
    <Routes>
      <Route path="lobbies" element={<Lobby />}>
        <Route path=":lobbyId" element={<Lobby />} />
      </Route>
      <Route path="/" element={
        <Lobbies />
      } />
    </Routes>
  );
}

export default App;
