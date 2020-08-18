import Feature from "./feature";
import * as Phaser from 'phaser';
import Player from "../state/player";

export default class Players extends Feature {
  preload(wop) {
    super.preload(wop);

    // Preload game resources here
    wop.scene.load.image('arrow', 'resources/arrow.png');
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
    switch (message.type) {
      case "player.join":
        // Join the player
        if (message.correlationToken == wop.me.correlationToken) {
          return;
        }

        wop.state.addPlayer(new Player(wop, message.id, message.name, message.pos.x, message.pos.y, 0, false));
        break;
      case "player.leave":
        // Remove the player
        wop.state.removePlayer(message.id);
        break;
      case "player.move":
        // Move the player
        let player = wop.state.getPlayers().find((x) => x.id === message.id);
        if (!player)
          return;

        player.character.x = message.pos.x;
        player.character.y = message.pos.y;
        player.character.body.setVelocity(message.vel.x, message.vel.y);

        var vector = new Phaser.Math.Vector2(message.vel.x, message.vel.y);
        player.character.rotation = vector.angle();
        break;
    }
  }

}