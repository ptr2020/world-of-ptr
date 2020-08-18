export default class Player {

  constructor(wop, id, name, x, y, angle, isMe) {
    this.id = id;
    this.name = name;
    this.angle = angle;

    this.character = wop.scene.physics.add.image(x, y, 'arrow');

    this.character.setBounce(0, 0);
    this.character.setCollideWorldBounds(true);

    this.nameText = wop.scene.add.text(x, y, name, {
      fontFamily: 'Arial',
      color: isMe ? 'yellow' : 'white'
    });

    this.update();
  }

  update() {
    // Position name text over player's character
    this.nameText.x = this.character.x -this.nameText.width/2;
    this.nameText.y = this.character.y -this.character.height/2 -20;

    // Normalize angle
    if (this.angle > 180) this. angle -= 360;
    if (this.angle < -180) this. angle += 360;

    if (this.character.anims) {

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

      if (this.character.body.velocity.length() > 0) {
        this.character.anims.resume();
        this.character.anims.setTimeScale(this.character.body.velocity.length() /400);
      } else {
        this.character.anims.pause();
      }
    } else {

      this.character.angle = this.angle;
    }
  }

  destroy() {
    this.character.destroy();
    this.nameText.destroy();
  }
}