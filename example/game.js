/* global Cervus */

const game = new Cervus.Game({
  width: window.innerWidth,
  height: window.innerHeight,
  // dom: document.body,
  // fps: 1
});

const cube2 = new Cervus.shapes.Box({
  material: 'phong'
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
cube.scale.x = 2;
game.add(cube);

const cube3 = new Cervus.shapes.Sphere({
  material: 'phong',
  color: '#ff0000',
  rotation: {
    x: Math.PI/4,
    y: Math.PI/4,
    z: 0
  }
});
cube3.position.z = -10;
// cube3.color = '#ffffff';
game.add(cube3);

let dir = 1;

const plane = new Cervus.shapes.Plane({
  material: 'basic',
  color: '#ffffff',
});
plane.position.z = plane.position.x = -5;
game.add(plane);
plane.scale = {x: 3, y:3, z:1 }

game.add_frame_listener('cube_rotation', (delta) => {
  cube.rotation.x = cube3.rotation.x = plane.rotation.x = delta / 1000;
  if (cube2.position.x > 5) {
    dir = -1;
  } else if (cube2.position.x < -5) {
    dir = 1;
  }

  cube2.position.x += 0.06 * dir;
});

// document.body.addEventListener('click', () => {
//   if (cube.material === 'basic') {
//     cube.material = cube2.material = 'phong';
//   } else {
//     cube.material = cube2.material = 'basic';
//   }
// });
