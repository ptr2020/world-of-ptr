import * as Phaser from 'phaser';
import State from "../state/state";
import Player from "../state/player";
import features from "../features";

export default function create(wop) {
  return function() {

    // Prepare scene
    console.log("Preparing scene");

    wop.state = new State(wop);

    // Background
    var bg = this.add.image(1920/2 +160, 1920/2 +160, 'grid');
    //var bg = this.add.image(1920/2 +160, 1920/2 +160, 'grassA01');
    //bg.setScale(3, 3);


    // Blocks for fun
    /*
    wop.blocks = [];
    for (var i = 0; i < 100; i++) {
      var block = this.physics.add.image(400 + i * 24, 300, 'block');
      block.scale = 0.25;
      wop.blocks.push(block);
    }
    */

    // Display FPS:
    // game.loop.actualFps

    for (var featureName in features) {
      features[featureName].create(wop);
    }

  }
}
