import features from "../features";

export default class Socket {

  constructor(wop) {
    this.wop = wop;
    this.msgQueue = [];
    this.socket = null;

    // Settings
    //this.port = 8081;
    //this.host = "ws://"+window.location.hostname+":"+this.port+"/";
    this.host = WOP_HOST;
  }

  connect() {
    this.socket = new WebSocket(this.host);

    this.socket.onopen = (e) => {
      for(const msg of this.msgQueue) {
        this.send(msg);
      }

      this.msgQueue = undefined;
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

    if (!this.socket || !this.socket.readyState) {
      this.msgQueue.push(msg);
      return true;
    }
    else {
      return this.socket.send(msg);
    }
  };

  close() {
    if (!this.isConnected()) return;
    this.socket.close();
    this.socket = null;
  };

};
