import Feature from "./feature";
import * as Phaser from 'phaser';

export default class Sounds extends Feature {
  preload(wop, scene) {
    super.preload(wop);

    // Preload game resources here
    wop.scene.load.audio('BGMusic', 'resources/audio/Outside.ogg');
    wop.scene.load.audio('Grass1', 'resources/audio/Walkongrass.ogg');
    wop.scene.load.audio('Grass2', 'resources/audio/Walkongrass2.wav');

  }
  create(wop) {
    super.create(wop);
    

    // Prepare scene here
    var bgMusic = wop.scene.sound.add('BGMusic');
    bgMusic.setLoop(true);
    bgMusic.setVolume(0.6); // 60% volume
    bgMusic.play();
  }

  update(wop) {
    super.update(wop);
    // Game frame update logic here
    listener(wop, gameObject1, gameObject2, body1, body2); {
      if (wop.state.state.mudGroup.contains(gameObject2)) {
        var grass1 = wop.scene.sound.add('Grass1');
        grass1.setLoop(false);
        grass1.setVolume(0.6);
        grass1.play();
        
    }

      }
    }

  }

  onSocketMessage(wop, message); {
    //super.onSocketMessage(wop, message);

    // On server message received logic here

  }


