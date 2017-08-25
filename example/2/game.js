/* global Cervus */

const game = new Cervus.Game({
  width: window.innerWidth,
  height: window.innerHeight,
  keyboard_controlled_camera: true,
  light_position: [-1, 2, 5],
  // fps: 10
});

// By default all entities face the user.
// Rotate the camera to see the scene.
game.camera.position = [0, 1, 2];
game.camera.rotate_rl(Math.PI);

const cube = new Cervus.shapes.Box({
  material: new Cervus.materials.Phong
});

cube.color = "#BADA55";
cube.scale = [1, 1, 1];
game.add(cube);

game.add_frame_listener('yo', delta => {
  //console.log(game.camera.position);
  // game.camera.look_at(cube.position);
});
