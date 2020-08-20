import Feature from "./feature";

export default class Overlap extends Feature {

  preload(wop, scene) {
  }

  create(wop) {
    wop.scene.physics.world.on('overlap', (...args) => this.listener(wop, ...args));
  }

  update(wop) {
  }

  onSocketMessage(wop, message) {
  }

  listener(wop, gameObject1, gameObject2, body1, body2) {
    if (gameObject1 === wop.me.character && wop.state.state.mudGroup.contains(gameObject2)) {
      // dirt, a bit slower
      gameObject1.player.standingOn = "mud";
      if (gameObject1 === wop.me.character) wop.me.speed = wop.me.defaultSpeed * 0.6667;
    } else if (gameObject1 === wop.me.character && wop.state.state.waterGroup.contains(gameObject2)) {
      // water, much slower
      gameObject1.player.standingOn = "water";
      if (gameObject1 === wop.me.character) wop.me.speed = wop.me.defaultSpeed * 0.3334;
    } else if (gameObject1 === wop.me.character && wop.state.state.bushGroup.contains(gameObject2)) {
      // sprite dissappear
      gameObject1.player.standingOn = "bush";
      wop.me.speed = wop.me.defaultSpeed;
    } else {
      // velocity reset
      gameObject1.player.standingOn = "grass";
      if (gameObject1 === wop.me.character) wop.me.speed = wop.me.defaultSpeed;
    }
  }
}
