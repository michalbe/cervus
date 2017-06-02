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
game.camera.position = [0, 1, 4];
game.camera.rotate_rl(Math.PI);

const plane = new Cervus.shapes.Plane({
  material: Cervus.materials.phong,
  color: "#eeeeee",
  scale: [100, 1, 100]
});

game.add(plane);

const group = new Cervus.Entity();
const cube = new Cervus.shapes.Box({
  material: Cervus.materials.phong
});
cube.color = "#bada55";
cube.scale = [1, 1, 1];
group.add(cube);

game.add(group);

game.add_frame_action(() => {
  //console.log(game.camera.position);
  // game.camera.look_at(cube.position);
});
