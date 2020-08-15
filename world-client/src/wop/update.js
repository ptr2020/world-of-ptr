import * as Phaser from "phaser";

export default function update(wop) {
  return function() {

    // Game frame update logic

    if (wop.keyActions.moveForward.isDown) {
      // moveForward
      var vector = new Phaser.Math.Vector2(400, 0);
      vector.rotate(wop.arrow.angle/180*Math.PI);
      wop.arrow.body.velocity = vector;
    } else if (wop.keyActions.moveBack.isDown) {
      // moveBack
      var vector = new Phaser.Math.Vector2(-250, 0);
      vector.rotate(wop.arrow.angle/180*Math.PI);
      wop.arrow.body.velocity = vector;
    } else {
      wop.arrow.body.setVelocity(0, 0);
    }
    if (wop.keyActions.turnLeft.isDown) {
      // turnLeft
      wop.arrow.angle -= 5;
    }
    if (wop.keyActions.turnRight.isDown) {
      // turnRight
      wop.arrow.angle += 5;
    }

    if (wop.keyActions.gameStop.isDown) {
      wop.game.destroy();
      console.log("Game destroyed.");
    }

  }
}
