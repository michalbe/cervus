/* global Cervus */

const game = new Cervus.core.Game({
  width: window.innerWidth,
  height: window.innerHeight,
  clear_color: 'cff',
  // fps: 1
});

const material = new Cervus.materials.PhongMaterial({
  requires: [
    Cervus.components.Render,
    Cervus.components.Transform,
  ],
  texture: '../textures/magica.png',
});

const [camera_transform, camera_move] = game.camera.get_components(Cervus.components.Transform, Cervus.components.Move);
camera_transform.position = [-1.7, 3.22, 3]
camera_move.keyboard_controlled = true;
camera_move.mouse_controlled = true;

let animated_model;
Cervus.core.model_loader('models/pirate.json').then((frames) => {
  frames = frames[0];
  console.log(frames);
  for(let i = 0; i < 1; i++) {
    animated_model = new Cervus.core.Entity({
      components: [
        new Cervus.components.Transform({
          position: [0, 0, 10],
          scale: [0.2, 0.2, 0.2]
        }),
        new Cervus.components.Render({
          material: material,
          color:  '#ff00ff',
          vertices: frames[0].vertices,
          indices: frames[0].indices,
          normals: frames[0].normals,
          uvs: frames[0].uvs
        })
      ]
    });
    game.add(animated_model);

    animated_model.get_component(Cervus.components.Transform).rotate_rl(Math.PI);
  }
}).catch(console.error);

game.on('tick', () => {
  // animated_model.get_component(Cervus.components.Transform).rotate_rl(16/1000);
});
