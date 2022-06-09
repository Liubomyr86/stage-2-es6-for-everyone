import App from '../../app';
import { createFighterImage } from '../fighterPreview';
import { showModal } from './modal';

export function showWinnerModal(fighter) {
  const fighterImage = createFighterImage(fighter);

  function startNewGame() {
    App.rootElement.innerHTML = '';
    App.startApp();
  }

  showModal({ title: `${fighter.name} win!`, bodyElement: fighterImage, onClose: startNewGame });
}
