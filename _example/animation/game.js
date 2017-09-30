/* global Cervus */

const game = new Cervus.core.Game({
  width: window.innerWidth,
  height: window.innerHeight,
  light_intensity: 0.4,
  clear_color: 'cff',
  // fps: 1
});

const material = new Cervus.materials.PhongMaterial({
  requires: [
    Cervus.components.Render,
    Cervus.components.Transform,
    Cervus.components.Morph
  ]
});

const [camera_transform, camera_move] = game.camera.get_components(Cervus.components.Transform, Cervus.components.Move);
// camera_transform.position = [0, 1, 2];
// camera_transform.rotate_rl(Math.PI);
camera_transform.position = [0.6284782886505127, 0.466666579246521, 2.461822032928467];
camera_transform.rotation = [-0.11002341657876968, 0.8865047693252563, -0.2734420895576477, -0.3566981256008148];
camera_move.keyboard_controlled = true;
// camera_move.mouse_controlled = true;

Cervus.core.model_loader('models/bird.json').then((models) => {
  // models.splice(1, 1);
  console.log(models);
  for(let i = 0; i < 1; i++) {
    setTimeout(() => {
      create_bird(
        0,
        0,
        2,
        // 50 - Math.random() * 100,
        // 50 - Math.random() * 100,
        // 50 - Math.random() * 100,
        models[0].scale,
        models
      );
    }, 0);
    // create_bird();
  }
}).catch(console.error);


const create_bird = (x = 0, y = 0, z = 0, scale, frames) => {
  let animated_model;
  animated_model = new Cervus.core.Entity({
    components: [
      new Cervus.components.Transform({
        position: [x, y, z],
        scale: scale
      }),
      new Cervus.components.Render({
        material: material,
        color:  '#0F0'
      }),
      new Cervus.components.Morph({
        frame_time: 16,
        // frames: frames
      })
    ]
  });
  animated_model.get_component(Cervus.components.Morph).frames = frames;
  animated_model.get_component(Cervus.components.Transform).rotate_ud(Math.PI * 1.5);

  animated_model.get_component(Cervus.components.Morph).create_buffers();
  // animated_model.current_tick = ~~(Math.random()*100);
  // animated_model.current_frame = ~~(Math.random()*frames.length);
  // animated_model.next_frame = animated_model.get_next_frame();
  game.add(animated_model);

  return animated_model;
};


const light = game.light;
const light_transform = light.get_component(Cervus.components.Transform);
const light_light = light.get_component(Cervus.components.Light);
light_light.intensity = 0.5;

game.on('tick', () => {
  light_transform.position = camera_transform.position;
});
