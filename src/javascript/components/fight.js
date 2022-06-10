import { controls } from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    const leftFighter = new Fighter(firstFighter, 'left');
    const rightFighter = new Fighter(secondFighter, 'right');
    const attackListner = (event) => {
      const keyCode = event.code;
      const { PlayerOneAttack, PlayerOneBlock, PlayerTwoAttack, PlayerTwoBlock } = controls;

      switch (keyCode) {
        case PlayerOneAttack:
          attackHandler(leftFighter, rightFighter, resolve, removeListners);
          break;
        case PlayerOneBlock:
          leftFighter.isDefense = true;
          break;
        case PlayerTwoAttack:
          attackHandler(rightFighter, leftFighter, resolve, removeListners);
          break;
        case PlayerTwoBlock:
          rightFighter.isDefense = true;
          break;
      }
    };
    const defenseListner = (event) => {
      const keyCode = event.code;
      const { PlayerOneAttack, PlayerOneBlock, PlayerTwoAttack, PlayerTwoBlock } = controls;

      switch (keyCode) {
        case PlayerOneBlock:
          leftFighter.isDefense = false;
          break;
        case PlayerTwoBlock:
          rightFighter.isDefense = false;
          break;
      }
    };

    function removeListners() {
      document.body.removeEventListener('keydown', attackListner, false);
      document.body.removeEventListener('keyup', defenseListner, false);
    }

    document.body.addEventListener('keydown', attackListner, false);
    document.body.addEventListener('keyup', defenseListner, false);
  });
}

export function getDamage(attacker, defender) {
  const hitPower = getHitPower(attacker);
  const blockPower = getBlockPower(defender);

  return hitPower < blockPower ? 0 : hitPower - blockPower;
}

export function getHitPower(fighter) {
  return fighter.attack * criticalHitOrDodgeChance();
}

export function getBlockPower(fighter) {
  return fighter.defense * criticalHitOrDodgeChance();
}

function criticalHitOrDodgeChance() {
  return 1 + Math.random();
}

function elementHP(side) {
  return document.getElementById(`${side}-fighter-indicator`);
}

class Fighter {
  constructor(fighter, side) {
    this.fighter = fighter;
    this.fighterHealth = fighter.health;
    this.elementHP = elementHP(side);
    this.isDefense = false;
    this.isCritical = false;
  }
}

function attackHandler(firstFighter, secondFighter, resolve, removeListners) {
  if (!firstFighter.isDefense && !secondFighter.isDefense) {
    const firstFighterDamage = getDamage(firstFighter.fighter, secondFighter.fighter);
    firstFighterDamage > secondFighter.fighterHealth
      ? (secondFighter.fighterHealth = 0)
      : (secondFighter.fighterHealth -= firstFighterDamage);
    secondFighter.elementHP.style.width = `${(100 / secondFighter.fighter.health) * secondFighter.fighterHealth}%`;

    if (secondFighter.fighterHealth === 0) {
      resolve(firstFighter.fighter);
      removeListners();
    }
  }
}
