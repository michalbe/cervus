/* global Cervus */

const material = 'phong';

const game = new Cervus.Game({
  width: window.innerWidth,
  height: window.innerHeight,
  movable_camera: true
  // dom: document.body,
  // fps: 1
});

const cube2 = new Cervus.shapes.Box({
  material: material
});
cube2.position.z = -10;
cube2.position.x = -5;
cube2.position.y = 3;
cube2.color = "#FF00FF";
game.add(cube2);

const cube8 = new Cervus.shapes.Box({
  material: material
});
cube8.position = {x: 0, y: 0, z: -5};
cube8.color = "#ffffff";
// game.add(cube8);

const cube = new Cervus.shapes.Box({
  material: material
});
cube.position.z = -12;
cube.position.x = 3;
cube.color = "#BADA55";
cube.scale.x = cube.scale.y = 2;
game.add(cube);

const sphere = new Cervus.shapes.Sphere({
  material: material,
  color: '#ff0000',
  rotation: {
    x: Math.PI/4,
    y: Math.PI/4,
    z: 0
  }
});
sphere.position.z = -10;
sphere.position.x = 3;
sphere.scale = {x: 0.5, y:0.5, z: 0.5};
// sphere.color = '#ffffff';
game.add(sphere);

let dir = 1;

const plane = new Cervus.shapes.Plane({
  material: material,
  color: '#ffffff'
});

plane.position.z = -50;
plane.position.y = 0;
plane.rotation.x = Math.PI/2 + 0.03;
plane.scale = {x: 100, y:100, z:1 };
game.add(plane);

const plane2 = new Cervus.shapes.Plane({
  material: material,
  color: '#cc00cc',
});
plane2.position.z = -15;
plane2.position.y = 1;
plane2.position.x = -3;
plane2.rotation.x = 0;//Math.PI/2;
plane2.scale = {x: 2, y:2, z:1 };
game.add(plane2);


game.add_frame_listener('cube_rotation', (delta) => {
  cube.rotation.x = sphere.rotation.x = delta / 1000;
  if (cube2.position.x > 5) {
    dir = -1;
  } else if (cube2.position.x < -5) {
    dir = 1;
  }

  sphere.position.x += 0.06 * dir * -1;
  cube2.position.x += 0.06 * dir;
});

// document.body.addEventListener('click', () => {
//   if (cube.material === 'basic') {
//     cube.material = cube2.material = material;
//   } else {
//     cube.material = cube2.material = 'basic';
//   }
// });
