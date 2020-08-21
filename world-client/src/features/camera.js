import Feature from "./feature";
import * as Phaser from 'phaser';

export default class Camera extends Feature {
  preload(wop) {
    super.preload(wop);

    // Preload game resources here

  }

  create(wop) {
    super.create(wop);
    this.zoom = 2;

    // Prepare scene here

    // World bounds
    wop.scene.cameras.main.setBounds(0, 0, 1920, 1920);
    wop.scene.physics.world.setBounds(0, 0, 1920, 1920);

    var roundPixels = false;
    wop.scene.cameras.main.startFollow(wop.me.character, roundPixels, 0.08, 0.08);
    wop.scene.cameras.main.setZoom(this.zoom);

    // Prevent native browser zoom which causes other UI elements (like chat) to resize
    // Instead use custom zoom handlers
    document.addEventListener('wheel', (event) => {
      if (event.ctrlKey) {
        if (event.deltaY < 0 && this.zoom < 5) {
          this.zoom += 0.15;
          wop.scene.cameras.main.setZoom(this.zoom);
        } else if (event.deltaY > 0 && this.zoom > 0.8) {
          this.zoom -= 0.15;
          wop.scene.cameras.main.setZoom(this.zoom);
        }

        event.preventDefault();
      }
    }, { passive: false });

    document.addEventListener('keydown', (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === '+') {
        if (this.zoom < 5) {
          this.zoom += wop.scene.cameras.main.zoom * 0.1;
          wop.scene.cameras.main.setZoom(this.zoom);
        }
        event.preventDefault();
      } else if ((event.ctrlKey || event.metaKey) && event.key === '-') {
        if (this.zoom > 0.8) {
          this.zoom -= wop.scene.cameras.main.zoom * 0.1;
          wop.scene.cameras.main.setZoom(this.zoom);
        }
        event.preventDefault();
      }
    }, { passive: false });
  }

  update(wop) {
    super.update(wop);

    // Game frame update logic here

  }

  onSocketMessage(wop, message) {
    super.onSocketMessage(wop, message);

    // On server message received logic here

  }

}