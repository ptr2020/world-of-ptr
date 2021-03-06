import Feature from "./feature";
import * as Phaser from 'phaser';
import Player from "../state/player";

import * as cryptoRandomString from 'crypto-random-string';

export default class Me extends Feature {
  constructor(){
    super();
    this.inputBox = null;
  }

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
    wop.me.correlationToken = cryptoRandomString({ length: 10 });
    wop.me.name = window.localStorage.getItem('playerName');
    wop.me.character.depth = 5;
    wop.socket.send({
      type: 'player.join',
      pos: { x: wop.me.character.x, y: wop.me.character.y },
      correlationToken: wop.me.correlationToken, 
      name: wop.me.name
    });

    // Bind keyboard
    var KeyCodes = Phaser.Input.Keyboard.KeyCodes;
    wop.keyActions = wop.scene.input.keyboard.addKeys({
      moveForward: KeyCodes.UP, moveForwardAlt: KeyCodes.W,
      moveBack: KeyCodes.DOWN, moveBackAlt: KeyCodes.S,
      turnLeft: KeyCodes.LEFT, turnLeftAlt: KeyCodes.A,
      turnRight: KeyCodes.RIGHT, turnRightAlt: KeyCodes.D,
      sprint: KeyCodes.SHIFT,
      openChat: KeyCodes.ENTER,
      shoot: KeyCodes.SPACE,
      change_name: KeyCodes.N,
      show_scoreboard: KeyCodes.TAB,

      toggleDebug: KeyCodes.B,
      gameStop: KeyCodes.ESC,
      sniperMode: KeyCodes.E,
    }, false);

    wop.keyActions.toggleDebug.addListener('down', () => {
      wop.debugMode = !wop.debugMode;
    });

    wop.keyActions.change_name.addListener('down', () => {
        let newName = prompt("Vpiši ime:");
        window.localStorage.setItem("playerName", newName);
        wop.socket.send({
          type: 'player.changename',
          id: wop.me.id,
          name: newName,
        });
    });
  }

  update(wop) {
    super.update(wop);

    // Game frame update logic here
    wop.me.update();
    let currentVel = wop.me.character.body.velocity.clone();

    if (wop.me.isAlive) {
      // Prepare move vector
      var sprint = false;
      var rotating = false;
      var goingBackwards = false;
      if (wop.keyActions.sprint.isDown && !wop.keyActions.turnLeft.isDown && !wop.keyActions.turnRight.isDown) {
        // Sprint enabled
        sprint = true;
      }

      if (wop.keyActions.moveForward.isDown || wop.keyActions.moveForwardAlt.isDown) {
        // moveForward
        var vector = new Phaser.Math.Vector2(wop.me.speed, 0);
        if (sprint) vector.scale(wop.me.sprintSpeedFactor);
        vector.rotate(wop.me.angle / 180 * Math.PI);
        wop.me.character.body.velocity = vector;
      } else if (wop.keyActions.moveBack.isDown || wop.keyActions.moveBackAlt.isDown) {
        // moveBack
        var vector = new Phaser.Math.Vector2(wop.me.speed, 0);
        if (sprint) vector.scale(wop.me.sprintSpeedFactor);
        vector.scale(wop.me.backwardsSpeedFactor);
        vector.rotate(wop.me.angle / 180 * Math.PI + Math.PI);
        wop.me.character.body.velocity = vector;
        goingBackwards = true;
      } else {
        wop.me.character.body.setVelocity(0, 0);
      }

      if (wop.keyActions.turnLeft.isDown || wop.keyActions.turnLeftAlt.isDown) {
        // turnLeft
        if (wop.sniperMode){
          wop.me.angle -= wop.me.sniperTurnSpeed;
        } else {
          wop.me.angle -= wop.me.turnSpeed;
        }
        rotating = true;
      }
      if (wop.keyActions.turnRight.isDown || wop.keyActions.turnRightAlt.isDown) {
        // turnRight
        if (wop.sniperMode){
          wop.me.angle += wop.me.sniperTurnSpeed;
        }
        else {
          wop.me.angle += wop.me.turnSpeed;
        }
        rotating = true;
      }

      if (!currentVel.equals(wop.me.character.body.velocity)) {
        // Player velocity vector changed
        wop.socket.send({
          type: 'player.move',
          id: wop.me.id,
          pos: { x: wop.me.character.x, y: wop.me.character.y },
          vel: { x: wop.me.character.body.velocity.x, y: wop.me.character.body.velocity.y },
          r: goingBackwards
        });
      } else if (wop.me.character.body.velocity.length() < 0.01 && rotating) {
        // Player velocity vector is zero and we are rotating
        wop.socket.send({
          type: 'player.rotate',
          id: wop.me.id,
          dir: wop.me.angle/180 * Math.PI,
        });
      }
    }
  }

  onSocketMessage(wop, message) {
    super.onSocketMessage(wop, message);

    // On server message received logic here
    if (message.type == 'player.join' && message.correlationToken == (wop.me || {}).correlationToken) {
      wop.me.id = message.id;
      wop.me.character.x = message.pos.x;
      wop.me.character.y = message.pos.y;
      wop.me.setName(message.name);
    } else if (message.type == 'player.health') {
      // Adds / removes player health.
      if (message.id === wop.me.id) {
        wop.me.addHealth(message.deltaHealth);
      }
    } else if (message.type == "player.die") {
      if (message.id === wop.me.id) {
        wop.me.setIsAlive(false);
        wop.ui.scene.respawnText.visible = true;
        wop.ui.scene.respawnTimer.visible = true;
        let sekunde = message.respawnTime;
        wop.ui.scene.respawnTimer.text = 'You will respawn in ... ' + sekunde;
        sekunde--;
        wop.me.respawnTimeout = setInterval(() => {
          wop.ui.scene.respawnTimer.text = 'You will respawn in ... ' + sekunde.toString();
          sekunde--;
          if(sekunde == 0) clearInterval(wop.me.respawnTimeout);
        }, 1000);
      }
    } else if (message.type == "player.respawn") {
      if (message.id === wop.me.id) {
        wop.me.setIsAlive(true);
        wop.ui.scene.respawnText.visible = false;
        wop.ui.scene.respawnTimer.visible = false;
        wop.me.health = wop.me.maxHealth;
        wop.me.character.x = message.pos.x;
        wop.me.character.y = message.pos.y;
      }
    } else if (message.type == 'player.changename' && message.id == wop.me.id) {
      wop.me.setName(message.name);
    } else if (message.type == 'player.mentor' && message.clientId == wop.me.id) {
      wop.me.setMentorMode(message.mentorMode);
    }
  }
}
