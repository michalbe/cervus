/* global Cervus */

const game = new Cervus.core.Game({
  width: window.innerWidth,
  height: window.innerHeight,
  light_position: [-1, 2, 5],
  light_intensity: 0.9
  // fps: 1
});

// By default all entities face the user.
// Rotate the camera to see the scene.
game.camera.position = [0, 3, 5];
game.camera.rotate_rl(Math.PI);
game.camera.keyboard_controlled = true;

const plane = new Cervus.shapes.Plane({
  material: Cervus.materials.phong,
  color: "#eeeeee",
  scale: [100, 1, 100]
});
game.add(plane);

const group = new Cervus.core.Entity({
  position: [0, 1, 0],
  // scale: [2, 2, 2],
});
group.rotate_along([0, 1, 0], Math.PI/2);
game.add(group);

const cube = new Cervus.shapes.Box({
  material: Cervus.materials.phong,
  color: "#bada55",
  position: [0, 1, 0]
});
cube.rotate_along([0, 1, 0], Math.PI/2);
group.add(cube);
