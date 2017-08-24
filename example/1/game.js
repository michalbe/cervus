/* global Cervus */

const material = 'phong';

const game = new Cervus.Game({
  width: window.innerWidth,
  height: window.innerHeight,
  keyboard_controlled_camera: true,
  // fps: 1
});

const cube2 = new Cervus.shapes.Box({
  material: material
});
cube2.position = [ -5, -10, 3 ];
cube2.color = Cervus.math.hex_to_vec("#FF00FF");
game.add(cube2);

const cube8 = new Cervus.shapes.Box({
  material: material
});
cube8.position = [0, -5, 0 ];
cube8.color = Cervus.math.hex_to_vec("#ffffff");
game.add(cube8);

const cube = new Cervus.shapes.Box({
  material: 'phong',//'basic'
});
cube.position[1] = -12;
cube.position[0] = 3;
cube.color = Cervus.math.hex_to_vec("#BADA55");
cube.scale[0] = cube.scale[1] = 2;
game.add(cube);

const sphere = new Cervus.shapes.Sphere({
  material: material,
  color: Cervus.math.hex_to_vec('#ff0000'),
  // rotation: [ Math.PI/4, 0, Math.PI/4 ]
});
sphere.position[1] = -10;
sphere.position[0] = 3;
sphere.scale = [ 0.5, 0.5, 0.5 ];

game.add(sphere);

let dir = 1;
//
// const plane = new Cervus.shapes.Plane({
//   material: material,
//   color: Cervus.math.hex_to_vec('#CCCCCC')
// });
//
// plane.position[2] = -50;
// plane.position[1] = -2;
// // plane.rotation[0] = -Math.PI/2 + 0.03;
// plane.scale = [ 100, 1, 100 ];
// game.add(plane);

const plane3 = new Cervus.shapes.Plane({
  material: material,
  color: Cervus.math.hex_to_vec('#CCCCCC')
});

plane3.position[1] = -15;
plane3.position[2] = -1.5;
plane3.scale = [ 150, 150,  1 ];
game.add(plane3);
//
// const plane4 = new Cervus.shapes.Plane({
//   material: material,
//   color: Cervus.math.hex_to_vec('#00FF00')
// });
//
// plane4.position[1] = -15;
// plane4.position[2] = 0;
// // plane4.rotation[0] = Math.PI/2;
// plane4.scale = [ 10, 10, 1 ];
// game.add(plane4);

const plane2 = new Cervus.shapes.Plane({
  material: material,
  color: Cervus.math.hex_to_vec('#cc00cc'),
});
plane2.position = [ -3, -13, 1];
// plane2.rotation[0] = -Math.PI/2;
plane2.scale = [ 2, 1, 2 ];
game.add(plane2);

const parent_group = new Cervus.Entity({});
const group = new Cervus.Entity({});
const vox1 = new Cervus.shapes.Box({
  scale: [0.5, 0.5, 0.5],
  color: Cervus.math.hex_to_vec('#0000ff'),
  material: 'phong',
  position: [-1, -1, 1]
});

const vox2 = new Cervus.shapes.Box({
  color: Cervus.math.hex_to_vec('#00ff00'),
  material: 'basic',
  position: [ -3, -3, 2 ]
});

group.origin = [ 1, 2, 2 ];
// group.position[2] = -15;
// group.position[1] = -10;
// game.add(group);
// game.add(vox1);
// game.add(vox2);
group.add(vox1);
group.add(vox2);
parent_group.add(group);
game.add(parent_group);

game.add_frame_listener('cube_rotation', (delta) => {
  // cube.rotation[0] = sphere.rotation[0] = group.rotation[2] = delta / 1000;
  cube.rotate_ud(16/1000);
  if (cube2.position[0] > 5) {
    dir = -1;
  } else if (cube2.position[0] < -5) {
    dir = 1;
  }

  // if (~~delta%30 === 0) {
  //   game.light_intensity = Math.random();
  // }

  game.light_position = game.camera.position;
  sphere.position[0] += 0.06 * dir * -1;
  cube2.position[0] += 0.06 * dir;
  group.position[1] -= 0.06 * dir;
  parent_group.position[0] -= 0.06 * dir;
});
