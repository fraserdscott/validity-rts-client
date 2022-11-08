import './App.css';
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import rollup from "./out/Rollup.sol/Rollup.json"
import { useEffect, useState } from 'react';
import CreateLobby from './CreateLobby';
import { MNEMONIC, ROLLUP_ADDRESS, RPC_URL } from './Game';
import { BLUE_TEAM_COLOR } from './frameRenderer';
export const RED_TEAM_COLOR = "#FF0000";

const wallet = ethers.Wallet.fromMnemonic(MNEMONIC)
  .connect(ethers.getDefaultProvider(RPC_URL));

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
      {players ? players[0] : null}
    </td>
    <td>
      {players ? players[1] : null}
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
          View
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
    <div style={{ display: 'flex', flexDirection: 'column', padding: 20 }}>
      <h1 style={{ fontFamily: 'Tahoma' }}>Validity Wars</h1>
      <div style={{ border: 'solid', padding: 8 }}>
        <h2>Account</h2>
        You are logged in as: {wallet.address}
      </div>
      <div style={{ border: 'solid', padding: 8 }}>
        <h2>Create a lobby</h2>
        <CreateLobby />
      </div>
      <div style={{ border: 'solid', padding: 8 }}>
        <h2>Lobbies</h2>
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Start time</th>
              <th>End time</th>
              <th>Duration</th>
              <th><span style={{ color: RED_TEAM_COLOR }}>Red Team</span></th>
              <th><span style={{ color: BLUE_TEAM_COLOR }}>Blue Team</span></th>
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
      <div style={{ border: 'solid', padding: 8 }}>
        <h2>Events</h2>
        <Link to={`/events`}>
          <button style={{ fontSize: 15 }}>View all past events</button>
        </Link>
      </div>
    </div>
  );
}

export default Lobbies;
