import Players from "./players";
import Me from "./me";
import Camera from "./camera";
import Chat from "./chat";
import Scoreboard from "./scoreboard";
import Overlap from "./overlap";
import Shooting from "./shooting";
import Sounds from "./sounds";
import Environment from "./environment";
import Game from "./game";
import HelpScreen from "./helpscreen";

export default {
  me: new Me(),
  players: new Players(),
  camera: new Camera(),
  chat: new Chat(),
  scoreboard: new Scoreboard(),
  overlap: new Overlap(),
  shooting: new Shooting(),
  sounds: new Sounds(), 
  environment: new Environment(),
  game: new Game(),
  helpscreen: new HelpScreen()
};
