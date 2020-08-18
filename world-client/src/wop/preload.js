import features from '../features';

/**
 * Tale funkcija se načeloma uporablja samo za nalaganje slik in tekstur pred
 * create(wop) funkcijo.
 */
export default function preload(wop) {
  return function() {

    // Preload game resources

    console.log("Preloading resources");
    wop.scene = this;
    this.load.setBaseURL('../');

    this.load.image('grid', 'resources/grid.png');
    this.load.image('grassA01', 'resources/grassA01.jpg');
    this.load.image('block', 'resources/block.png');

    for (var featureName in features) {
      features[featureName].preload(wop);
    }
  }
}
