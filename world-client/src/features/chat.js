import Feature from "./feature";
import * as Phaser from 'phaser';

export default class Chat extends Feature {
  preload(wop) {
    super.preload(wop);

    // Preload game resources here

  }
  create(wop) {
    super.create(wop);

    // Prepare scene here
    wop.inChat = false;
    var inputMessage = window.document.getElementById("inputMessage");
    inputMessage.onkeydown = function(e){
      if (e.key == "Enter"){
        wop.socket.send({
          type: 'chat.say',
          id: wop.me.id,
          text : inputMessage.value,
        });        
        inputMessage.value = "";
        inputMessage.blur();
      }
    }

    inputMessage.addEventListener("mousedown", function(event) {
      if (!wop.inChat) event.preventDefault();
    });

    wop.keyActions.openChat.addListener('down', () => {
      inputMessage.focus();
    });

    inputMessage.addEventListener("focus", () => {
      //disable keys
      for (var k in wop.keyActions) wop.keyActions[k].enabled = false;
      wop.inChat = true;
    });

    inputMessage.onblur = () => {
      //enable keys
      for (var k in wop.keyActions) wop.keyActions[k].enabled = true;
      wop.inChat = false;
    };

  }
  update(wop) {
    super.update(wop);
  }

  onSocketMessage(wop, message) {
    super.onSocketMessage(wop, message);
    // On server message received logic here
    switch (message.type) {
      case "chat.say":
        // Player says something in the chat
        var messages = window.document.getElementById("messages");
        var li = window.document.createElement("li");
        // Construct elements by hand so we don't expose XSS by using innerHtml property
        var name = window.document.createElement("b");
        name.innerText = message.name + ": ";
        li.appendChild(name);
        // And message text
        var text = window.document.createTextNode(message.text);
        li.appendChild(text);
        // Finally add message
        messages.appendChild(li);
        break;
    }
  }
}
