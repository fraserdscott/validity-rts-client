import { Unit } from "./utils";

const FRIENDLY_SELECTED_COLOR = "#000000";
const ENEMY_SELECTED_COLOR = "#AAAAAA";
const GOAL_COLOR = "#000000";
export const RED_TEAM_COLOR = "#FF0000";
export const BLUE_TEAM_COLOR = "#0000FF";

const HEALTHBAR_WIDTH = 60;

function frameRenderer(this: CanvasRenderingContext2D, size: { width: number, height: number }, units: Array<Unit>, selected: number, ownsSelected: boolean) {
  this.clearRect(0, 0, size.width, size.height);
  this.font = '30px Arial';

  const drawHealthbar = (unit: Unit) => {
    this.fillStyle = 'green';
    this.strokeStyle = 'black';
    this.beginPath();
    this.rect(unit.x - (HEALTHBAR_WIDTH / 2), unit.y - 50, HEALTHBAR_WIDTH, 20);
    this.fillRect(unit.x - (HEALTHBAR_WIDTH / 2), unit.y - 50, HEALTHBAR_WIDTH * (unit.health / unit.maxHealth), 20);
    this.stroke();
  };

  const drawAttack = (x: number, y: number, radius: number, color: string) => {
    this.beginPath();
    this.arc(x, y, radius, 0, Math.PI * 2);
    this.strokeStyle = "#000000";
    this.fillStyle = "#FFFFFF";
    this.fillStyle = 'rgba(0, 0, 0, 0)';
    this.stroke();
    this.fill();
  };

  const drawCircle = (x: number, y: number, radius: number, color: string) => {
    this.save();
    this.beginPath();
    this.arc(x, y, radius, 0, Math.PI * 2);
    this.fillStyle = color;
    this.fill();
    this.closePath();
    this.restore();
  };

  units.forEach((unit, i) => {
    if (unit.health > 0 && i === selected) {
      drawAttack(unit.x, unit.y, unit.attackRadius, "#EEEEEE");
    }
  });

  units.forEach((unit, i) => {
    if (unit.health > 0 && i === selected) {
      drawCircle(unit.x, unit.y, unit.attackRadius, "#EEEEEE");
    }
  });

  units.forEach((unit, i) => {
    if (unit.health > 0) {
      let closest = -1;
      let closestD = Number.MAX_SAFE_INTEGER;
      for (let j = 0; j < units.length; j++) {
        if (units[j].health > 0) {
          const d = (units[i].x - units[j].x) ** 2 + (units[i].y - units[j].y) ** 2;
          if (units[i].faction !== units[j].faction && d <= (units[j].radius + units[i].attackRadius) ** 2 && d < closestD) {
            closest = j;
            closestD = d;
          }
        }
      }
      if (closest !== -1) {
        this.strokeStyle = unit.faction === 0 ? RED_TEAM_COLOR : BLUE_TEAM_COLOR;
        this.beginPath();
        this.moveTo(unit.x, unit.y);
        this.lineTo(units[closest].x, units[closest].y);
        this.stroke();
      }

      drawHealthbar(unit);

      if (i === selected) {
        if (ownsSelected) {
          drawCircle(unit.x, unit.y, unit.radius * 1.3, FRIENDLY_SELECTED_COLOR);
        } else {
          drawCircle(unit.x, unit.y, unit.radius * 1.3, ENEMY_SELECTED_COLOR);
        }
      }
      drawCircle(unit.goalX, unit.goalY, unit.radius * 0.5, GOAL_COLOR);
      const factionColor = unit.faction === 0 ? RED_TEAM_COLOR : BLUE_TEAM_COLOR;
      drawCircle(unit.x, unit.y, unit.radius, factionColor);
      this.fillText(unit.sprite, unit.x - 14.5, unit.y + 10);
    }
  }
  )
}

export default frameRenderer;
