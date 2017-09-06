/* global Cervus */

const game = new Cervus.core.Game({
  width: window.innerWidth,
  height: window.innerHeight,
  light_intensity: 0.4,
  clear_color: 'cff',
  // fps: 1
});

const [camera_transform, camera_move] = game.camera.get_components(Cervus.components.Transform, Cervus.components.Move);
// camera_transform.position = [0, 1, 2];
camera_transform.rotate_rl(Math.PI);
camera_move.keyboard_controlled = true;
camera_move.mouse_controlled = true;

Cervus.core.model_loader('models/bird.json').then((models) => {
  for(let i = 0; i < 1000; i++) {
    setTimeout(() => {
      create_bird(
        50 - Math.random() * 100,
        50 - Math.random() * 100,
        50 - Math.random() * 100,
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
        material: Cervus.materials.basic,
        color:  '#ff00ff'
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



game.on('tick', () => {
  game.light_position = camera_transform.position;
});
