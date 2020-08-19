# world-client

Vse datoteke se nahajajo v mapi `src`:

- [world-client](#world-client)
  - [/index.js](#indexjs)
  - [/wop/](#wop)
    - [/wop/create.js](#wopcreatejs)
    - [/wop/preload.js](#woppreloadjs)
    - [/wop/update.js](#wopupdatejs)
  - [state](#state)

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

## state
To je mapa