import * as SimplexNoise from "simplex-noise";
import * as random from "random";
import * as seedrandom from "seedrandom";

export default class State {

  constructor(wop) {
    this.wop = wop;
    this.terrainFrequency = 0.1;
    this.state = {
      players: [],
      playersGroup: null,
      bullets: [],
      gameSeed: "211231334",
      worldTiles: [],
      tileSize: 0.25
    };
  }

  generateWorld(wop) {
    // gre skozi vsa polja
    for (let i = 0; i < 65; i++) {
      this.state.worldTiles[i] = [];
    }
    // GRASS and MUD
    for (let i = 0; i < 65; i++) {
      for (let j = 0; j < 65; j++) {
        this.state.worldTiles[i][j] = { tileType: 0 };
        var item = this.state.worldTiles[i][j].tileType;
        // algoritem
        var simplex = new SimplexNoise(this.state.gameSeed), value2d = simplex.noise2D(i * this.terrainFrequency, j * this.terrainFrequency);
        value2d += 1;
        value2d = value2d / 2;
        if (value2d < 0.7) {

          this.state.worldTiles[i][j].tileType = TILE_TYPES.GRASS_BIOME;
        } else {
          this.state.worldTiles[i][j].tileType = TILE_TYPES.MUD_BIOME;
        }
      }
    }
    // WATER and OBSTACLE
    for (let i = 0; i < 65; i++) {
      for (let j = 0; j < 65; j++) {
        var item = this.state.worldTiles[i][j].tileType;
        // algoritem
        var simplex = new SimplexNoise(this.state.gameSeed), value2d = simplex.noise2D(i * this.terrainFrequency, j * this.terrainFrequency);
        value2d += 1;
        value2d = value2d / 2;

        if (value2d < 0.1) {
          this.state.worldTiles[i][j].tileType = TILE_TYPES.WATER_BIOME;
        } else if (value2d >= 0.9) {
          this.state.worldTiles[i][j].tileType = TILE_TYPES.OBSTACLE;
        }
      }
    }

    random.use(seedrandom(this.state.gameSeed));

    // da BUSHES
    for (let i = 0; i < 65; i++) {
      for (let j = 0; j < 65; j++) {
        // algoritem
        var randomNum = random.float();
        if (randomNum < 0.05) {
          this.state.worldTiles[i][j].tileType = TILE_TYPES.BUSH;
        }
      }
    }
    // end of da BUSHES

    // hardcode shop tiles
    var shop_id = TILE_TYPES.SHOP_TILE;
    for (let t = 8; t < 65; t += 11) {
      for (let u = 8; u < 65; u += 11) {
        this.state.worldTiles[t][u].tileType = shop_id;
      }
    }

  }

  getPlayers() {
    return this.state.players;
  }

  addPlayer(player) {
    this.state.players.push(player);
    this.state.playersGroup.add(player.character);
  }

  removePlayer(playerId) {
    var playerIndex = this.state.players.findIndex((x) => x.id === playerId);
    this.state.playersGroup.remove(this.state.players[playerIndex].character);
    this.state.players[playerIndex].destroy();
    this.state.players.splice(playerIndex, 1);
  }
}

export const TILE_TYPES = {
  GRASS_BIOME: 0,
  MUD_BIOME: 1,
  WATER_BIOME: 2,
  BUSH: 3,
  OBSTACLE: 4,
  SHOP_TILE: 5,
};
