import Feature from "./feature";
import * as Phaser from 'phaser';
import Player from "../state/player";

export default class Me extends Feature {
  preload(wop) {
    super.preload(wop);

    // Preload game resources here
    wop.scene.load.image('arrow', 'resources/arrow.png');

    wop.scene.load.atlas('gems', 'resources/gems.png', 'resources/gems.json');
    wop.scene.load.atlas('anime', 'resources/anime.png', 'resources/anime.json');
    wop.scene.load.atlas('yeehaw', 'resources/Yeehaw.png', 'resources/Yeehaw.json');

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

    wop.scene.anims.create({
      key: 'yeehaw_move',
      frames: wop.scene.anims.generateFrameNames('yeehaw', { prefix: 'move_', end: 4, zeroPad: 4 }),
      frameRate: 10,
      repeat: -1,
    });


    // Prepare scene here
    wop.me = new Player(wop, null, null, 300, 200, 0, true);
    wop.me.correlationToken = (new Date().getMilliseconds()).toString();
    wop.socket.send({
      type: 'player.join',
      pos: { x: wop.me.character.x, y: wop.me.character.y },
      correlationToken: wop.me.correlationToken
    });

    // Bind keyboard
    var KeyCodes = Phaser.Input.Keyboard.KeyCodes;
    wop.keyActions = wop.scene.input.keyboard.addKeys({
      moveForward: KeyCodes.W,
      moveBack: KeyCodes.S,
      turnLeft: KeyCodes.A,
      turnRight: KeyCodes.D,
      shift: KeyCodes.SHIFT,

      gameStop: KeyCodes.ESC,
    });

  }

  update(wop) {
    super.update(wop);

    // Game frame update logic here

    wop.me.update();
    let currentVel = wop.me.character.body.velocity.clone();
    var sprint = false;
    if (wop.keyActions.moveForward.isDown) {
      // moveForward
      var vector = new Phaser.Math.Vector2(200, 0);
      if (wop.keyActions.shift.isDown) {
        //sprint
        vector = new Phaser.Math.Vector2(350, 0);
        sprint = true;
      }
      if (wop.keyActions.shift.isUp){
        sprint = false;
      }
      if (wop.keyActions.turnLeft.isDown) {
        sprint = false;
      }
      if (wop.keyActions.turnRight.isDown) {
        sprint = false;
      }
      if (sprint == false){
        vector = new Phaser.Math.Vector2(200, 0);
      }
      vector.rotate(wop.me.angle/180*Math.PI);
      wop.me.character.body.velocity = vector;
    } else if (wop.keyActions.moveBack.isDown) {
      // moveBack
      var vector = new Phaser.Math.Vector2(-150, 0);
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

    if (!currentVel.equals(wop.me.character.body.velocity)) {
      wop.socket.send({
        type: 'player.move',
        id: wop.me.id,
        pos: { x: wop.me.character.x, y: wop.me.character.y },
        vel: { x: wop.me.character.body.velocity.x, y: wop.me.character.body.velocity.y }
      });
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
    if (message.type == 'player.join' && message.correlationToken == (wop.me || {}).correlationToken) {
      wop.me.id = message.id;
      wop.me.name = message.name;
      wop.me.nameText.setText(message.name);
    }

  }

}