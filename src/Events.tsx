import rollup from "./out/Rollup.sol/Rollup.json"
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { MNEMONIC, ROLLUP_ADDRESS, RPC_URL } from "./Game";
import { Link } from "react-router-dom";

const wallet = ethers.Wallet.fromMnemonic(MNEMONIC)
  .connect(ethers.getDefaultProvider(RPC_URL));

function Events() {
  const [moveEvents, setMoveEvents] = useState<Array<ethers.Event>>([]);
  const [createdEvents, setCreatedEvents] = useState<Array<ethers.Event>>([]);

  useEffect(() => {
    const contract = new ethers.Contract(ROLLUP_ADDRESS, rollup.abi, wallet);

    let moveFilter = contract.filters.Move();
    contract.queryFilter(moveFilter).then(setMoveEvents);
    
    let createdFilter = contract.filters.LobbyCreated();
    contract.queryFilter(createdFilter).then(setCreatedEvents);
  }, []);

  return <div>
    <Link to={`/`}>
      Home
    </Link>
    <h1>Events</h1>
    <h2>All Move events</h2>
    <table>
      <thead>
        <tr>
          <th>Lobby</th>
          <th>Timestamp</th>
          <th>Account</th>
          <th>Unit</th>
          <th>To</th>
        </tr>
      </thead>
      <tbody>
        {moveEvents.length > 0 ? moveEvents.map((e, i) => e.args ? <tr key={i}>
          <td>{e.args.lobbyId.toString()}</td>
          <td>{new Date(e.args.timestamp.toNumber() * 1000).toLocaleString()}</td>
          <td>{e.args.account}</td>
          <td>{e.args.unit.toString()}</td>
          <td>({e.args.newGoalX.toString()}, {e.args.newGoalY.toString()})</td>
        </tr> : null) : null}
      </tbody>
    </table>
    <h2>All Lobby Created events</h2>
    <table>
      <thead>
        <tr>
          <th>Lobby</th>
          <th>Start timestamps</th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody>
        {createdEvents.length > 0 ? createdEvents.map((e, i) => e.args ? <tr key={i}>
          <td>{e.args.lobbyId.toString()}</td>
          <td>{e.args.startTimestamp.toString()}</td>
          <td>{e.args.duration.toString()}</td>
        </tr> : null) : null}
      </tbody>
    </table>
  </div>;
}

export default Events;
