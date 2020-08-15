var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
    render: render,
  }
};


var game = new Phaser.Game(config);
window.game = game;

var wop = {};
window.wop = wop;

function preload () {
  this.load.setBaseURL('/');

  /*
  this.load.image('sky', 'img/space3.png');
  this.load.image('logo', 'img/phaser3-logo.png');
  this.load.image('red', 'img/red.png');
  */

  this.load.image('grid', 'img/grid.png');

  this.load.image('arrow', 'img/arrow.png');
  this.load.image('block', 'img/block.png');
  this.load.image('block2', 'img/block2.png');

  //this.load.spritesheet('tiles', 'img/grid.png', {frameWidth: 1920, frameHeight: 1920});

  //console.log("preload this", this);

}

function create () {

  this.physics.add.image(1920/2 +160, 1920/2 +160, 'grid');
  this.cameras.main.setBounds(0, 0, 1920, 1920);
  this.physics.world.setBounds(0, 0, 1920, 1920);

  /*
  this.add.image(400, 300, 'sky');

  var logo = this.physics.add.image(400, 100, 'logo');

  logo.setVelocity(100, 200);
  logo.setBounce(1, 1);
  logo.setCollideWorldBounds(true);

  var particles = this.add.particles('red');
  var emitter = particles.createEmitter({
    speed: 100,
    scale: { start: 1, end: 0 },
    blendMode: 'ADD'
  });
  emitter.startFollow(logo);

  */

  /*
  game.add.tileSprite(0, 0, 1920, 1920, 'background');
  game.world.setBounds(0, 0, 1920, 1920);
  game.physics.startSystem(Phaser.Physics.P2JS);
  player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
  game.physics.p2.enable(player);
  cursors = game.input.keyboard.createCursorKeys();
  game.camera.follow(player);
  */


  //var groundTiles = map.addTilesetImage('tiles');

  //var map = this.make.tilemap({key: 'map'});
  //var groundTiles = map.addTilesetImage('tiles');
  //var groundLayer = map.createDynamicLayer('World', groundTiles, 0, 0);
  //groundLayer.setCollisionByExclusion([-1]);


  //var map = this.make.tilemap({ key: 'map' });
  //var tileset = map.addTilesetImage('SuperMarioBros-World1-1', 'tiles1');
  //var layer = map.createStaticLayer('World1', tileset, 0, 0);
  //cursors = this.input.keyboard.createCursorKeys();

  // ship = this.physics.add.image(400, 100, 'ship').setAngle(90).setCollideWorldBounds(true);
  //ship = this.add.image(400, 100, 'ship').setAngle(90);

  wop.blocks = [];
  for (var i = 0; i < 100; i++) {
    var block = this.physics.add.image(400 + i * 24, 300, 'block');
    block.scale = 0.25;
    wop.blocks.push(block);
  }

  wop.arrow = this.physics.add.image(300, 200, 'arrow');
  wop.arrow.setVelocity(0, 0);
  wop.arrow.setBounce(1, 1);
  wop.arrow.setCollideWorldBounds(true);



  wop.arrowKeys = this.input.keyboard.createCursorKeys();
  //console.log("arrowKeys", arrowKeys);

  var roundPixels = false;
  this.cameras.main.startFollow(wop.arrow, roundPixels, 0.08, 0.08);
  this.cameras.main.setZoom(1.5);


  console.log("this", this);

  //game.loop.actualFps
  wop.text = this.add.text(0, 0, 'Hello World', { fontFamily: 'Arial' });


  console.log("text", wop.text);
}

function update() {
  /*
  if (arrowKeys.up.isDown) {
    var vector = new Phaser.Math.Vector2(1000, 0);
    vector.rotate(arrow.angle/180*Math.PI);
    arrow.body.acceleration = vector;
  } else if (arrowKeys.down.isDown) {
    var vector = new Phaser.Math.Vector2(-500, 0);
    vector.rotate(arrow.angle/180*Math.PI);
    arrow.body.acceleration = vector;
  } else {
    if (arrow.body.velocity.length() > 1) {
      var vector = arrow.body.velocity.clone().rotate(Math.PI).scale(5);
      arrow.body.acceleration = vector;
    } else {
      arrow.body.setAcceleration(0, 0);
      arrow.body.setVelocity(0, 0);
    }
  }
  */
  if (wop.arrowKeys.up.isDown) {
    var vector = new Phaser.Math.Vector2(400, 0);
    vector.rotate(wop.arrow.angle/180*Math.PI);
    wop.arrow.body.velocity = vector;
  } else if (wop.arrowKeys.down.isDown) {
    var vector = new Phaser.Math.Vector2(-250, 0);
    vector.rotate(wop.arrow.angle/180*Math.PI);
    wop.arrow.body.velocity = vector;
  } else {
    wop.arrow.body.setVelocity(0, 0);
  }
  if (wop.arrowKeys.left.isDown) {
    wop.arrow.angle -= 5;
  }
  if (wop.arrowKeys.right.isDown) {
    wop.arrow.angle += 5;
  }
}

function render() {
  game.debug.cameraInfo(game.camera, 32, 32);
  //game.debug.spriteCoords(arrow, 32, 500);
}