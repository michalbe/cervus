/* global Cervus */

const game = new Cervus.Game({
  width: window.innerWidth,
  height: window.innerHeight,
  // dom: document.body,
  // fps: 1
});

// const model = game.model('model.vox');

// const cubes = 35000;
//
// for (let i = 0; i < cubes; i++) {
//   let cube = new Cervus.Entity({ vertices, indices });
//   cube.position.z = -200;
//   cube.position.x = (Math.random()*300)-150;
//   cube.position.y = (Math.random()*200)-100;
//   game.add(cube);
// }
const cube2 = new Cervus.shapes.Box();
cube2.position.z = -10;
cube2.position.x = -5;
cube2.position.y = 3;
cube2.color = "#FF00FF";
game.add(cube2);

const cube = new Cervus.shapes.Box();
cube.position.z = -10;
cube.position.x = 3;
cube.color = "#BADA55";
game.add(cube);

let dir = 1;

game.add_frame_listener('cube_rotation', (delta) => {
  cube.rotation.x = delta / 1000;
  if (cube2.position.x > 5) {
    dir = -1;
  } else if (cube2.position.x < -5) {
    dir = 1;
  }

  // if (cube.position.y > 5) {
  //   dir2 = -1;
  // } else if (cube.position.y < -5) {
  //   dir2 = 1;
  // }

  cube2.position.x += 0.06 * dir;
  // cube.position.y += 0.06 * dir2;
  // cube.position.z += 0.06 * dir2;
  // cube2.scale = {x: 0.5, y:0.5, z: 0.5};
  // cube2.color = '#' + Math.floor(Math.random() * 250).toString(16) + '' + Math.floor(Math.random() * 250).toString(16) + Math.floor(Math.random() * 250).toString(16);
});
