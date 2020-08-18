import Feature from "./feature";
import * as Phaser from 'phaser';
import Player from "../state/player";

export default class Me extends Feature {
  preload(wop) {
    super.preload(wop);

    // Preload game resources here
    wop.scene.load.image('arrow', 'resources/arrow.png');
    wop.scene.load.image('bullet', 'resources/bullet5.png');

    wop.scene.load.atlas('gems', 'resources/gems.png', 'resources/gems.json');
    wop.scene.load.atlas('anime', 'resources/anime.png', 'resources/anime.json');

  }

  create(wop) {
    super.create(wop);

    // Animations
    var frameRate = 20;

    wop.scene.anims.create({
      key: 'anime_down',
      frames: wop.scene.anims.generateFrameNames('anime', { prefix: 'anime_down_', end: 7, zeroPad: 4 }),
      frameRate: frameRate,
      repeat: -1,
    });
    wop.scene.anims.create({
      key: 'anime_left',
      frames: wop.scene.anims.generateFrameNames('anime', { prefix: 'anime_left_', end: 7, zeroPad: 4 }),
      frameRate: frameRate,
      repeat: -1
    });
    wop.scene.anims.create({
      key: 'anime_right',
      frames: wop.scene.anims.generateFrameNames('anime', { prefix: 'anime_right_', end: 7, zeroPad: 4 }),
      frameRate: frameRate,
      repeat: -1
    });
    wop.scene.anims.create({
      key: 'anime_up',
      frames: wop.scene.anims.generateFrameNames('anime', { prefix: 'anime_up_', end: 7, zeroPad: 4 }),
      frameRate: frameRate,
      repeat: -1
    });

    // Prepare scene here
    wop.me = new Player(wop, "1", "Duhec", 300, 200, 0, true);

    // Bind keyboard
    var KeyCodes = Phaser.Input.Keyboard.KeyCodes;
    wop.keyActions = wop.scene.input.keyboard.addKeys({
      moveForward: KeyCodes.UP,
      moveBack: KeyCodes.DOWN,
      turnLeft: KeyCodes.LEFT,
      turnRight: KeyCodes.RIGHT,

      gameStop: KeyCodes.ESC,
    });

  }

  update(wop) {
    super.update(wop);

    // Game frame update logic here

    wop.me.update();

    if (wop.keyActions.moveForward.isDown) {
      // moveForward
      var vector = new Phaser.Math.Vector2(400, 0);
      vector.rotate(wop.me.angle/180*Math.PI);
      wop.me.character.body.velocity = vector;
    } else if (wop.keyActions.moveBack.isDown) {
      // moveBack
      var vector = new Phaser.Math.Vector2(-250, 0);
      vector.rotate(wop.me.angle/180*Math.PI);
      wop.me.character.body.velocity = vector;
    } else {
      wop.me.character.body.setVelocity(0, 0);
    }
    if (wop.keyActions.turnLeft.isDown) {
      // turnLeft
      wop.me.angle -= 5;
    }
    if (wop.keyActions.turnRight.isDown) {
      // turnRight
      wop.me.angle += 5;
    }

    if (wop.keyActions.gameStop.isDown) {
      wop.game.isRunning = false;
      wop.game.destroy();
      console.log("Game destroyed.");
    }

  }

  onSocketMessage(wop, message) {
    super.onSocketMessage(wop, message);

    // On server message received logic here

  }

}