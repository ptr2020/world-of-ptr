import * as Phaser from 'phaser';

export default function create(wop) {
  return function() {

    // Prepare scene
    console.log("Preparing scene");

    // Background
    this.add.image(1920/2 +160, 1920/2 +160, 'grid');

    // World bounds
    this.cameras.main.setBounds(0, 0, 1920, 1920);
    this.physics.world.setBounds(0, 0, 1920, 1920);

    // Blocks for fun
    wop.blocks = [];
    for (var i = 0; i < 100; i++) {
      var block = this.physics.add.image(400 + i * 24, 300, 'block');
      block.scale = 0.25;
      wop.blocks.push(block);
    }

    // Arrow
    wop.arrow = this.physics.add.image(300, 200, 'arrow');
    wop.arrow.setVelocity(0, 0);
    wop.arrow.setBounce(1, 1);
    wop.arrow.setCollideWorldBounds(true);

    // Bind keyboard
    var KeyCodes = Phaser.Input.Keyboard.KeyCodes;
    wop.keyActions = this.input.keyboard.addKeys({
      moveForward: KeyCodes.UP,
      moveBack: KeyCodes.DOWN,
      turnLeft: KeyCodes.LEFT,
      turnRight: KeyCodes.RIGHT,

      gameStop: KeyCodes.ESC,
    });

    var roundPixels = false;
    this.cameras.main.startFollow(wop.arrow, roundPixels, 0.08, 0.08);
    this.cameras.main.setZoom(1.5);

    //game.loop.actualFps
    wop.text = this.add.text(0, 0, 'Hello World', { fontFamily: 'Arial' });



  }
}
