import features from "../features";

export default class Socket {

  constructor(wop) {
    this.wop = wop;
    this.socket = null;

    // Settings
    //this.port = 8081;
    //this.host = "ws://"+window.location.hostname+":"+this.port+"/";
    this.host = WOP_HOST;
  }

  connect() {
    this.socket = new WebSocket(this.host);

    this.socket.onopen = (e) => {
      // TODO
    };

    this.socket.onmessage = (e) => {
      // TODO
      //console.log("Socket onmessage", e);


      var message = JSON.parse(e.data);
      for (var featureName in features) {
        features[featureName].onSocketMessage(wop, message);
      }
    };

    this.socket.onclose = (e) => {
      // TODO
    };
  };

  isConnected() {
    return this.socket && this.socket.readyState == WebSocket.OPEN;
  };

  send(msg) {
    if (!msg) return false;
    if (typeof(msg) == "object"){
      msg = JSON.stringify(msg);
    } else if (typeof(msg) == "string"){
    } else {
      return false;
    }

    var success = this.socket.send(msg);
    return success;
  };

  close() {
    if (!this.isConnected()) return;
    this.socket.close();
    this.socket = null;
  };

};
