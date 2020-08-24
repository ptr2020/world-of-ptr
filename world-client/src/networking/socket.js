import features from "../features";

export default class Socket {

  constructor(wop) {
    this.wop = wop;
    this.msgQueue = [];
    this.socket = null;
    this.reconnectWait = 10;
    this.maxTries = 5;
    this.reconnectTries = 0;
    this.initReconnect = false;

    // Settings
    //this.port = 8081;
    //this.host = "ws://"+window.location.hostname+":"+this.port+"/";
    this.host = WOP_HOST;
  }

  tryReconnect(){
    if(this.wop.socket.reconnectTries > this.wop.socket.maxTries) return;
    this.wop.socket.reconnectTries++;
    console.log('retrying...');
    if(!this.wop.socket.isConnected()){
      setTimeout(this.wop.socket.tryReconnect, this.wop.socket.reconnectWait * this.wop.socket.reconnectTries * 1000, this.wop.socket);
      this.wop.socket.socket.close();
      this.wop.socket.connect()
    } else {
      this.wop.socket.reconnectTries = 0;
      this.wop.me.create();
    }
  }

  connect() {
    this.socket = new WebSocket(this.host);
    this.socket.onopen = (e) => {
      for(const msg of this.msgQueue) {
        this.send(msg);
      }
      console.log('connected!');
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
      if(!this.initReconnect){
        setTimeout(this.tryReconnect, this.reconnectWait);
        this.initReconnect = true;
      }
    };

  };

  isConnected() {
    return this.socket && this.socket.readyState == WebSocket.OPEN;
  };

  send(msg) {
    if(!this.isConnected()){
      return;
    }
    if (!msg) return false;
    if (typeof(msg) == "object"){
      msg = JSON.stringify(msg);
    } else if (typeof(msg) == "string"){
    } else {
      return false;
    }

    if (!this.socket.readyState) {
      this.msgQueue.push(msg);
    }
    else {
      var success = this.socket.send(msg);
    }
    return success;
  };

  close() {
    if (!this.isConnected()) return;
    this.socket.close();
    this.socket = null;
  };

};
