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
    Cervus.components.Animation
  ],
  color: '#ff00ff'
  // texture: '../textures/monster.jpg',
  // texture: '../textures/MAW_diffuse.png',
  // normal_map: '../textures/MAW_normal.png',
});

const [camera_transform, camera_move] = game.camera.get_components(Cervus.components.Transform, Cervus.components.Move);
camera_transform.position = [-1.7, 3.22, 3]
camera_move.keyboard_controlled = true;
// camera_move.mouse_controlled = true;

let animated_model;
fetch('models/robot.json').then((data) => {
  return data.json();
}).then((json) => {
  animated_model = new Cervus.core.Entity({
    components: [
      new Cervus.components.Transform({
        position: [-2, 0, 15],
        // scale: [1, 1, 1]
      }),
      new Cervus.components.Render({
        material: material,
        color:  '#ff00ff',
        vertices: json.vertices,
        indices: json.indices,
        normals: json.normals,
        uvs: json.uvs
      }),
      new Cervus.components.Animation({
        skin_indices: json.skinIndices,
        skin_weights: json.skinWeights,
        bones: json.bones,
        frames: json.frames
      })
    ]
  });

  animated_model.get_component(Cervus.components.Animation).create_buffers();
  animated_model.get_component(Cervus.components.Transform).rotate_rl(Math.PI/0.75);
  game.add(animated_model);
}).catch(console.error);

game.on('tick', () => {
  // animated_model.get_component(Cervus.components.Transform).rotate_rl(16/1000);
});
