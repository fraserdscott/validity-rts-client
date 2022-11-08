import './App.css';
import { ethers } from "ethers";
import rollup from "./out/Rollup.sol/Rollup.json"
import { useState } from 'react';
import { MNEMONIC, ROLLUP_ADDRESS, RPC_URL } from './Game';

const wallet = ethers.Wallet.fromMnemonic(MNEMONIC)
  .connect(ethers.getDefaultProvider(RPC_URL));

const createLobby = async (startTimestamp: string, duration: number, wallet: ethers.Wallet, players: [string, string]) => {
  const contract = new ethers.Contract(ROLLUP_ADDRESS, rollup.abi, wallet);

  const startDate = new Date(startTimestamp);
  // TODO: duration in seconds
  contract.createLobby(Math.round(startDate.getTime() / 1000), duration, players);
}

function CreateLobby() {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [startTimestamp, setStartTimestamp] = useState('');
  const [duration, setDuration] = useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', flexDirection: 'row', padding: 2 }}>
        <label style={{ padding: 4 }}>
          Player 1:
          <input type="text" placeholder="0x0000000000000000000000000000000000000000" onChange={e => setPlayer1(e.target.value)} />
        </label>
        <label style={{ padding: 4 }}>
          Player 2:
          <input type="text" placeholder="0x0000000000000000000000000000000000000000" onChange={e => setPlayer2(e.target.value)} />
        </label>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', padding: 2 }}>
        <label style={{ padding: 4 }}>
          Start timestamp:
          <input type="datetime-local" placeholder="0" onChange={e => setStartTimestamp(e.target.value)} />
        </label>
        <label style={{ padding: 4 }}>
          Duration:
          <input type="number" placeholder="0" onChange={e => setDuration(parseInt(e.target.value))} /> seconds
        </label>
      </div>
      <div>
        <button onClick={() => createLobby(startTimestamp, duration, wallet, [player1, player2])}>Create</button>
      </div>
    </div>
  );
}

export default CreateLobby;
