import rollup from "./out/Rollup.sol/Rollup.json"
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { ROLLUP_ADDRESS, RPC_URL } from "./Game";

const wallet = ethers.Wallet.fromMnemonic("test test test test test test test test test test test junk")
  .connect(ethers.getDefaultProvider(RPC_URL));

function Events() {
  const [events, setEvents] = useState<Array<ethers.Event>>([]);

  useEffect(() => {
    const contract = new ethers.Contract(ROLLUP_ADDRESS, rollup.abi, wallet);

    let filter = contract.filters.Move();
    contract.queryFilter(filter).then(es => setEvents(es));
  }, []);

  return <div>
    <h1>Events</h1>
    <table>
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>Account</th>
          <th>Unit</th>
          <th>To</th>
        </tr>
      </thead>
      <tbody>
        {events.length > 0 ? events.map((e, i) => e.args ? <tr key={i}>
          <td>{e.args.timestamp.toString()}</td>
          <td>{e.args.account}</td>
          <td>{e.args.unit.toString()}</td>
          <td>({e.args.newGoalX.toString()}, {e.args.newGoalY.toString()})</td>
        </tr> : null) : null}
      </tbody>
    </table>
  </div>;
}

export default Events;
