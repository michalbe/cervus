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
game.camera.position = [0, 2, 4];
game.camera.rotate_rl(Math.PI);
game.camera.keyboard_controlled = true;

const plane = new Cervus.shapes.Plane({
  material: Cervus.materials.phong,
  color: "#eeeeee",
  scale: [100, 1, 100]
});

game.add(plane);

const group = new Cervus.core.Entity();
const cube = new Cervus.shapes.Box({
  material: Cervus.materials.phong,
  position: [0, 1, 3]
});
cube.color = "#bada55";
cube.scale = [1, 1, 1];
group.add(cube);

game.add(group);

game.add_listener("tick", () => {
  game.camera.look_at(cube.position);
});

const tween = new Cervus.tweens.VecTween({
  object: cube,
  property: 'position',
  to: [0, 1, -5],
  time: 3000,
  game: game
});

// setTimeout(()=> {
//   let time = new Date();
//   tween.start().then(() => console.log('done!', new Date() - time));
// }, 1000);

const color_tween = new Cervus.tweens.ColorTween({
  object: cube,
  property: 'color',
  to: '#ff00ff',
  time: 600,
  game: game
});

const color_tween2 = new Cervus.tweens.ColorTween({
  object: cube,
  property: 'color',
  to: '#0000ff',
  time: 600,
  game: game
});

// setTimeout(()=> {
//   let time = new Date();
//   color_tween.start().then(() => {
//     color_tween2.start().then(() => {
//       color_tween.start().then(() => {
//         console.log('color done!', new Date() - time)
//       });
//     });
//   });
// }, 1000);

const light_tween= new Cervus.tweens.ValueTween({
  object: game,
  property: 'light_intensity',
  to: 0.1,
  time: 600,
  game: game
});

setTimeout(()=> {
  let time = new Date();
  light_tween.start().then(() => {
    console.log('color done!', new Date() - time)
  });
}, 1000);
