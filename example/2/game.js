/* global Cervus */

const game = new Cervus.Game({
  width: window.innerWidth,
  height: window.innerHeight,
  keyboard_controlled_camera: true,
  light_position: [-5, 5, 5],
  // fps: 10
});

// By default all entities face the user.
// Rotate the camera to see the scene.
game.camera.position = [0, 2, 4];
game.camera.rotate_rl(Math.PI);

const group = new Cervus.Entity({
  // local_scale: [2, 2, 2],
  local_scale: [1, 1, 1],
});
const cube = new Cervus.shapes.Box({
  material: Cervus.materials.phong,
  color: "#bada55",
  local_scale: [1, 1, 1],
  position: [1, 0, 0]
});
group.add(cube);

game.add(group);

game.add_frame_listener('yo', delta => {
  //console.log(game.camera.position);
  // game.camera.look_at(cube.position);
});
