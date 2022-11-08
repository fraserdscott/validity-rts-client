import './App.css';
import { ethers } from "ethers";
import rollup from "./out/Rollup.sol/Rollup.json"
import { useState } from 'react';
import { ROLLUP_ADDRESS, RPC_URL } from './Game';
import { setup_generic_prover_and_verifier, create_proof, verify_proof } from '@noir-lang/barretenberg/dest/client_proofs';

const acir = {
  "current_witness_index": 30,
  "gates": [
    {
      "Arithmetic": {
        "mul_terms": [],
        "linear_combinations": [
          [
            "0000000000000000000000000000000000000000000000000000000000000001",
            11
          ],
          [
            "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000000",
            13
          ],
          [
            "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000000",
            22
          ]
        ],
        "q_c": "0000000000000000000000000000000000000000000000000000000000000000"
      }
    },
    {
      "Arithmetic": {
        "mul_terms": [],
        "linear_combinations": [
          [
            "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000000",
            9
          ],
          [
            "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000000",
            10
          ],
          [
            "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000000",
            23
          ]
        ],
        "q_c": "0000000000000000000000000000000000000000000000000000000000000000"
      }
    },
    {
      "Arithmetic": {
        "mul_terms": [],
        "linear_combinations": [
          [
            "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000000",
            7
          ],
          [
            "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000000",
            8
          ],
          [
            "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000000",
            24
          ]
        ],
        "q_c": "0000000000000000000000000000000000000000000000000000000000000000"
      }
    },
    {
      "Arithmetic": {
        "mul_terms": [],
        "linear_combinations": [
          [
            "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000000",
            5
          ],
          [
            "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000000",
            6
          ],
          [
            "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000000",
            25
          ]
        ],
        "q_c": "0000000000000000000000000000000000000000000000000000000000000000"
      }
    },
    {
      "Arithmetic": {
        "mul_terms": [],
        "linear_combinations": [
          [
            "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000000",
            3
          ],
          [
            "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000000",
            4
          ],
          [
            "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000000",
            26
          ]
        ],
        "q_c": "0000000000000000000000000000000000000000000000000000000000000000"
      }
    },
    {
      "Arithmetic": {
        "mul_terms": [],
        "linear_combinations": [
          [
            "0000000000000000000000000000000000000000000000000000000000000001",
            25
          ],
          [
            "0000000000000000000000000000000000000000000000000000000000000001",
            26
          ],
          [
            "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000000",
            27
          ]
        ],
        "q_c": "0000000000000000000000000000000000000000000000000000000000000000"
      }
    },
    {
      "Arithmetic": {
        "mul_terms": [],
        "linear_combinations": [
          [
            "0000000000000000000000000000000000000000000000000000000000000001",
            23
          ],
          [
            "0000000000000000000000000000000000000000000000000000000000000001",
            24
          ],
          [
            "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000000",
            28
          ]
        ],
        "q_c": "0000000000000000000000000000000000000000000000000000000000000000"
      }
    },
    {
      "Arithmetic": {
        "mul_terms": [],
        "linear_combinations": [
          [
            "0000000000000000000000000000000000000000000000000000000000000001",
            27
          ],
          [
            "0000000000000000000000000000000000000000000000000000000000000001",
            28
          ],
          [
            "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000000",
            29
          ]
        ],
        "q_c": "0000000000000000000000000000000000000000000000000000000000000000"
      }
    },
    {
      "Arithmetic": {
        "mul_terms": [],
        "linear_combinations": [
          [
            "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000000",
            1
          ],
          [
            "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000000",
            2
          ],
          [
            "0000000000000000000000000000000000000000000000000000000000000001",
            30
          ]
        ],
        "q_c": "0000000000000000000000000000000000000000000000000000000000000000"
      }
    },
    {
      "Arithmetic": {
        "mul_terms": [],
        "linear_combinations": [
          [
            "0000000000000000000000000000000000000000000000000000000000000001",
            22
          ],
          [
            "0000000000000000000000000000000000000000000000000000000000000001",
            29
          ],
          [
            "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000000",
            30
          ]
        ],
        "q_c": "0000000000000000000000000000000000000000000000000000000000000000"
      }
    },
    {
      "Directive": {
        "Invert": {
          "x": 13,
          "result": 14
        }
      }
    },
    {
      "Arithmetic": {
        "mul_terms": [
          [
            "0000000000000000000000000000000000000000000000000000000000000001",
            13,
            14
          ]
        ],
        "linear_combinations": [
          [
            "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000000",
            15
          ]
        ],
        "q_c": "0000000000000000000000000000000000000000000000000000000000000000"
      }
    },
    {
      "Arithmetic": {
        "mul_terms": [
          [
            "0000000000000000000000000000000000000000000000000000000000000001",
            13,
            15
          ]
        ],
        "linear_combinations": [
          [
            "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000000",
            13
          ]
        ],
        "q_c": "0000000000000000000000000000000000000000000000000000000000000000"
      }
    },
    {
      "Arithmetic": {
        "mul_terms": [],
        "linear_combinations": [
          [
            "0000000000000000000000000000000000000000000000000000000000000001",
            12
          ],
          [
            "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000000",
            16
          ]
        ],
        "q_c": "0000000000000000000000000000000000000000000000000000000000000000"
      }
    },
    {
      "Directive": {
        "Invert": {
          "x": 16,
          "result": 17
        }
      }
    },
    {
      "Arithmetic": {
        "mul_terms": [
          [
            "0000000000000000000000000000000000000000000000000000000000000001",
            16,
            17
          ]
        ],
        "linear_combinations": [
          [
            "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000000",
            18
          ]
        ],
        "q_c": "0000000000000000000000000000000000000000000000000000000000000000"
      }
    },
    {
      "Arithmetic": {
        "mul_terms": [
          [
            "0000000000000000000000000000000000000000000000000000000000000001",
            16,
            18
          ]
        ],
        "linear_combinations": [
          [
            "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000000",
            16
          ]
        ],
        "q_c": "0000000000000000000000000000000000000000000000000000000000000000"
      }
    },
    {
      "Arithmetic": {
        "mul_terms": [],
        "linear_combinations": [
          [
            "0000000000000000000000000000000000000000000000000000000000000001",
            15
          ],
          [
            "0000000000000000000000000000000000000000000000000000000000000001",
            18
          ],
          [
            "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000000",
            19
          ]
        ],
        "q_c": "0000000000000000000000000000000000000000000000000000000000000000"
      }
    },
    {
      "Directive": {
        "Invert": {
          "x": 19,
          "result": 20
        }
      }
    },
    {
      "Arithmetic": {
        "mul_terms": [
          [
            "0000000000000000000000000000000000000000000000000000000000000001",
            19,
            20
          ]
        ],
        "linear_combinations": [
          [
            "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000000",
            21
          ]
        ],
        "q_c": "0000000000000000000000000000000000000000000000000000000000000000"
      }
    },
    {
      "Arithmetic": {
        "mul_terms": [
          [
            "0000000000000000000000000000000000000000000000000000000000000001",
            19,
            21
          ]
        ],
        "linear_combinations": [
          [
            "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000000",
            19
          ]
        ],
        "q_c": "0000000000000000000000000000000000000000000000000000000000000000"
      }
    },
    {
      "Arithmetic": {
        "mul_terms": [],
        "linear_combinations": [
          [
            "0000000000000000000000000000000000000000000000000000000000000001",
            21
          ]
        ],
        "q_c": "0000000000000000000000000000000000000000000000000000000000000000"
      }
    }
  ],
  "public_inputs": [
    11,
    12
  ]
}


let [prover, verifier] = await setup_generic_prover_and_verifier(acir);

const wallet = ethers.Wallet.fromMnemonic("test test test test test test test test test test test junk")
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
      <label>
        Player 1:
        <input type="text" placeholder="0x0000000000000000000000000000000000000000" onChange={e => setPlayer1(e.target.value)} />
      </label>
      <label>
        Player 2:
        <input type="text" placeholder="0x0000000000000000000000000000000000000000" onChange={e => setPlayer2(e.target.value)} />
      </label>
      <label>
        Start timestamp:
        <input type="datetime-local" placeholder="0" onChange={e => setStartTimestamp(e.target.value)} />
      </label>
      <label>
        Duration:
        <input type="number" placeholder="0" onChange={e => setDuration(parseInt(e.target.value))} /> seconds
      </label>
      <button onClick={() => createLobby(startTimestamp, duration, wallet, [player1, player2])}>Create</button>
    </div>
  );
}

export default CreateLobby;
