export default class State {

  constructor(wop) {
    this.wop = wop;
    this.state = {
      players: [],
    };
  }

  getPlayers() {
    return this.state.players;
  }

  addPlayer(player) {
    this.state.players.push(player);
  }

  removePlayer(playerId) {
    var playerIndex = this.state.players.findIndex((x) => x.id === playerId);
    this.state.players[playerIndex].destroy();
    this.state.players.splice(playerIndex, 1);
  }

}