/* global Cervus */

const phong_material = new Cervus.materials.PhongMaterial({
  requires: [
    Cervus.components.Render,
    Cervus.components.Transform
  ]
});

const textured_phong_material = new Cervus.materials.BasicMaterial({
  requires: [
    Cervus.components.Render,
    Cervus.components.Transform
  ],
  texture: '../textures/4.png',
  normal_map: '../textures/uv4.png'
});

const wireframe_material = new Cervus.materials.WireframeMaterial({
  requires: [
    Cervus.components.Render,
    Cervus.components.Transform
  ]
});

const basic_material = new Cervus.materials.BasicMaterial({
  requires: [
    Cervus.components.Render,
    Cervus.components.Transform
  ]
});

const game = new Cervus.core.Game({
  width: window.innerWidth,
  height: window.innerHeight,
  // light: false
  // fps: 1
});

// By default all entities face the user.
// Rotate the camera to see the scene.
const camera_transform = game.camera.get_component(Cervus.components.Transform);
camera_transform.position = [0, 1, 2];
camera_transform.rotate_rl(Math.PI);

game.camera.get_component(Cervus.components.Move).keyboard_controlled = true;
game.camera.get_component(Cervus.components.Move).mouse_controlled = true;


const cube2 = new Cervus.shapes.Box();
const [cube2_transform, cube2_render] = cube2.get_components(Cervus.components.Transform, Cervus.components.Render);
cube2_transform.position = [ 5, 3, -10 ];
cube2_render.material = wireframe_material;
cube2_render.color = "#FF00FF";
game.add(cube2);

const cube8 = new Cervus.shapes.Box();
const [cube8_transform, cube8_render] = cube8.get_components(Cervus.components.Transform, Cervus.components.Render);
cube8_transform.position = [0, 0, -5];
cube8_render.color = "#cff";
cube8_render.material = textured_phong_material;
// cube8.add_component(new Cervus.components.Move({
//   keyboard_controlled: true,
//   mouse_controlled: true
// }));
game.add(cube8);

const cube = new Cervus.shapes.Box();
const [cube_transform, cube_render] = cube.get_components(Cervus.components.Transform, Cervus.components.Render);
cube_transform.position = [-3, 0, -12];
cube_transform.scale = [2, 3, 1];
cube_render.color = "#BADA55";
cube_render.material = basic_material;
game.add(cube);

const sphere = new Cervus.shapes.Sphere();
const [sphere_transform, sphere_render] = sphere.get_components(Cervus.components.Transform, Cervus.components.Render);
sphere_render.color = '#ff0000';
sphere_render.material = textured_phong_material;
sphere_transform.position = [3, 0, -10];
sphere_transform.scale = [ 0.5, 0.5, 0.5 ];
game.add(sphere);
// sphere.add(cube);

const plane3 = new Cervus.shapes.Plane();
const [plane3_transform, plane3_render] = plane3.get_components(Cervus.components.Transform, Cervus.components.Render);
plane3_transform.position = [0, -1.5, 0];
plane3_transform.scale = [ 150, 1, 150 ];
plane3_render.color = '#ccc';
plane3_render.material = phong_material;
game.add(plane3);

// const zone = 100;
// const colors = [
//   'ff00ff',
//   'ff0000',
//   '00ff00',
//   '0000ff',
//   'ffff00',
//   '00ffff'
// ];
//
// for (let i = 0; i < 100; i++) {
//   const light = new Cervus.core.Entity({
//     components: [
//       new Cervus.components.Transform({
//         position: [zone/2-(Math.random()*zone), -0.5, zone/2 - (Math.random()*zone)],
//         scale: [0.2, 0.2, 0.2]
//       }),
//       new Cervus.components.Light({
//         intensity: 0.001,
//         color: colors[~~(Math.random()*colors.length)]
//       }),
//       new Cervus.components.Render({
//         color: '#ff00ff',
//         material: wireframe_material,
//         indices: sphere_render.indices,
//         vertices: sphere_render.vertices
//       })
//     ]
//   });
//   console.log(light.get_component(Cervus.components.Transform).position);
//   game.add(light);
// }

const light = Array.from(game.entities_by_component.get(Cervus.components.Light))[0];
const light_transform = light.get_component(Cervus.components.Transform);
// const light_light = light.get_component(Cervus.components.Light);

let dir = 1;
game.on('tick', () => {
  cube_transform.rotate_ud(16/1000);
  sphere_transform.rotate_ud(16/1000);
  sphere_transform.rotate_rl(16/1000);

  if (cube2_transform.position[0] > 5) {
    dir = -1;
  } else if (cube2_transform.position[0] < -5) {
    dir = 1;
  }

  light_transform.position = game.camera.get_component(Cervus.components.Transform).position;

  sphere_transform.position = [
    sphere_transform.position[0] + 0.06 * dir * -1,
    ...sphere_transform.position.slice(1)
  ];

  cube2_transform.position = [
    cube2_transform.position[0] + 0.06 * dir,
    ...cube2_transform.position.slice(1)
  ];
});
