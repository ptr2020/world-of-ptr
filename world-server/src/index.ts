import { Server } from './network';
import { World } from './world';

let port: number = process.env.NODE_ENV == "production" ? 8080 : 8081;
let srv: Server = new Server(port);

let world: World = new World(1200);
world.init()
