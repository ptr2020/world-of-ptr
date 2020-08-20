import Feature from "./feature";
import * as Phaser from 'phaser';

export default class Chat extends Feature {
  preload(wop) {
    super.preload(wop);

    // Preload game resources here

  }
  create(wop) {
    super.create(wop);

    // Prepare scene here

  }
  update(wop) {
    super.update(wop);

    // Game frame update logic here

  }

  onSocketMessage(wop, message) {
    super.onSocketMessage(wop, message);

    // On server message received logic here
    switch (message.type) {
      case "player.say":
        // Player says something in the chat
        
        break;
    }
  }

}