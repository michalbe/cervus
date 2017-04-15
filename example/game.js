/* global Cervus */

const game = new Cervus.Game({
  width: window.innerWidth,
  height: window.innerHeight,
  // dom: document.body,
  // fps: 1000/60
});

// const model = game.model('model.vox');

game.tick((delta) => {
  console.log(delta);
});
