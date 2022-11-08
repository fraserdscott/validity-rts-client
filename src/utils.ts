import { BigNumber, ethers } from "ethers";

export enum UnitType {
  Ninja,
  Wizard
}

export type MoveEvent = {
  lobbyId: BigNumber,
  account: string,
  timestamp: number,
  unit: number,
  newGoalX: number,
  newGoalY: number
}

export type Unit = {
  x: number,
  y: number,
  goalX: number,
  goalY: number,
  radius: number,
  attackRadius: number,
  faction: number,
  damage: number,
  speed: number,
  maxHealth: number,
  health: number,
  sprite: string
};

export type Lobby = {
  duration:BigNumber,
  startTimestamp:BigNumber,
  lobbyId:BigNumber
};

const UNIT_TYPE_TRAITS: Record<UnitType, any> = {
  0: {
    speed: 5,
    radius: 20,
    damage: 1,
    attackRadius: 50,
    maxHealth: 200,
    health: 200,
    sprite: "🥷"
  },
  1: {
    speed: 5,
    radius: 18,
    damage: 0.5,
    attackRadius: 150,
    maxHealth: 180,
    health: 180,
    sprite: "🧙"
  },
}

const TICK = 100;

const applyMoveEvents = (timestamp: number, events: Array<MoveEvent>, units: Array<Unit>) => {
  events.map(e => {
    if (e.timestamp * 1000 < timestamp) {
      units[e.unit].goalX = e.newGoalX;
      units[e.unit].goalY = e.newGoalY;
    }
  });
  return units;
}

const updateUnits = (units: Array<Unit>) => {
  for (let i = 0; i < units.length; i++) {
    if (units[i].health > 0) {
      let run = units[i].goalX - units[i].x;
      let rise = units[i].goalY - units[i].y;
      let length = distance(run, rise);

      const newX = units[i].x + run * units[i].speed / length;
      const newY = units[i].y + rise * units[i].speed / length;

      let collision = false;
      let closest = -1;
      let closestD = Number.MAX_SAFE_INTEGER;
      for (let j = 0; j < units.length; j++) {
        if (units[j].health > 0) {
          if (i !== j && (newX - units[j].x) ** 2 + (newY - units[j].y) ** 2 <= (units[j].radius + units[i].radius) ** 2) {
            collision = true;
          }

          const d = (units[i].x - units[j].x) ** 2 + (units[i].y - units[j].y) ** 2;
          if (units[i].faction !== units[j].faction && d <= (units[j].radius + units[i].attackRadius) ** 2 && d < closestD) {
            closest = j;
            closestD = d;
          }
        }
      }
      if (closest !== -1) {
        units[closest].health -= units[i].damage;
      }

      if (length !== 0 && !collision) {
        units[i].x = newX;
        units[i].y = newY;
      }
    }
  };

  return units
};

export const simulate = (currentTimestamp: number, endTimestamp: number, moveEvents: Array<MoveEvent>, units: Array<Unit>): [number, Array<Unit>] => {
  while (currentTimestamp < endTimestamp) {
    units = applyMoveEvents(currentTimestamp, moveEvents, units);
    units = updateUnits(units);
    currentTimestamp += TICK;
  }

  return [currentTimestamp, units];
}

export const distance = (a: number, b: number) => Math.sqrt(a * a + b * b);

const createUnit = (x: number, y: number, faction: number, unitType: UnitType): Unit => {
  return {
    x,
    y,
    goalX: x,
    goalY: y,
    faction,
    ...UNIT_TYPE_TRAITS[unitType]
  };
}

const INITIAL_UNITS_RED = [
  createUnit(320, 50, 0, UnitType.Wizard),
  createUnit(385, 50, 0, UnitType.Ninja),
  createUnit(450, 50, 0, UnitType.Ninja),
  createUnit(515, 50, 0, UnitType.Ninja),
  createUnit(580, 50, 0, UnitType.Wizard)
];

const INITIAL_UNITS_BLUE = [
  createUnit(320, 450, 1, UnitType.Wizard),
  createUnit(385, 450, 1, UnitType.Ninja),
  createUnit(450, 450, 1, UnitType.Ninja),
  createUnit(515, 450, 1, UnitType.Ninja),
  createUnit(580, 450, 1, UnitType.Wizard)
];;

export const INITIAL_UNITS: Array<Unit> = INITIAL_UNITS_RED.concat(INITIAL_UNITS_BLUE);

export const addressEquals = (a: string, b: string) => ethers.utils.getAddress(a) === ethers.utils.getAddress(b);
