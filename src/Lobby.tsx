import { Link, useParams } from "react-router-dom";
import Game from "./Game";

function Lobby() {
    let params = useParams();
    return (<div>
        <Link to={`/`}>
            Home
        </Link>
        <div className="App">
            {params.lobbyId ?
                <Game lobbyId={params.lobbyId} /> : <div>Invalid lobby ID.</div>
            }
        </div>
    </div>);
}

export default Lobby;
