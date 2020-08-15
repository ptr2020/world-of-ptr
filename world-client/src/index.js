import * as Phaser from 'phaser';
import preload from './wop/preload';
import create from './wop/create';
import update from './wop/update';

// We'll use wop as a namespace for game objects
var wop = {
  debug: {}
};
window.wop = wop;

var gameConfig = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  scale: {
    mode: Phaser.Scale.FIT,
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

wop.game = new Phaser.Game(gameConfig);
wop.debug.Phaser = Phaser;

