# world-client

Vse datoteke se nahajajo v mapi `src`:

- [world-client](#world-client)
  - [/index.js](#indexjs)
  - [/wop/](#wop)
    - [/wop/create.js](#wopcreatejs)
    - [/wop/preload.js](#woppreloadjs)
    - [/wop/update.js](#wopupdatejs)
  - [/state/](#state)
    - [/state/player.js](#stateplayerjs)
    - [/state/state.js](#statestatejs)
  - [/public/resources/](#publicresources)
  - [/networking/](#networking)
  - [/features/](#features)
    - [/features/feature.js](#featuresfeaturejs)
    - [/features/me.js](#featuresmejs)

## [/index.js](../world-client/src/index.js)
Tukaj definiramo vse začetne spremenljivke, ki jih Phaser potrebuje za osnovno delovanje.

Prav tako definiramo spremenljivko `wop` na katero lahko gledamo kot spremenljivko, ki vsebuje vse podatke o igri.

Načeloma se te datoteke ne dotikajte.

**OPOZORILO**: Če kjerkoli na internetu vidite kodo, ki zgleda tako: `this.load.image` ali katerekoli druge variacije z `this`, vedite, da to ne bo delovalo v `features` mapi. 

Takrat more uporabiti `wop.scene` namesto `this`:

```
this.load.image('nekaj', 'nekje.png') 
----->
wop.scene.load.image('nekaj', 'nekje.png') 
```

## [/wop/](../world-client/src/wop/)
To je mapa, ki vsebuje `create`, `preload` in `update` funkcije od igre.

### [/wop/create.js](../world-client/src/wop/create.js)
To je funkcija, ki se zažene, ko ustvarimo glavni objekt za igro. Tukaj pišite vso kodo, ki se jo izvede samo enkrat pri začetku igre kot npr. postavljanje sveta, nalaganje različnih artiklov v trgovini, itd.

Tukaj se tudi izvedejo vse `create` funkcije v `features` mapi.

### [/wop/preload.js](../world-client/src/wop/preload.js)
Tale funkcija se načeloma uporablja samo za nalaganje slik in tekstur pred `create(wop)` funkcijo.

Tukaj se tudi izvedejo vse `preload` funkcije v `features` mapi.

### [/wop/update.js](../world-client/src/wop/update.js)
Tale funkcija se izvaja večkrat na sekundo. Tukaj naj se vpiše vse kar se mora vedno izvajati.

Tukaj se tudi izvajajo vse `update` funkcije v `features` mapi.

## [/state/](../world-client/src/state/)
To je mapa, ki vsebuje objekte, ki so ključni za določanje trenutnega stanja v igri.

### [/state/player.js](../world-client/src/state/player.js)
To je `Player` objekt.

Tole datoteko si lahko predstavljate kot "načrt" za igralca.
Vsi igralci bodo imeli vse lastnosti, ki jih določimo tukaj:
id, ime, kot premikanja, animacije, health,...

**TO NI NUJNO NAŠ IGRALEC!** --> glej [me.js](../world-client/src/features/me.js) za igralca, ki se ga upravljati

### [/state/state.js](../world-client/src/state/state.js)
Tale `state` objekt vsebuje čisto vse kar moramo vedeti o stvareh, ki niso igralec. 
To vključuje druge igralce, svet, pickupe, artikli v trgovini, itd.
V drugih funkcijah lahko do `state` spremenljivke dostopate z `wop.state.state.______`

Če karkoli programirate v tem dokumentu pa do `state` dostopate z `this.state.______`

**OPOZORILO**: Če hočete dodati karkšnokoli spremenljivko v `state`, jo dodajte v constructor
funkciji, kjer piše `this.state = {...}`

Ne pozabiti vejice, ko dodajate novo spremenljivko :)

## [/public/resources/](../world-client/src/public/resources/)
Tukaj dodajajte vse slike in zvoke, ki jih boste potrebovali.

## [/networking/](../world-client/src/networking/)
To mapo pustite pri miru. Če so mentorji to dobro sprogramirali, vam ne bi smela povzročati problemov :)

## [/features/](../world-client/src/features/)
To je mapa, kjer boste opravljali večino svojega dela. Narejena je zelo modularno, da se vam ni treba ubadati s kodo od drugih.

Glej [feature.js](#featuresfeaturejs) za nadaljne informacije

### [/features/feature.js](../world-client/src/features/feature.js)

**OPOZORILO**: V TO DATOTEKO NE NIČ PISATI!

To je neke vrste načrt za pisanje novih "featurjev"
To datoteko lahko prekopirate, spremenite ime in spremenite
```
export default class Feature ---> export default class ImeDatoteke extends Feature
```
in lahko začnete razvijati svoj feature

Pojasnilo za vse funkcije v tej mapi:

`preload(wop)`:

Ta funkcija se izvede še preden karkoli ustvarimo v igri
Tukaj naložite vse teksture in slike, ki jih boste potrebovali

`create(wop)`:

Ta funkcije se zažene, ko se igra "postavi"
Tukaj naj se izvede vsa logika, ki jo moramo izvesti samo enkrat na igro
oz. enkrat na posamezen objekt.

`update(wop)`:

Ta funkcija se poganja večkrat na sekundo.
Tukaj pišite vso logiko, ki se mora skoz izvajati
npr. preverjanje ali je igralec pritisnil tipko za premikanje naprej(ze v me.js)

`onSocketMessage(wop, message)`:

Ta funkcija se izvede, ko dobimo sporočilo od serverja, da se je nekaj spremenilo
Logika za backend načeloma gre sem.

Seveda, lahko ustvarite dodatne funkcije in spremenljivke, ki vam bodo pomagale 
z delovanjem igre

**OPOZORILO**: Ni vam treba vedno dati parametra `wop` v vsako funkcijo v svoje feature-ju

### [/features/me.js](../world-client/src/features/me.js)
To je naš igralec. Vsa logika, ki je pomembna samo za našega igralca je tukaj.
Glej [player.js](#stateplayerjs) za lastnosti igralca.


To so vsi igralci, ki niso naš igralec. Da vidiš vse lastnosti teh igralcev glej [player.js](#stateplayerjs) Do vseh igralcev se dostopa z wop.state.getPlayers(), ki vrne seznam vseh igralcev