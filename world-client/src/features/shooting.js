import Feature from "./feature";
import * as Phaser from 'phaser';
import Player from "../state/player";
export default class Shooting extends Feature {

  constructor(){
    super();
    this.startTime = 0;
  }

  preload(wop) {
    super.preload(wop);
    wop.scene.load.image('bullet', 'resources/bullet5.png');
    wop.scene.load.image('crosshair', 'resources/crosshair2.png');
    wop.scene.load.audio('Gunshot', 'resources/audio/Gunshot1.mp3');

    // Preload game resources here

  }
  create(wop) {
    super.create(wop);

    // Prepare scene here
    wop.crosshair = wop.scene.physics.add.sprite(0, 0, 'crosshair');
    wop.crosshair.setScale(0.4, 0.4);
    wop.crosshair.depth = 30;
    wop.crosshair.visible = false;

    wop.keyActions.sniperMode.addListener('down', () => {
      wop.sniperMode = !wop.sniperMode;
      if(wop.sniperMode) {
        wop.me.defaultSpeed *= wop.me.sniperSpeedFactor;
      } else {
        wop.me.defaultSpeed = wop.me.startSpeed;
      }
      wop.socket.send({
        type: 'player.sniper',
        sniperMode: wop.sniperMode,
        correlationToken: wop.me.correlationToken
      });
    });
  }
  update(wop) {
    super.update(wop);
    for (let i = 0; i< wop.state.state.bullets.length; i++)
    {
       if( Date.now() - wop.state.state.bullets[i].startTime > wop.state.state.bullets[i].lifetime) {
           wop.state.state.bullets[i].metek.destroy();
           wop.state.state.bullets.splice(i, 1);
       }
    }
    // Game frame update logic here
    if (wop.keyActions.shoot.isDown && Date.now() - this.startTime > 120 ){
        this.startTime=Date.now();
        let bullet = new Bullet(
            wop.me.id, 50, 700, 2000,
            { x: wop.me.character.x, y: wop.me.character.y},
            { x: 700, y: 0 },
            wop.me.angle
        );        
        wop.state.state.bullets.push(bullet);

        wop.socket.send({
            type: "player.shoot",
            correlationToken: wop.me.correlationToken,
            pos: {
                x: wop.me.character.x,
                y: wop.me.character.y,
            },
            vel: {
                x: bullet.metek.body.velocity.x,
                y: bullet.metek.body.velocity.y,
            },
            damage: bullet.damage,
            lifetime: bullet.lifetime,
        });

        // TODO: read bullet properties from the player object, hardcoded for now
    }

    wop.crosshair.visible = wop.sniperMode;
    if (wop.sniperMode) {
      let vektorZamik = new Phaser.Math.Vector2(27, 8);
      var vector = new Phaser.Math.Vector2(100, 0);
      vector.add(vektorZamik);
      vector.rotate(wop.me.character.rotation);
      wop.crosshair.setPosition(
        wop.me.character.x +vector.x, 
        wop.me.character.y +vector.y
      );
    }

  }

  onSocketMessage(wop, message) {
    super.onSocketMessage(wop, message);

    // On server message received logic here
    switch (message.type) {
      case "player.shoot":
        // Player says something in the chat
        if(message.clientId == wop.me.id) break;
        let bullet = new Bullet(
            message.clientId,
            message.damage,
            700,
            message.lifetime,
            message.pos,
            message.vel
        );
        wop.state.state.bullets.push(bullet);
        break;
    }
  }

}

export class Bullet {
    constructor(id, damage, BulletSpeed, lifetime, pos={x: wop.me.character.x, y: wop.me.character.y}, vel={x:0,y:0}, angle=null){
        this.playerId = id;
        this.gunpower = damage;
        this.BulletSpeed = BulletSpeed;
        this.lifetime = lifetime;
        this.startTime = Date.now();

        let vektorZamik = new Phaser.Math.Vector2(27, 8);

        this.metek = wop.scene.physics.add.image(pos.x, pos.y, 'bullet');

        let angleFinal = angle
            ? angle / 180 * Math.PI
            : new Phaser.Math.Vector2(vel.x, vel.y).angle();

        vektorZamik.rotate(angleFinal);
        this.metek.x += vektorZamik.x;
        this.metek.y += vektorZamik.y;

        this.metek.body.setVelocity(vel.x, vel.y);
        if(vel.y === 0) this.metek.body.velocity.rotate(angleFinal);
        this.metek.rotation = angleFinal;
        this.metek.setScale(1.0);

        var bulletMusic = wop.scene.sound.add("Gunshot");
        bulletMusic.setVolume(0.6);
        bulletMusic.play();

    }
}