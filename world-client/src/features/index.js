import Players from "./players";
import Me from "./me";
import Camera from "./camera";
import Chat from "./chat";
import Scoreboard from "./scoreboard";
import Overlap from "./overlap";
import Sounds from "./sounds";

/**
 * Registriramo vse "featurje", da jih lahko naložimo ob prižigu igre
 */

export default {
  me: new Me(),
  players: new Players(),
  camera: new Camera(),
  chat: new Chat(),
  scoreboard: new Scoreboard(),
  overlap: new Overlap(),
  sounds: new Sounds()
};
