/**
 * Tale "state" objekt vsebuje čisto vse kar moramo vedeti o stvareh, ki niso igralec
 * To vključuje druge igralce, svet, pickupe, artikli v trgovini, itd.
 * V drugih funkcijah lahko do tega dostopate z wop.state.______
 * Če karkoli dodajate v ta class pa do state dostopate z this.state.______
 * 
 * Če hočete dodati karkšnokoli spremenljivko v state, jo dodajte v constructor
 * funkciji, kjer piše this.state = {
 * ne pozabiti vejice, ko dodajate novo spremenljivko :)
 */

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