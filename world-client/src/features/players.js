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
        wop.state.addPlayer(new Player(wop, message.id, message.name, message.pos.x, message.pos.y, 0, false));
        break;

      case 'player.leave':
        // Remove the player
        wop.state.removePlayer(message.id);
        break;

      case 'player.move':
        // Move the player
        player = wop.state.getPlayers().find((x) => x.id === message.id);
        if (!player)
          return;

        player.character.x = message.pos.x;
        player.character.y = message.pos.y;
        player.character.body.setVelocity(message.vel, 0);
        player.character.body.velocity.setAngle(player.angle/180*Math.PI);

        /*
        var vector = new Phaser.Math.Vector2(message.vel.x, message.vel.y);
        if (vector.length() > 0) {
          player.angle = (vector.angle()) / (2*Math.PI) * 360;
        }
        */
        break;

      case 'player.rotate':
        // Rotate the player
        player = wop.state.getPlayers().find((x) => x.id === message.id);
        if (!player) return;
        player.angle = message.angle;
        player.angleVel = message.vel;
        player.character.body.velocity.setAngle(player.angle/180*Math.PI);
        //player.character.body.setVelocity(player.character.body.vel.length(), 0);
        //player.character.body.velocity.rotate(player.angle);
        break;


      case 'player.changename':
        if (message.id != wop.me.id) {
          player = wop.state.getPlayers().find((x) => x.id === message.id);
          if (!player) return;
          player.setName(message.name);
        }
        break;
    }
  }

}