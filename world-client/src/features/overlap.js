import Feature from "./feature";

export default class Overlap extends Feature {

    preload(wop, scene) { }
    create(wop) {
        wop.scene.physics.world.on('overlap', (...args) => this.listener(wop, ...args));
    }
    update(wop) { }

    onSocketMessage(wop, message) { }

    listener(wop, gameObject1, gameObject2, body1, body2) {
        if (gameObject1 === wop.me.character && wop.state.state.mudGroup.contains(gameObject2)) {
            wop.me.standingOn = "mud";
            wop.me.speed = wop.me.defaultSpeed * 0.6667;
        } else if (gameObject1 === wop.me.character && wop.state.state.waterGroup.contains(gameObject2)) {
            wop.me.standingOn = "water";
            wop.me.speed = wop.me.defaultSpeed * 0.3334;
        } else if (gameObject1 === wop.me.character && wop.state.state.bushGroup.contains(gameObject2)) {
            wop.me.standingOn = "bush";
            wop.me.speed = wop.me.defaultSpeed;
            // sprite dissappear
        } else {
            // velocity reset
            //wop.me.character.body.velocity;
            wop.me.standingOn = "grass";
            wop.me.speed = wop.me.defaultSpeed;
        }
    }
}
