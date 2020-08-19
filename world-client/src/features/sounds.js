import Feature from "./feature";
import * as Phaser from 'phaser';

export default class Sounds extends Feature {
  preload(wop) {
    super.preload(wop);

    // Preload game resources here
    wop.scene.load.audio('BGMusic', 'resources/audio/Outside.ogg');

  }
  create(wop) {
    super.create(wop);

    // Prepare scene here
    wop.scene.sound.play('BGMusic');

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
