import features from '../features';

export default function preload(wop) {
  return function() {

    // Preload game resources

    console.log("Preloading resources");
    wop.scene = this;
    this.load.setBaseURL('../');

    this.load.image('grass', 'resources/grass.jpg');
    this.load.image('dirt', 'resources/dirt.png');
    this.load.image('bush', 'resources/bush.jpg');
    this.load.image('rock', 'resources/rock.jpg');
    this.load.image('shop', 'resources/shop.jpg');
    this.load.image('water', 'resources/water.jpg');


    for (var featureName in features) {
      features[featureName].preload(wop);
    }
  }
}
