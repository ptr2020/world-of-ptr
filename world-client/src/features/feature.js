/**
 * OPOZORILO: V TO DATOTEKO NE NIČ PISATI!
 * 
 * To je neke vrste načrt za pisanje novih "featurjev"
 * To datoteko lahko prekopirate, spremenite ime in spremenite
 * 
 * export default class Feature ---> export default class ImeDatoteke extends Feature
 * 
 * in lahko začnete razvijati svoj feature
 * 
 * Pojasnilo za vse funkcije v tej mapi:
 * 
 * preload(wop):
 * Ta funkcija se izvede še preden karkoli ustvarimo v igri
 * Tukaj naložite vse teksture in slike, ki jih boste potrebovali
 * 
 * create(wop):
 * Ta funkcije se zažene, ko se igra "postavi"
 * Tukaj naj se izvede vsa logika, ki jo moramo izvesti samo enkrat na igro
 * oz. enkrat na posamezen objekt.
 * 
 * update(wop):
 * Ta funkcija se poganja večkrat na sekundo.
 * Tukaj pišite vso logiko, ki se mora skoz izvajati
 * npr. preverjanje ali je igralec pritisnil tipko za premikanje naprej(ze v me.js)
 * 
 * onSocketMessage(wop, message):
 * Ta funkcija se izvede, ko dobimo sporočilo od serverja, da se je nekaj spremenilo
 * Logika za backend načeloma gre sem.
 * 
 * 
 * Seveda, lahko ustvarite dodatne funkcije in spremenljivke, ki vam bodo pomagale 
 * z delovanjem igre
 */

export default class Feature {

  preload(wop, scene) {}
  create(wop) {}
  update(wop) {}
  onSocketMessage(wop, message) {}

}