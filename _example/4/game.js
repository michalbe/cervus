/* global Cervus */
const material = Cervus.materials.phong;

const game = new Cervus.core.Game({
  width: window.innerWidth,
  height: window.innerHeight,
  light_position: [-1, 2, 5],
  light_intensity: 0.9,
  // clear_color: 'f0f'
  // fps: 1
});

// By default all entities face the user.
// Rotate the camera to see the scene.
const camera_transform = game.camera.get_component(Cervus.components.Transform);
camera_transform.position = [0, 3, 5];
camera_transform.rotate_rl(Math.PI);
// game.camera.keyboard_controlled = true;

const plane = new Cervus.shapes.Plane();
const plane_transform = plane.get_component(Cervus.components.Transform);
const plane_render = plane.get_component(Cervus.components.Render);
plane_transform.scale = [100, 1, 100];
plane_render.material = material;
plane_render.color = "#eeeeee";
game.add(plane);

const cube = new Cervus.shapes.Box();
const cube_transform = cube.get_component(Cervus.components.Transform);
const cube_render = cube.get_component(Cervus.components.Render);
cube_render.material = material;
cube_render.color = "#00ff00";
cube_transform.position = [0, 1, -10];

game.add(cube);
