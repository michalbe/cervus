/* global Cervus */

const game = new Cervus.core.Game({
  width: window.innerWidth,
  height: window.innerHeight,
  light_intensity: 0.4,
  // clear_color: 'ff00ff'
  // fps: 10
});

game.camera.position = [0, 1, 2];
game.camera.rotate_rl(Math.PI);
game.camera.keyboard_controlled = true;
// game.camera.mouse_controlled = true;

Cervus.core.model_loader('models/bird.json').then((models) => {
  for(let i=0; i< 5000; i++) {
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
  animated_model = new Cervus.core.AnimatedEntity({
    material: Cervus.materials.basic,
    color:  '#ff00ff',
    frame_time: 16,
    position: [x, y, z],
    scale: scale
  });
  animated_model.frames = frames;
  animated_model.rotate_ud(Math.PI * 1.5);
  animated_model.create_buffers();
  // animated_model.current_tick = ~~(Math.random()*100);
  // animated_model.current_frame = ~~(Math.random()*frames.length);
  // animated_model.next_frame = animated_model.get_next_frame();
  game.add(animated_model);
};



game.add_frame_action(() => {
  game.light_position = game.camera.position;
});
