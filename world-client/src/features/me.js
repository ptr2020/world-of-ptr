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
      frameRate: 20,
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
      moveForward: KeyCodes.UP, moveForwardAlt: KeyCodes.W,
      moveBack: KeyCodes.DOWN, moveBackAlt: KeyCodes.S,
      turnLeft: KeyCodes.LEFT, turnLeftAlt: KeyCodes.A,
      turnRight: KeyCodes.RIGHT, turnRightAlt: KeyCodes.D,
      sprint: KeyCodes.SHIFT,

      toggleDebug: KeyCodes.B,
      gameStop: KeyCodes.ESC,
    });


    wop.keyActions.toggleDebug.addListener('down', () => {
      wop.debugMode = !wop.debugMode;
    });

  }

  update(wop) {
    super.update(wop);

    // Game frame update logic here

    wop.me.update();
    let currentVel = wop.me.character.body.velocity.clone();

    // Prepare move vector
    var sprint = false;
    if (wop.keyActions.sprint.isDown && !wop.keyActions.turnLeft.isDown && !wop.keyActions.turnRight.isDown) {
      // Sprint enabled
      sprint = true;
    }


    if (wop.keyActions.moveForward.isDown || wop.keyActions.moveForwardAlt.isDown) {
      // moveForward
      var vector = new Phaser.Math.Vector2(wop.me.speed, 0);
      if (sprint) vector.scale(wop.me.sprintSpeedFactor);
      vector.rotate(wop.me.angle/180*Math.PI);
      wop.me.character.body.velocity = vector;
    } else if (wop.keyActions.moveBack.isDown || wop.keyActions.moveBackAlt.isDown) {
      // moveBack
      var vector = new Phaser.Math.Vector2(wop.me.speed, 0);
      if (sprint) vector.scale(wop.me.sprintSpeedFactor);
      vector.scale(wop.me.backwardsSpeedFactor);
      vector.rotate(wop.me.angle/180*Math.PI + Math.PI);
      wop.me.character.body.velocity = vector;
    } else {
      wop.me.character.body.setVelocity(0, 0);
    }

    if (wop.keyActions.turnLeft.isDown || wop.keyActions.turnLeftAlt.isDown) {
      // turnLeft
      wop.me.angle -= wop.me.turnSpeed;
    }
    if (wop.keyActions.turnRight.isDown || wop.keyActions.turnRightAlt.isDown) {
      // turnRight
      wop.me.angle += wop.me.turnSpeed;
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
      wop.me.setName(message.name);
    }

  }

}