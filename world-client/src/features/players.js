import Feature from "./feature";
import * as Phaser from 'phaser';
import Player from "../state/player";

export default class Players extends Feature {
  preload(wop) {
    super.preload(wop);

    // Preload game resources here
    wop.scene.load.image('cowboy', 'resources/yeehaw1Mid.png');
  }

  create(wop) {
    super.create(wop);

    // Prepare scene here
    wop.state.state.playersGroup = wop.scene.physics.add.staticGroup();
    wop.scene.physics.add.overlap(wop.state.state.playersGroup, wop.state.state.bushGroup);
    wop.scene.physics.add.overlap(wop.state.state.playersGroup, wop.state.state.grassGroup);
    wop.scene.physics.add.overlap(wop.state.state.playersGroup, wop.state.state.mudGroup);
    wop.scene.physics.add.overlap(wop.state.state.playersGroup, wop.state.state.waterGroup);
    wop.scene.physics.add.collider(wop.state.state.playersGroup, wop.state.state.rockGroup);
  }

  update(wop) {
    super.update(wop);

    // Game frame update logic here

    // Update all players
    for (var pIdx in wop.state.getPlayers()) {
      var player = wop.state.getPlayers()[pIdx];
      player.update();
    }
  }

  onSocketMessage(wop, message) {
    super.onSocketMessage(wop, message);

    // On server message received logic here
    let player;
    switch (message.type) {
      case 'player.join':
        // Join the player
        if (message.correlationToken == wop.me.correlationToken) {
          return;
        }
        var newplayer = new Player(wop, message.id, message.name, message.pos.x, message.pos.y, 0, false);
        wop.state.addPlayer(newplayer);
        var copyOfPlayers = wop.state.state.players
        for (let index = 0; index < copyOfPlayers.length; index++) {
          const element = copyOfPlayers[index];
          if (element.id == message.id) {
            wop.scene.physics.add.collider(wop.me.character, wop.state.state.players[index].character);
          }
        }
        newplayer.update();

        /*if (wop.state.getPlayers() != []) {
          //wop.state.state.playersGroup = this.physics.add.dynamicGroup();
          wop.state.getPlayers().forEach(element => {
            wop.scene.physics.add.collider(wop.me.character.body, element.character.body);
          });
        }*/
        break;

      case 'player.leave':
        // Remove the player
        wop.state.removePlayer(message.id);
        break;

      case 'player.move':
        // Move the player
        player = wop.state.getPlayers().find((x) => x.id === message.id && x.id !== wop.me.id);
        if (!player) return;

        player.serverPosition = message.pos;
        player.character.body.setVelocity(message.vel.x, message.vel.y);
        player.messageReceiveTime = Date.now();
        player.messageProcessed = false;

        var vector = new Phaser.Math.Vector2(message.vel.x, message.vel.y);
        if (vector.length() > 0) {
          var goingBackRotation = message.r ? 180 : 0;
          player.angle = (vector.angle()) / (2*Math.PI) * 360 + goingBackRotation;
        }

        break;

      case 'player.rotate':
        // Move the player
        player = wop.state.getPlayers().find((x) => x.id === message.id && x.id !== wop.me.id);
        if (!player) return;
        player.angle = message.dir / Math.PI * 180;
        break;

      case 'player.changename':
        if (message.id != wop.me.id) {
          let player = wop.state.getPlayers().find((x) => x.id === message.id);
          if (!player)
            return;
          player.setName(message.name);
        }
        break;

      case 'player.health':
        // Adds / removes player health.
        player = wop.state.getPlayers().find((x) => x.id === message.id && x.id !== wop.me.id);
        if (!player) return;
        player.addHealth(message.deltaHealth);
        break;

      case 'player.die':
        player = wop.state.getPlayers().find((x) => x.id === message.id && x.id !== wop.me.id);
        if (!player) return;
        player.setIsAlive(false);
        break;

      case 'player.respawn':
        player = wop.state.getPlayers().find((x) => x.id === message.id && x.id !== wop.me.id);
        if (!player) return;
        player.setIsAlive(true);
        player.character.x = message.pos.x;
        player.character.y = message.pos.y;
        break;
      
      case 'player.sniper':
        // Sniper weapon logic
        break;

      case 'player.mentor':
        player = wop.state.getPlayers().find((x) => x.id === message.clientId && x.id !== wop.me.id);
        if (!player) return;
        player.setMentorMode(message.mentorMode);
        break;
    }
  }
}
