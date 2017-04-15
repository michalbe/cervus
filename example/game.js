/* global Cervus */

const game = new Cervus.Game({
  width: window.innerWidth,
  height: window.innerHeight,
  // dom: document.body,
  // fps: 10
});

// const model = game.model('model.vox');

var vertices = [
  -1,  1,  1,
   1,  1,  1,
   1, -1,  1,
  -1, -1,  1,

  -1,  1, -1,
   1,  1, -1,
   1, -1, -1,
  -1, -1, -1,

   1,  1,  1,
   1,  1, -1,
   1, -1, -1,
   1, -1,  1,

  -1,  1,  1,
  -1,  1, -1,
   1,  1, -1,
   1,  1,  1,

   1, -1,  1,
   1, -1, -1,
  -1, -1, -1,
  -1, -1,  1,

  -1, -1,  1,
  -1, -1, -1,
  -1,  1, -1,
  -1,  1,  1
];

var indices = [
   1,  0,  3,
   1,  3,  2,

   4,  5,  7,
   5,  6,  7,

   9,  8, 11,
   9, 11, 10,

  13, 12, 15,
  13, 15, 14,

  17, 16, 19,
  17, 19, 18,

  21, 20, 23,
  21, 23, 22
];

const cube = game.create_object(indices, vertices);

game.add_frame_listener('cube::rotation', (delta) => {
  // console.log(delta);
  cube.rotation.x += 10;
});
