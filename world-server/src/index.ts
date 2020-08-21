import { Server } from './network';
import { World } from './world';

import dotenv = require('dotenv');
dotenv.config();

let port: number = process.env.NODE_ENV == "production" ? 8080 : 8081;
let srv: Server = new Server(port);

let world: World = new World();
world.init()
