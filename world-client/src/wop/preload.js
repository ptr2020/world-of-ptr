export default function preload(wop) {
  return function() {

    // Preload game resources
    console.log("Preloading resources");

    this.load.setBaseURL('../');

    this.load.image('grid', 'img/grid.png');

    this.load.image('arrow', 'img/arrow.png');
    this.load.image('block', 'img/block.png');

    wop.debug.scene = this;
  }
}
