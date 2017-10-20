/* global Cervus */
const material = new Cervus.materials.PhongMaterial({
  requires: [
    Cervus.components.Render,
    Cervus.components.Transform
  ]
});

const game = new Cervus.core.Game({
  width: window.innerWidth,
  height: window.innerHeight,
  light_position: [-1, 2, 5],
  light_intensity: 0.9,
  // clear_color: 'f0f'
  // fps: 1
});

const physics_world = new Cervus.OIMO.World({
  timestep: 1/60,
  iterations: 8,
  broadphase: 2,
  worldscale: 1,
  random: true,
  info: false,
  gravity: [0, -9.8, 0]
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
cube.add_component(new Cervus.components.RigidBody({
  world: physics_world,
  physics: {
    type: 'box',
    move: true,
    density: 1,
    friction: 0.2,
    restitution: 0.2,
    belongsTo: 1,
    collidesWith: 0xffffffff
  }
}));
const cube_transform = cube.get_component(Cervus.components.Transform);
const cube_render = cube.get_component(Cervus.components.Render);
cube_render.material = material;
cube_render.color = "#00ff00";
cube_transform.position = [0, 1, -10];

game.add(cube);
