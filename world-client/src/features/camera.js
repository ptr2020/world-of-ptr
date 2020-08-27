import Feature from "./feature";
import * as Phaser from 'phaser';

export default class Camera extends Feature {
  preload(wop) {
    super.preload(wop);

    // Preload game resources here

  }

  create(wop) {
    super.create(wop);

    // Prepare scene here

    // World bounds
    wop.scene.cameras.main.setBounds(0, 0, 1920, 1920);
    wop.scene.physics.world.setBounds(0, 0, 1920, 1920);

    var roundPixels = false;
    wop.scene.cameras.main.startFollow(wop.me.character, roundPixels, 0.08, 0.08);
    wop.scene.cameras.main.setZoom(2);

    // Prevent native browser zoom
    document.addEventListener('wheel', (event) => {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
      }
    }, { passive: false });

    document.addEventListener('keydown', (event) => {
      if ((event.ctrlKey || event.metaKey) && (event.key === '+' || event.key === '-')) {
        event.preventDefault();
      }
    }, { passive: false });
  }

  update(wop) {
    super.update(wop);

    // Game frame update logic here

  }

  onSocketMessage(wop, message) {
    super.onSocketMessage(wop, message);

    // On server message received logic here

  }

}