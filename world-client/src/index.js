import * as Phaser from 'phaser';
import Socket from "./networking/socket";
import preload from './wop/preload';
import create from './wop/create';
import update from './wop/update';

// We'll use wop as a namespace for game objects
var wop = {
  debug: {},
  debugMode: false,
  sniperMode: false,
};

window.wop = wop;

// Prepare Phaser game configuration
var gameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
  },
  scene: {
    preload: preload(wop),
    create: create(wop),
    update: update(wop),
  }
};

// Create the game
wop.game = new Phaser.Game(gameConfig);

wop.socket = new Socket(wop);
wop.socket.connect();

// window resize logika
window.addEventListener('resize', () => {
  wop.game.scale.resize(window.innerWidth, window.innerHeight);
});


// *** Mock for echo server ***
var mockJaka = false;
if (mockJaka) {
  setTimeout(() => {
    if (wop.socket.isConnected()) {
      // player.join - Pošljemo v resnici samo
      //wop.socket.send({
      //  type: "player.join",
      //  name: "Duhec",
      //});

      wop.socket.send({
        type: "player.join",
        id: "12345",
        pos: { x: 100, y: 200 },
        name: "Duhec",
      });
      wop.socket.send({
        type: "player.join",
        id: "12346",
        pos: { x: 200, y: 200 },
        name: "Jaka",
      });


      // player.move - Pošljemo v resnici samo
      //wop.socket.send({
      //  type: "player.move",
      //  pos: { x: 100, y: 200 },
      //  vel: { x: 5, y: 5 },
      //});

      var jakaX = 200, jakaY = 300;
      var velX = 0, velY = 7;
      var perSecs = 10;
      var count = 0;
      var intervalH = setInterval(() => {
        if (!wop.game.isRunning) return;
        jakaX += velX;
        jakaY += velY;

        var vector = new Phaser.Math.Vector2(velX, velY);
        vector.rotate(-Math.PI/50);
        //velX = velX + Math.random() -0.5;
        //velY = velY + Math.random() -0.5;
        velX = vector.x;
        velY = vector.y;

        wop.socket.send({
          type: "player.move",
          id: "12346",
          pos: { x: jakaX, y: jakaY },
          vel: { x: velX*perSecs, y: velY*perSecs },
        });

        count++;
        if (count > 30) {
          wop.socket.send({
            type: "player.leave",
            id: "12346",
          });
          clearInterval(intervalH);
        }
      }, 1000/perSecs);


    }
  }, 1000);
}

// Add Phaser into object for console debugging/testing
wop.debug.Phaser = Phaser;


