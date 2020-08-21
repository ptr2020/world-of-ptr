import * as Phaser from 'phaser';

export default class UiScene extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        this.scene = this;

        /*
            HEALTH BAR
        */
        this.load.image('healthBar', 'resources/health_bar_cropped.png');
    }

    create() {
        /*
            KEY BINDINGS FOR UI
        */
        var KeyCodes = Phaser.Input.Keyboard.KeyCodes;
        this.keyActions = this.input.keyboard.addKeys({
            helpScreen: KeyCodes.H,
        }, false);

        /*
            HELP SCREEN
        */
        this.hForHelpText = this.add.text(0, 0, 'Help = h' , {
            fontFamily: 'Arial',
            color: 'white',
            fontSize: 24,
        });

        this.hForHelpText.setOrigin(0, 0);
        this.hForHelpText.visible = true;
        this.hForHelpText.setDepth(100);

        var textToDisplay =
            "WASD or Arrow Keys = move\n" +
            "N = change name\n" +
            "B = debug\n" +
            "E = sniper mode\n" +
            "SPACE = shoot\n" +
            "SHIFT = sprint";

        this.helpScreen = this.add.text(0, 0, textToDisplay, {
            fontFamily: 'Arial',
            color: 'white',
            fontSize: 21,
        });
        
        this.helpScreen.setOrigin(0, 0);
        this.helpScreen.visible = false;

        /*
            SNIPER MODE
        */
        this.sniperModeText = this.add.text(0, 0, 'Sniper Mode: ON', {
            fontFamily: 'Arial',
            color: 'white',
            fontSize: 24,
        });

        this.sniperModeText.setOrigin(0.5, 0);

        /*
            HEALTH BAR
        */
        this.healthBarBorder = this.add.image(0, 0, 'healthBar');
        this.healthBarBorder.depth = 101;
        this.healthBarBorder.setScale(0.4);
        this.healthBarBorder.setOrigin(0, 1);
    
        this.healthBar = this.add.rectangle(0, 0, 150, 20, 0x00ff00, 1);
        this.healthBar.depth = 100;
        this.healthBar.setOrigin(0, 1);

        /*
            RESPAWN
        */
        this.respawnText = this.add.text(0, 0, 'You are dead!', { 
            fontFamily: 'Sans Sherif',
            fontSize: 50,
            color: 'red',
        });
    
        this.respawnText.visible = false;
        this.respawnText.setOrigin(0.5, 0.5);
    
        this.respawnTimer = this.add.text(0, 0, 'You will respawn in ... ' , { 
            fontFamily: 'Sans Sherif',
            fontSize: 21,
            color: 'white',
        });
    
        this.respawnTimer.visible = false;
        this.respawnTimer.setOrigin(0.5, 0.5);
    }

    update() {
        if (!wop.me) return;

        /*
            HELP SCREEN
        */
        this.hForHelpText.setPosition(10, 10);
        this.helpScreen.setPosition(10, this.hForHelpText.height + 20);

        if (this.keyActions.helpScreen.isDown) {
            this.helpScreen.visible = true;
        } 
        else {
            this.helpScreen.visible = false;
        }

        /*
            SNIPER MODE
        */
        this.sniperModeText.setPosition(window.innerWidth / 2, 10);
        this.sniperModeText.visible = wop.sniperMode;

        /*
            HEALTH BAR
        */
        this.healthBarBorder.setPosition(10, window.innerHeight - 10);
        this.healthBar.setPosition(34, window.innerHeight - 16);

        // Dolzina health bara glede na nas health
        this.healthBar.width = (wop.me.health / wop.me.maxHealth) * 150;

        // Pobarvamo health bar rdece ce je malo healtha ce ne pa zeleno
        if (wop.me.health <= 50 && wop.me.health > 30) {
            this.healthBar.fillColor = 0xFF4500;
        }
        else if (wop.me.health <= 30) {
            this.healthBar.fillColor = 0xff0000;
        }
        else {
            this.healthBar.fillColor = 0x00ff00;
        }

        /*
            RESPAWN
        */
        this.respawnText.setPosition(window.innerWidth / 2, window.innerHeight / 2 - this.respawnTimer.height / 2);
        this.respawnTimer.setPosition(window.innerWidth / 2, window.innerHeight / 2 + this.respawnText.height / 2);
    }

    onSocketMessage(wop, msg) {
        switch (msg.type) {
        }
    }
}
