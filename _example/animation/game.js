/* global Cervus */

const get_scaling = (out, mat) => {
  let m11 = mat[0];
  let m12 = mat[1];
  let m13 = mat[2];
  let m21 = mat[4];
  let m22 = mat[5];
  let m23 = mat[6];
  let m31 = mat[8];
  let m32 = mat[9];
  let m33 = mat[10];
  out[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
  out[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
  out[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);
  return out;
};


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

const frames = [];

let position, scale;

fetch('models/ptak.json')
.then((data) => {
  return data.json();
})
.then((json) => {
  console.log(json);
  json.rootnode.children.forEach((child) => {
    if (!child.meshes) {
      return;
    }

    child.meshes.forEach((mesh_i, i) => {
      frames.push({
        vertices: json.meshes[mesh_i].vertices,
        indices: [].concat(...json.meshes[mesh_i].faces),
        normals: json.meshes[mesh_i].normals
      });

      if (i > 0) {
        return;
      }

      scale = get_scaling([], child.transformation);

      position = [
        child.transformation[3],
        child.transformation[7],
        child.transformation[11]
      ];
    });
  });
});




const create_bird = (x = 0, y = 0, z = 0) => {
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
}
setTimeout(() => {
  for(let i=0; i< 5000; i++) {
    setTimeout(() => {
      create_bird(
        50 - Math.random() * 100,
        50 - Math.random() * 100,
        50 - Math.random() * 100
      );
    }, 0);
    // create_bird();
  }
}, 1000);



game.add_frame_action(() => {
  game.light_position = game.camera.position;
});
