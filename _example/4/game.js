/* global Cervus */
const material = new Cervus.materials.PhongMaterial({
  requires: [
    Cervus.components.Render,
    Cervus.components.Transform
  ]
});

material.add_fog({
  color: [1, 1, 1],
  distance: new Float32Array([1, 15])
});
const game = new Cervus.core.Game({
  width: window.innerWidth,
  height: window.innerHeight,
  light_position: [-1, 2, 5],
  light_intensity: 0.9,
  // clear_color: 'f0f'
  // fps: 1
});

const physics_world = new Cervus.physics.World();

// By default all entities face the user.
// Rotate the camera to see the scene.
const camera_transform = game.camera.get_component(Cervus.components.Transform);
camera_transform.position = [0, 3, 5];
camera_transform.rotate_rl(Math.PI);

const plane = new Cervus.shapes.Plane();
const plane_transform = plane.get_component(Cervus.components.Transform);
const plane_render = plane.get_component(Cervus.components.Render);
plane_transform.scale = [100, 1, 100];
plane_render.material = material;
plane_render.color = "#eeeeee";
plane.add_component(new Cervus.components.RigidBody({
  world: physics_world,
  shape: 'box',
  mass: Infinity
}));
game.add(plane);

for (let i = 0; i < 15; i++) {
  const cube = new Cervus.shapes.Box();
  const cube_transform = cube.get_component(Cervus.components.Transform);

  const cube_render = cube.get_component(Cervus.components.Render);
  cube_render.material = material;
  cube_render.color = '#'+Math.floor(Math.random()*1677215).toString(16);
  cube_transform.position = [
    0,
    4 * i,
    -10
  ];
  cube.add_component(new Cervus.components.RigidBody({
    world: physics_world,
    shape: 'box',
    mass: 5
  }));
  game.add(cube);
}

game.on('tick', () => {
  physics_world.step(1/game.fps);
});
