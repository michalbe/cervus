/* global Cervus */

const game = new Cervus.Game({
  width: window.innerWidth,
  height: window.innerHeight,
  // dom: document.body,
  // fps: 1
});

const cube2 = new Cervus.shapes.Box({
  material: 'basic'
});
cube2.position.z = -10;
cube2.position.x = -5;
cube2.position.y = 3;
cube2.color = "#FF00FF";
game.add(cube2);

const cube = new Cervus.shapes.Box({
  material: 'phong'
});

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

  cube2.position.x += 0.06 * dir;
});
