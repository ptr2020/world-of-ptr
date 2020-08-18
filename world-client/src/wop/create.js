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
    

    // Display FPS:
    // game.loop.actualFps

    for (var featureName in features) {
      features[featureName].create(wop);
    }

  }
}
