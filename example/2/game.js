/* global Cervus */

const game = new Cervus.Game({
  width: window.innerWidth,
  height: window.innerHeight,
  keyboard_controlled_camera: true,
  light_position: [-1, 2, 5],
  // fps: 10
});

const cube = new Cervus.shapes.Box({
  material: 'phong',
});

cube.color = Cervus.math.hex_to_vec("#BADA55");
game.add(cube);

game.add_frame_listener('yo', delta => {
  //console.log(game.camera.position);
  game.camera.look_at(cube.position);
});
