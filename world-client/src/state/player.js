export default class Player {

  constructor(wop, id, name, x, y, angle, isMe) {
    this.id = id;
    this.name = name;
    this.angle = angle;
    this.startSpeed = 120;
    this.defaultSpeed = this.startSpeed;
    this.sprintSpeedFactor = 1.6;
    this.backwardsSpeedFactor = 0.6;
    this.speed = this.defaultSpeed;
    this.turnSpeed = 5;
    this.isAlive = true;
    this.deadFadeOut = 1;

    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.sniperTurnSpeed = 1;
    this.sniperSpeedFactor = 0.3;

    this.serverPosition = { x: x, y: y};
    this.onMessagePosition = {x: x, y: y};
    this.messageProcessed = true;
    this.messageReceiveTime = 0;
    this.desiredInterpTime = 1000 / 60 - 1;

    this.isMe = isMe;
    this.mentorMode = false;
    this.mentorParticles = null;
    this.mentorEmitter = null;
    this.mentorParticles2 = null;
    this.mentorEmitter2 = null;
    this.standingOn = "";

    //this.character = wop.scene.physics.add.image(x, y, 'arrow');
    //this.character.setScale(0.5, 0.5);

    this.character = wop.scene.physics.add.sprite(x, y, 'yeehaw');
    this.character.depth = 3;
    this.character.setScale(0.5, 0.5);
    this.character.anims.play('yeehaw_move');

    this.character.setBounce(0, 0);
    this.character.setCollideWorldBounds(true);
    this.character.body.onOverlap = true;
    this.character.player = this;

    this.nameText = wop.scene.add.text(x, y, name, {
      fontFamily: 'Arial',
      fontSize: 16,
      color: isMe ? 'yellow' : 'white'
    });
    this.nameText.depth = 50;

    this.debugText = wop.scene.add.text(x, y, name, {
      fontFamily: 'Arial',
      color: 'white',
      fontSize: 12,
      align: 'center',
    });
    this.nameText.depth = 40;

    /*
    this.debugText = wop.scene.add.text(x, y, name, {
      fontFamily: 'Arial',
      color: 'white',
      fontSize: 12,
      align: 'center',
    });
    */

    this.update();
  }

  setName(name) {
    this.name = name;
    this.nameText.setText(name);
  }

  update() {
    // Normalize angle
    if (this.angle > 180) this.angle -= 360;
    if (this.angle < -180) this.angle += 360;

    this.character.angle = this.angle;
    if(this.character.x != this.serverPosition.x || this.character.y != this.serverPosition.y) {
      let interpValue = (Date.now() - this.messageReceiveTime) / this.desiredInterpTime;
      if(interpValue < 0.99) {
        this.character.x = Phaser.Math.Interpolation.Linear([this.character.x, this.serverPosition.x], interpValue);
        this.character.y = Phaser.Math.Interpolation.Linear([this.character.y, this.serverPosition.y], interpValue);
      } else if (!this.messageProcessed) {
        this.character.x = this.serverPosition.x;
        this.character.y = this.serverPosition.y;
        this.messageProcessed = true;
      }
    }

    if (this.character.anims) {

      /*
      if (this.angle > -45 && this.angle <= 45) {
        // right
        if (this.character.anims.currentAnim.key !== 'anime_right')
          this.character.anims.play('anime_right');
      } else if (this.angle > 45 && this.angle <= 135) {
        // down
        if (this.character.anims.currentAnim.key !== 'anime_down')
          this.character.anims.play('anime_down');
      } else if (this.angle > 135 && this.angle <= 180 || this.angle >= -180 && this.angle < -135) {
        // left
        if (this.character.anims.currentAnim.key !== 'anime_left')
          this.character.anims.play('anime_left');
      } else if (this.angle > -135 && this.angle <= 135) {
        // up
        if (this.character.anims.currentAnim.key !== 'anime_up')
          this.character.anims.play('anime_up');
      }
      */

      if (this.character.body.velocity.length() > 0) {
        this.character.anims.resume();
        this.character.anims.setTimeScale(this.character.body.velocity.length() /400);
      } else {
        this.character.anims.pause();
      }
    } else {

    }

    // Position name text over player's character
    this.nameText.x = this.character.x -this.nameText.width/2;
    this.nameText.y = this.character.y -this.character.height*0.75;

    if (!this.isAlive && this.deadFadeOut > 0) {
      console.log(this.deadFadeOut);
      this.deadFadeOut -= 0.04;
      this.character.setAlpha(this.deadFadeOut);
    }
    // Bush check
    if (this.standingOn == "bush") {
      this.character.setAlpha(this.isMe ? 0.6 : 0.15);
      this.nameText.setAlpha(this.isMe ? 0.6 : 0);
      if (this.mentorEmitter) this.mentorEmitter.setAlpha(0.05);
      if (this.mentorEmitter2) this.mentorEmitter2.setAlpha(0.1);

    } else {
      this.character.setAlpha(1);
      this.nameText.setAlpha(1);
      if (this.mentorEmitter && this.mentorMode) this.mentorEmitter.setAlpha(0.15);
      if (this.mentorEmitter2 && this.mentorMode) this.mentorEmitter2.setAlpha(0.3);
    }

    // Update debugText
    var showDebugText = this.isMe && wop.debugMode;
    this.debugText.visible = showDebugText;
    if (showDebugText) {
      this.debugText.x = this.character.x -this.debugText.width/2;
      this.debugText.y = this.character.y +this.character.height/2;
      this.debugText.setText(
        "Pos: "+Math.round(this.character.x)+", "+Math.round(this.character.y)+"\n"+
        "Angle: "+Math.round(this.character.angle)+"\n"+
        "On: "+this.standingOn
      );
    }

    if (this.mentorMode && this.mentorEmitter) {
      this.mentorEmitter.setPosition(this.character.x, this.character.y);
      this.mentorEmitter2.setPosition(this.character.x, this.character.y);
    }
  }

  destroy() {
    this.character.destroy();
    this.nameText.destroy();
  }

  addHealth(deltaHealth) {
    this.health += deltaHealth;
    if (this.health < 0) this.health = 0;
    if (this.health > this.maxHealth) this.health = this.maxHealth;
  }

  setIsAlive(isAlive) {
    this.isAlive = isAlive;
    this.nameText.setAlpha(isAlive ? 1 : 0);
    if (isAlive) {
      this.deadFadeOut = 1;
      this.character.setAlpha(1);
    }
  }

  setMentorMode(bool) {
    this.mentorMode = bool;
    if (bool && !this.mentorEmitter) {
      // Emitter under the player
      this.mentorParticles = wop.scene.add.particles('particleBlue');
      this.mentorParticles.depth = 4;
      this.mentorEmitter = this.mentorParticles.createEmitter({
        x: this.character.x,
        y: this.character.y,
        lifespan: 150,
        speed: { min: -25, max: 25 },
        angle: { min: -180, max: 180 },
        //rotation: { min: -100, max: 100 },
        //gravityY: 500,
        scale: { start: 0.3, end: 0 },
        quantity: 3,
        blendMode: 'ADD'
      });
      this.mentorEmitter.setEmitZone({
        source: new Phaser.Geom.Circle(0, 0, 16),
        type: 'edge',
        quantity: 150
      });


      // Emitter on the player
      this.mentorParticles2 = wop.scene.add.particles('particleBlue');
      this.mentorParticles2.depth = 6;
      this.mentorEmitter2 = this.mentorParticles2.createEmitter({
        x: this.character.x,
        y: this.character.y,
        lifespan: 600,
        speed: { min: -25, max: 25 },
        angle: { min: -180, max: 180 },
        //rotation: { min: -100, max: 100 },
        //gravityY: 500,
        scale: { start: 0.2, end: 0 },
        quantity: 3,
        blendMode: 'ADD'
      });
      this.mentorEmitter2.setBlendMode(Phaser.BlendModes.ADD);
      this.mentorEmitter2.setEmitZone({
        source: new Phaser.Geom.Circle(0, 0, 20),
        type: 'edge',
        quantity: 150
      });
    }

    if (this.mentorEmitter) this.mentorEmitter.visible = this.mentorMode;
    if (this.mentorEmitter2) this.mentorEmitter2.visible = this.mentorMode;
    this.character.tint = this.mentorMode ? 0x99CCFF : 0xFFFFFF;

  }
}
