import { controls } from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    document.body.addEventListener('keydown', (event) => {
      if (event.code === 'KeyA') resolve(firstFighter);
    });
    //resolve the promise with the winner when fight is over
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
