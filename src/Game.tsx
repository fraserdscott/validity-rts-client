import { useRef, useEffect, useState } from "react";
import { ethers } from "ethers";
import rollup from "./out/Rollup.sol/Rollup.json"
import frameRenderer, { RED_TEAM_COLOR, BLUE_TEAM_COLOR } from "./frameRenderer";
import { addressEquals, distance, INITIAL_UNITS, Lobby, MoveEvent, simulate, Unit, UnitType } from "./utils";

const ROLLUP_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
const wallet = ethers.Wallet.fromMnemonic("test test test test test test test test test test test junk")
  .connect(ethers.getDefaultProvider("http://localhost:8545"));

const move = (index: string, wallet: ethers.Wallet, selected: number, goalX: number, goalY: number) => {
  const contract = new ethers.Contract(ROLLUP_ADDRESS, rollup.abi, wallet);

  contract.move(index, selected, Math.round(goalX), Math.round(goalY));
}

const settle = async (index: string, wallet: ethers.Wallet) => {

  const contract = new ethers.Contract(ROLLUP_ADDRESS, rollup.abi, wallet);
  contract.settle(index, '0x');
}

const isValidEvent = (e: MoveEvent, lobbyId: string, units: Array<Unit>) => e.lobbyId.toString() === lobbyId && e.unit < units.length;

const TeamSpan = ({ i }: { i: number }) => {
  return <span style={{ color: i === 0 ? RED_TEAM_COLOR : BLUE_TEAM_COLOR }}>{i === 0 ? "Red team" : "Blue team"}</span>;
}

function Canvas({ lobbyId }: { lobbyId: string }) {
  const [lobby, setLobby] = useState<Lobby>();
  const [selected, setSelected] = useState(0);
  const [startTimestamp, setStartTimestamp] = useState(0);
  const [players, setPlayers] = useState<[string, string]>(["...", "..."]);
  const [moveEvents, setMoveEvents] = useState<Array<MoveEvent>>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestIdRef = useRef<number | null>(null);
  const timestampRef = useRef<number>(Date.now());
  const unitsRef = useRef<Array<Unit>>(INITIAL_UNITS);
  const size = { width: 1000, height: 500 };

  const tick = () => {
    // Lobby ends one hour after start
    // TODO: use actual timestamp
    if (lobby) {
      const endTimestamp = startTimestamp + lobby.duration.toNumber() * 1000;
      if (canvasRef.current) {
        const [timestamp, units] = simulate(timestampRef.current, Math.min(Date.now(), endTimestamp), moveEvents, unitsRef.current);

        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          frameRenderer.call(ctx, size, units, selected, addressEquals(players[units[selected].faction], wallet.address));
        }

        unitsRef.current = units;
        timestampRef.current = timestamp;

        requestIdRef.current = requestAnimationFrame(tick);
      }
    }
  };

  useEffect(() => {
    requestIdRef.current = requestAnimationFrame(tick);
    return () => {
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
      }
    };
  }, [moveEvents, players, selected, startTimestamp]);

  useEffect(() => {
    const contract = new ethers.Contract(ROLLUP_ADDRESS, rollup.abi, wallet);

    contract.getPlayers(lobbyId).then((ps: [string, string]) => setPlayers(ps));
    contract.lobbies(lobbyId).then((l: any) => {
      timestampRef.current = parseInt(l.startTimestamp) * 1000
      setStartTimestamp(parseInt(l.startTimestamp) * 1000);
    });

    let moveFilter = contract.filters.Move();
    //@ts-ignore
    contract.queryFilter(moveFilter).then(es => setMoveEvents(es.map(e => e.args).filter(e => isValidEvent(e, lobbyId, unitsRef.current)))).finally(() =>
      contract.on(moveFilter, (lobby, account, timestamp, unit, newGoalX, newGoalY) => {
        const event: MoveEvent = { lobbyId: lobby, account, timestamp, unit, newGoalX, newGoalY };
        if (isValidEvent(event, lobbyId, unitsRef.current)) {
          const eventsCopy = moveEvents.slice();
          eventsCopy.push(event);
          setMoveEvents(eventsCopy);
        }
      })
    );

    let lobbyFilter = contract.filters.LobbyCreated(lobbyId);
    //@ts-ignore
    contract.queryFilter(lobbyFilter).then(e => { if (e[0].args) setLobby(e[0].args) });
  }, [lobbyId]);

  const handleClick = (event: MouseEvent) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      let index = unitsRef.current.findIndex(unit =>
        unit.health > 0 && distance(unit.x - x, unit.y - y) < unit.radius
      );
      if (index !== -1) {
        setSelected(index);
      } else if (addressEquals(players[unitsRef.current[selected].faction], wallet.address)) {
        move(lobbyId, wallet, selected, x, y);
      }
    }
  }

  return (<div>
    <canvas
      style={{ border: "solid" }}
      {...size}
      ref={canvasRef}
      onClick={(e) => handleClick(e.nativeEvent)}
    />
    <div>
      You are controlling: {players.filter(p => p.toLowerCase() === wallet.address.toLowerCase()).map((p, i) => <TeamSpan key={i} i={i} />)}
    </div>
    <div>
      <h2>Lobby</h2>
      <button onClick={() => settle(lobbyId, wallet)}>Settle</button>
      {lobby ? (
        <div>
          <div>
            Start time: {new Date(lobby.startTimestamp.toNumber() * 1000).toLocaleString()}
          </div>
          <div>
            End time: {new Date(lobby.startTimestamp.toNumber() * 1000 + (lobby.duration.toNumber() * 1000)).toLocaleString()}
          </div>
          <div>
            Duration: {lobby.duration.toNumber() / 60} minutes
          </div>
        </div>
      ) : (
        <div>
          <div>
            Start time: ...
          </div>
          <div>
            End time: ...
          </div>
          <div>
            Duration: ...
          </div>
        </div>)}
    </div>
    <div>
      <h3>Players</h3>
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Team</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p, i) => <tr key={i}>
            <td>{p}</td>
            <td><TeamSpan i={0} /></td>
          </tr>)}
        </tbody>
      </table>
    </div>
  </div>
  );
}

export default Canvas;
