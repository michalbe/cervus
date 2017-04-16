/* global Cervus */

const game = new Cervus.Game({
  width: window.innerWidth,
  height: window.innerHeight,
  // dom: document.body,
  // fps: 60
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

// const cubes = 35000;
//
// for (let i = 0; i < cubes; i++) {
//   let cube = new Cervus.Entity({ vertices, indices });
//   cube.position.z = -200;
//   cube.position.x = (Math.random()*300)-150;
//   cube.position.y = (Math.random()*200)-100;
//   game.add(cube);
// }
const cube2 = new Cervus.Entity({ vertices, indices });
cube2.position.z = -10;
cube2.position.x = -5;
cube2.position.y = 3;
cube2.color = "#FF00FF";
game.add(cube2);

const cube = new Cervus.Entity({ vertices, indices });
cube.position.z = -10;
cube.color = "#BADA55";
game.add(cube);


let dir = 1;
game.add_frame_listener('cube_rotation', (delta) => {
  // console.log(delta);
  cube.rotation.y = delta / 1000;
  if (cube2.position.x > 5) {
    dir = -1;
  } else if (cube2.position.x < -5) {
    dir = 1;
  }

  cube2.position.x += 0.06 * dir;
  cube2.scale = {x: 0.5, y:0.5, z: 0.5};
  // cube2.color = '#' + Math.floor(Math.random() * 250).toString(16) + '' + Math.floor(Math.random() * 250).toString(16) + Math.floor(Math.random() * 250).toString(16);
});
