import { createElement } from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
  const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
  const fighterElement = createElement({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`
  });

  if (fighter) {
    const { name, health, attack, defense } = fighter;
    const fighterImage = createFighterImage(fighter);
    const fighterName = createElement({ tagName: 'div', className: 'fighter-preview___description' });
    fighterName.textContent = `Name: ${name}`;
    const fighterAttack = createElement({ tagName: 'div', className: 'fighter-preview___description' });
    fighterAttack.textContent = `Attack: ${attack}`;
    const fighterDefense = createElement({ tagName: 'div', className: 'fighter-preview___description' });
    fighterDefense.textContent = `Defense: ${defense}`;
    const fighterHealth = createElement({ tagName: 'div', className: 'fighter-preview___description' });
    fighterHealth.textContent = `Health: ${health}`;

    fighterElement.append(fighterImage, fighterName, fighterHealth, fighterAttack, fighterDefense);
  }

  return fighterElement;
}

export function createFighterImage(fighter) {
  const { source, name } = fighter;
  const attributes = {
    src: source,
    title: name,
    alt: name
  };
  const imgElement = createElement({
    tagName: 'img',
    className: 'fighter-preview___img',
    attributes
  });

  return imgElement;
}
