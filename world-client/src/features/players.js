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
        player = wop.state.getPlayers().find((x) => x.id === message.id && x.id !== wop.me.id);
        if (!player) return;

        player.serverPosition = message.pos;
        player.character.body.setVelocity(message.vel.x, message.vel.y);

        var vector = new Phaser.Math.Vector2(message.vel.x, message.vel.y);
        if (vector.length() > 0) {
          player.angle = (vector.angle()) / (2*Math.PI) * 360;
        }
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
    }
  }
}
