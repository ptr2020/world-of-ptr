import Feature from "./feature";
import * as Phaser from 'phaser';

export default class Scoreboard extends Feature {
  preload(wop) {
    super.preload(wop);

    wop.scene.load.image('scoreboard', 'resources/scoreboard.png');

  }
  create(wop) {
    super.create(wop);
    wop.container = wop.scene.add.container(60, 60);
    wop.container.depth = 100;

    wop.scoreboard = wop.scene.add.image(400, 200, 'scoreboard').setOrigin(0, 0);
    wop.scoreboard.alpha = 0.8;
    wop.scoreboard.setScrollFactor(0, 0);
    wop.scoreboard.depth = 99;
    wop.scoreboard.visible = false;
    wop.scoreboard_shown = false;
    wop.container.visible = false;

    wop.keyActions.show_scoreboard.addListener('down', () => {

      if (wop.scoreboard_shown == true) {
        wop.scoreboard_shown = false;
        wop.scoreboard.visible = false;
        wop.container.visible = false;
      } else {
        wop.socket.send({
          type: 'scoreboard.show',
        });

        wop.scoreboard_shown = true;
        wop.scoreboard.visible = true;
        wop.container.visible = true;
      }
    });
  }
  update(wop) {
    super.update(wop);
  }

  onSocketMessage(wop, message) {
    super.onSocketMessage(wop, message);

    // On server message received logic here
    switch (message.type) {
      case "scoreboard.data":

        var x0 = 370;
        var y0 = 170;
        wop.container.removeAll();

        for (var i = 0; i < message.scores.length; i++) {
          const place = wop.scene.add.text(x0, y0 + 30 * i, i, {
            fontFamily: 'Arial',
            color: 'blue',
            fontSize: 20,
            align: 'center',
          });
          place.setScrollFactor(0, 0);
          wop.container.add(place);

          const textName = wop.scene.add.text(x0 + 40, y0 + 30 * i, message.scores[i].name, {
            fontFamily: 'Arial',
            color: 'blue',
            fontSize: 20,
            align: 'center',
          });
          textName.setScrollFactor(0, 0);
          wop.container.add(textName);

          var textScore = wop.scene.add.text(x0 + 400, y0 + 30 * i, message.scores[i].score, {
            fontFamily: 'Arial',
            color: 'blue',
            fontSize: 20,
            align: 'center',
          });
          textScore.setScrollFactor(0, 0);
          wop.container.add(textScore);
        }
    }
  }
}
