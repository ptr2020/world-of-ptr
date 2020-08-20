import Feature from "./feature";

export default class HelpScreen extends Feature {
  preload(wop) {
    super.preload(wop);
  }

  create(wop) {
    super.create(wop);

    var textToDisplay =
      "WASD or Arrow Keys = move\n"+
      "N = change name\n"+
      "B = debug\n"+
      "SPACE = shoot\n"+
      "SHIFT = sprint";

    this.helpScreen = wop.scene.add.text(0, 0, textToDisplay, {
      fontFamily: 'Arial',
      color: 'white',
      fontSize: 14,
    });
    
    this.helpScreen.setOrigin(0, 0);
    this.helpScreen.setScrollFactor(0, 0);
    this.helpScreen.visible = false;
    this.helpScreen.setPosition(window.innerWidth / 4 + 2, window.innerHeight / 4 + 20);

    this.hForHelpText = wop.scene.add.text(0, 0, 'Help = h' , {
      fontFamily: 'Arial',
      color: 'white',
      fontSize: 14,
    });

    this.hForHelpText.setOrigin(0, 0);
    this.hForHelpText.setScrollFactor(0, 0);
    this.hForHelpText.setPosition(window.innerWidth / 4 + 2, window.innerHeight / 4);
    this.hForHelpText.visible = true;
  }

  update(wop) {
    super.update(wop);

    if(wop.keyActions.helpScreen.isDown) {
      this.helpScreen.visible = true;
    } 
    if(wop.keyActions.helpScreen.isUp) {
      this.helpScreen.visible = false;
    }
  }

  onSocketMessage(wop, message) {
    super.onSocketMessage(wop, message);
  }
}
