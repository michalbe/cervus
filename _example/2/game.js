/* global Cervus */

const game = new Cervus.core.Game({
  width: window.innerWidth,
  height: window.innerHeight,
  light_position: [-1, 2, 5],
  light_intensity: 0.9
  // fps: 1
});

const material = new Cervus.materials.PhongMaterial({
  requires: [
    Cervus.components.Render,
    Cervus.components.Transform
  ]
});

const wireframe = new Cervus.materials.WireframeMaterial({
  requires: [
    Cervus.components.Render,
    Cervus.components.Transform
  ]
});

// By default all entities face the user.
// Rotate the camera to see the scene.
const [camera_transform, camera_move] = game.camera.get_components(Cervus.components.Transform, Cervus.components.Move);
camera_transform.position = [0, 2, 4];
camera_transform.rotate_rl(Math.PI);
camera_move.keyboard_controlled = true;

const plane = new Cervus.shapes.Plane();
plane.get_component(Cervus.components.Transform).set({
  scale:  [100, 1, 100]
});
plane.get_component(Cervus.components.Render).set({
  material: material,
  color: "#eeeeee"
});
game.add(plane);

const group = new Cervus.core.Entity({
  components: [
    new Cervus.components.Transform()
  ]
});

const cube = new Cervus.shapes.Box();
const [cube_transform, cube_render] = cube.get_components(Cervus.components.Transform, Cervus.components.Render);
cube_transform.position = [0, 1, 3];
cube_transform.scale = [1, 1, 1];
cube_render.color = "#bada55";
cube_render.material = material;
group.add(cube);
game.add(group);

const light = Array.from(game.entities_by_component.get(Cervus.components.Light))[0];
const light_transform = light.get_component(Cervus.components.Transform);
const light_light = light.get_component(Cervus.components.Light);
light_transform.position = [0, 1, 0];
light_transform.scale = [0.2, 0.2, 0.2];
light.add_component(
  new Cervus.components.Render({
    color: '#ff00ff',
    material: wireframe,
    indices: cube_render.indices,
    vertices: cube_render.vertices
  })
);

game.on('tick', () => {
  game.camera.get_component(Cervus.components.Transform).look_at(cube_transform.position);
});

const tween = new Cervus.tweens.VecTween({
  object: cube_transform,
  property: 'position',
  to: [0, 1, -2],
  time: 3000,
  game: game
});

setTimeout(()=> {
  let time = new Date();
  tween.start().then(() => console.log('done!', new Date() - time));
}, 1000);

const color_tween = new Cervus.tweens.ColorTween({
  object: cube_render,
  property: 'color',
  to: '#ff00ff',
  time: 600,
  game: game
});

const color_tween2 = new Cervus.tweens.ColorTween({
  object: cube_render,
  property: 'color',
  to: '#0000ff',
  time: 600,
  game: game
});

setTimeout(()=> {
  let time = new Date();
  color_tween.start().then(() => {
    color_tween2.start().then(() => {
      color_tween.start().then(() => {
        console.log('color done!', new Date() - time)
      });
    });
  });
}, 1000);

// const light_tween= new Cervus.tweens.ValueTween({
//   object: game,
//   property: 'light_intensity',
//   to: 0.1,
//   time: 600,
//   game: game
// });
//
// setTimeout(()=> {
//   let time = new Date();
//   light_tween.start().then(() => {
//     console.log('color done!', new Date() - time)
//   });
// }, 1000);
let dir = 1;

game.on('tick', () => {
  if (light_transform.position[0] > 3) {
    light_light.color = '#ff00ff';
    dir = -1;
  } else if (light_transform.position[0] < -3) {
    dir = 1;
    light_light.color = '#00ff00';
  }

  light_transform.position = [
    light_transform.position[0] + 0.06 * dir,
    1,
    light_transform.position[2] + 0.06 * dir
  ];
});
