import Feature from "./feature";

export default class Game extends Feature {
  preload(wop, scene) {}

  create(wop) {}

  update(wop) {}

  onSocketMessage(wop, message) {
    switch(message.type) {
      case "game.time.start":
        wop.state.state.startGameTime = new Date(message.startGameTime);
        break;
    }
  }
}
