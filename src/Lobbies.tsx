import './App.css';
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import rollup from "./out/Rollup.sol/Rollup.json"
import { useEffect, useState } from 'react';
import CreateLobby from './CreateLobby';

const ROLLUP_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
const wallet = ethers.Wallet.fromMnemonic("test test test test test test test test test test test junk")
  .connect(ethers.getDefaultProvider("http://localhost:8545"));

const formatAddress = (a: string) => `${a.slice(0, 6)}...${a.slice(-2)}`;

const LobbyRow = ({ l, i, players }: { l: any, i: number, players: [string, string] | null }) => {
  if (!l.args) {
    return (<div>brokey</div>);
  }

  const startDate = new Date(parseInt(l.args.startTimestamp) * 1000);
  const endDate = new Date((parseInt(l.args.startTimestamp) * 1000) + parseInt(l.args.duration) * 1000);

  return (<tr>
    <td>
      #{i}
    </td>
    <td>
      {startDate.toLocaleString()}
    </td>
    <td>
      {endDate.toLocaleString()}
    </td>
    <td>
      {l.args.duration.toNumber() / 60} minutes
    </td>
    <td>
      {players ? players.map(p => formatAddress(p)).toString() : "..."}
    </td>
    <td>
      {startDate.getTime() < Date.now() && endDate.getTime() > Date.now() ? "In progress" : null}
      {startDate.getTime() > Date.now() && endDate.getTime() > Date.now() ? "Scheduled" : null}
      {startDate.getTime() < Date.now() && endDate.getTime() < Date.now() ? "Finished" : null}
    </td>
    <td>
      <Link
        to={`/lobbies/${i}`}
      >
        <button style={{ fontSize: 15 }}>
          Go
        </button>
      </Link>
    </td>
  </tr>);
}
function Lobbies() {
  const [lobbies, setLobbies] = useState<Array<ethers.Event>>([]);
  const [players, setPlayers] = useState<Array<[string, string]>>();

  useEffect(() => {
    const contract = new ethers.Contract(ROLLUP_ADDRESS, rollup.abi, wallet);

    let filter = contract.filters.LobbyCreated();
    contract.queryFilter(filter).then(setLobbies);
  }, []);

  useEffect(() => {
    const contract = new ethers.Contract(ROLLUP_ADDRESS, rollup.abi, wallet);

    Promise.all(lobbies.map((l, i) => contract.getPlayers(i))).then(setPlayers);
  }, [lobbies]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h1>Validity Wars</h1>
      <div>
        You are logged in as: {wallet.address}
      </div>
      <div>
        <h2>Create a lobby</h2>
        <CreateLobby />
      </div>
      <div>
        <h2>Lobbies</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Start time</th>
              <th>End time</th>
              <th>Duration</th>
              <th>Players</th>
              <th>Stage</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {players ? lobbies.map((l, i) =>
              <LobbyRow key={i} l={l} i={i} players={players[i]} />
            ) : null}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Lobbies;
