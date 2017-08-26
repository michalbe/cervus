/* global Cervus */

const material = Cervus.materials.phong;

const game = new Cervus.Game({
  width: window.innerWidth,
  height: window.innerHeight,
  keyboard_controlled_camera: true,
  // fps: 1
});

// By default all entities face the user.
// Rotate the camera to see the scene.
game.camera.position = [0, 1, 2];
game.camera.rotate_rl(Math.PI);


const cube2 = new Cervus.shapes.Box({
  material: material
});
cube2.position = [ 5, 3, -10 ];
cube2.color = "#FF00FF";
game.add(cube2);

const cube8 = new Cervus.shapes.Box({
  material: material
});
cube8.position = [0, 0, -5];
cube8.color = "#ffffff";
game.add(cube8);

const cube = new Cervus.shapes.Box({
  material: material
});
cube.position = [-3, 0, -12];
cube.color = "#BADA55";
cube.scale = [2, 3, 2];
game.add(cube);

const sphere = new Cervus.shapes.Sphere({
  material: material,
  color: '#ff0000',
  // rotation: [ Math.PI/4, 0, Math.PI/4 ]
});
sphere.position = [3, 0, -10];
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
  color: '#CCCCCC'
});

plane3.position = [0, -1.5, 0];
plane3.scale = [ 150, 1, 150 ];
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
  color: '#cc00cc',
});
plane2.position = [ 3, -1, -13];
// plane2.rotation[0] = -Math.PI/2;
plane2.scale = [ 2, 1, 2 ];
game.add(plane2);

const parent_group = new Cervus.Entity({});
const group = new Cervus.Entity({});
const vox1 = new Cervus.shapes.Box({
  scale: [0.5, 0.5, 0.5],
  color: '#0000ff',
  material: material,
  position: [1, 1, -1]
});

const vox2 = new Cervus.shapes.Box({
  color: '#00ff00',
  material: Cervus.materials.basic,
  position: [3, 2, -3]
});

group.origin = [ -1, 2, 2 ];
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
  sphere.rotate_ud(16/1000);
  sphere.rotate_rl(16/1000);
  if (cube2.position[0] > 5) {
    dir = -1;
  } else if (cube2.position[0] < -5) {
    dir = 1;
  }

  // if (~~delta%30 === 0) {
  //   game.light_intensity = Math.random();
  // }

  game.light_position = game.camera.position;

  sphere.position = [
    sphere.position[0] + 0.06 * dir * -1,
    ...sphere.position.slice(1)
  ];

  cube2.position = [
    cube2.position[0] + 0.06 * dir,
    ...cube2.position.slice(1)
  ];

  group.position = [
    ...group.position.slice(0, 2),
    group.position[2] - 0.06 * dir
  ];

  parent_group.position = [
    parent_group.position[0] - 0.06 * dir,
    ...parent_group.position.slice(1)
  ];
});
