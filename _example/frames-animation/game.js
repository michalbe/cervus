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
    Cervus.components.Morph,
  ],
  // texture: '../textures/magica.png',
});

const phong_material = new Cervus.materials.PhongMaterial({
  requires: [
    Cervus.components.Render,
    Cervus.components.Transform,
  ]
});

const [camera_transform, camera_move] = game.camera.get_components(Cervus.components.Transform, Cervus.components.Move);
camera_transform.position = [0, 1, 0]
camera_move.keyboard_controlled = true;
camera_move.mouse_controlled = true;

const floor = new Cervus.shapes.Plane();
const [floor_transform, floor_render] = floor.get_components(Cervus.components.Transform, Cervus.components.Render);
floor_transform.position = [0, 0, 0];
floor_transform.scale = [ 150, 1, 150 ];
floor_render.color = '#0f0';
floor_render.material = phong_material;
game.add(floor);

let animated_model;
Cervus.core.model_loader([
  // 'models/00.json',
  'models/01.json',
  'models/01.json',
  // 'models/02.json',
  // 'models/03.json'
]).then((frames) => {
  frames = [].concat(...frames),
  console.log(frames);
  animated_model = new Cervus.core.Entity({
    components: [
      new Cervus.components.Transform({
        position: [0, 0, 2],
        scale: [0.1, 0.1, 0.1]
      }),
      new Cervus.components.Render({
        material: material,
        color:  '#ff00ff',
        // vertices: frames[0].vertices,
        // indices: frames[0].indices,
        // normals: frames[0].normals,
        // uvs: frames[0].uvs[0]
        // frames: frames
      }),
      new Cervus.components.Morph({
        frame_time: 16,
        // frames: frames
      })
    ]
  });
  animated_model.get_component(Cervus.components.Morph).frames = frames;

  animated_model.get_component(Cervus.components.Morph).create_buffers();
  game.add(animated_model);

    // animated_model.get_component(Cervus.components.Transform).rotate_rl(Math.PI);
}).catch(console.error);

const light = game.light;
light.get_component(Cervus.components.Transform).set({
  position: [0, 0.5, 0]
});
light.get_component(Cervus.components.Light).set({
  intensity: 0.4,
  // color: 'F0F'
});
game.on('tick', () => {
  // animated_model.get_component(Cervus.components.Transform).rotate_rl(16/1000);
  // light_transform.position = camera_transform.position;
});
