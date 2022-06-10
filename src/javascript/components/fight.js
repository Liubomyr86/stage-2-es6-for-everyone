import { controls } from '../../constants/controls';

const pressedButtons = new Set();

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    const leftFighter = new Fighter(firstFighter, 'left');
    const rightFighter = new Fighter(secondFighter, 'right');
    const attackListner = (event) => {
      let keyCode = event.code;
      const { PlayerOneAttack, PlayerOneBlock, PlayerTwoAttack, PlayerTwoBlock } = controls;
      let { PlayerOneCriticalHitCombination, PlayerTwoCriticalHitCombination } = controls;

      PlayerOneCriticalHitCombination = PlayerOneCriticalHitCombination.sort().join('');
      PlayerTwoCriticalHitCombination = PlayerTwoCriticalHitCombination.sort().join('');
      pressedButtons.add(keyCode);
      keyCode = [...pressedButtons].sort().join('');

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
        case PlayerOneCriticalHitCombination:
          criticalAttackHandler(leftFighter, rightFighter, resolve, removeListners);
          break;
        case PlayerTwoCriticalHitCombination:
          criticalAttackHandler(rightFighter, leftFighter, resolve, removeListners);
          break;
      }
    };
    const defenseListner = (event) => {
      const keyCode = event.code;
      const { PlayerOneBlock, PlayerTwoBlock } = controls;

      pressedButtons.delete(keyCode);

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
    this.isCriticalHit = false;
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

function getCriticalDamage(attacker) {
  return attacker.attack * 2;
}

function criticalAttackHandler(firstFighter, secondFighter, resolve, removeListners) {
  if (!firstFighter.isCriticalHit) {
    const firstFighterDamage = getCriticalDamage(firstFighter.fighter);
    firstFighterDamage > secondFighter.fighterHealth
      ? (secondFighter.fighterHealth = 0)
      : (secondFighter.fighterHealth -= firstFighterDamage);
    secondFighter.elementHP.style.width = `${(100 / secondFighter.fighter.health) * secondFighter.fighterHealth}%`;
    firstFighter.isCriticalHit = true;
    setCriticalAttackTimeout(firstFighter, 10000);
    if (secondFighter.fighterHealth === 0) {
      resolve(firstFighter.fighter);
      removeListners();
    }
  }
}

function setCriticalAttackTimeout(fighter, time) {
  setTimeout(() => {
    fighter.isCriticalHit = false;
  }, time);
}
