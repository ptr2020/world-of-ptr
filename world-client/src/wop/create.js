import * as Phaser from 'phaser';
import State from "../state/state";
import Player from "../state/player";
import features from "../features";
import {TILE_TYPES} from "../state/state";


/**
 * To je funkcija, ki se zažene, ko ustvarimo glavni objekt za igro.
 * Tukaj pišite vso kodo, ki se jo izvede samo enkrat pri začetku igre kot npr.
 * postavljanje sveta, nalaganje različnih artiklov v trgovini itd.
 */

export default function create(wop) {
  return function () {

    // Prepare scene
    console.log("Preparing scene");

    wop.state = new State(wop);

    // Generate the world into worldTiles
    wop.state.generateWorld();

    // Populate using this.add.image and offsets
    // use this.add.image(x, y, 'example').setOrigin(0, 0) in order to set the origin to the upper left corner
    // You can access the world tiles using wop.state.worldTiles

    var platforms = this.physics.add.staticGroup();
    wop.state.state.mudGroup = this.physics.add.staticGroup();
    wop.state.state.grassGroup = this.physics.add.staticGroup();
    wop.state.state.waterGroup = this.physics.add.staticGroup();
    wop.state.state.bushGroup = this.physics.add.staticGroup();
    wop.state.state.storeGroup = this.physics.add.staticGroup();

    var pixels = this.textures.get('grass').getSourceImage().width * wop.state.state.tileSize;
    for (var y = 0; y < wop.state.state.worldTiles.length; y++) {
      for (var x = 0; x < wop.state.state.worldTiles.length; x++) {
        var image;
        switch (wop.state.state.worldTiles[y][x].tileType) {
          case TILE_TYPES.GRASS_BIOME:
            // grass
            image = wop.state.state.grassGroup.create(x * pixels, y * pixels, 'grass');
            break;
          case TILE_TYPES.MUD_BIOME:
            // dirt
            image = wop.state.state.mudGroup.create(x * pixels, y * pixels, 'dirt');
            break;
          case TILE_TYPES.WATER_BIOME:
            // water
            image = wop.state.state.waterGroup.create(x * pixels, y * pixels, 'water');
            break;
          case TILE_TYPES.BUSH:
            // bush
            image = wop.state.state.bushGroup.create(x * pixels, y * pixels, 'bush');
            break;
          case TILE_TYPES.OBSTACLE:
            // rock
            image = platforms.create(x * pixels, y * pixels, 'rock');
            break;
          case TILE_TYPES.SHOP_TILE:
            // shop
            image = wop.state.state.storeGroup.create(x * pixels, y * pixels, 'shop');
            break;
        }
        image.setScale(wop.state.state.tileSize, wop.state.state.tileSize).setOrigin(0, 0).refreshBody();
        
      }
    }       

    // Display FPS:
    // game.loop.actualFps

    for (var featureName in features) {
      features[featureName].create(wop);
    }

    this.physics.add.collider(wop.me.character, platforms);
    this.physics.add.overlap(wop.me.character, wop.state.state.mudGroup);
    this.physics.add.overlap(wop.me.character, wop.state.state.waterGroup);
    this.physics.add.overlap(wop.me.character, wop.state.state.bushGroup);
    this.physics.add.overlap(wop.me.character, wop.state.state.grassGroup);
    this.physics.add.overlap(wop.me.character, wop.state.state.storeGroup);
  }
}
