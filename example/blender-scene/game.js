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

const get_rotation = (out, mat) => {
  // Algorithm taken from http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
  let trace = mat[0] + mat[5] + mat[10];
  let S = 0;
  if (trace > 0) {
    S = Math.sqrt(trace + 1.0) * 2;
    out[3] = 0.25 * S;
    out[0] = (mat[6] - mat[9]) / S;
    out[1] = (mat[8] - mat[2]) / S;
    out[2] = (mat[1] - mat[4]) / S;
  } else if ((mat[0] > mat[5])&(mat[0] > mat[10])) {
    S = Math.sqrt(1.0 + mat[0] - mat[5] - mat[10]) * 2;
    out[3] = (mat[6] - mat[9]) / S;
    out[0] = 0.25 * S;
    out[1] = (mat[1] + mat[4]) / S;
    out[2] = (mat[8] + mat[2]) / S;
  } else if (mat[5] > mat[10]) {
    S = Math.sqrt(1.0 + mat[5] - mat[0] - mat[10]) * 2;
    out[3] = (mat[8] - mat[2]) / S;
    out[0] = (mat[1] + mat[4]) / S;
    out[1] = 0.25 * S;
    out[2] = (mat[6] + mat[9]) / S;
  } else {
    S = Math.sqrt(1.0 + mat[10] - mat[0] - mat[5]) * 2;
    out[3] = (mat[1] - mat[4]) / S;
    out[0] = (mat[8] + mat[2]) / S;
    out[1] = (mat[6] + mat[9]) / S;
    out[2] = 0.25 * S;
  }
  return out;
};


const game = new Cervus.Game({
  width: window.innerWidth,
  height: window.innerHeight,
  keyboard_controlled_camera: true,
  light_intensity: 0.4
  // fps: 1
});


fetch('models/scene.json')
.then((data) => {
  return data.json();
})
.then((json) => {
  console.log(json);

  json.rootnode.children.forEach((child) => {
    let col = 20 + ~~(Math.random() * 80);
    if (col < 10) {
      col = '0' + col;
    }

    if (!child.meshes) {
      return;
    }

    child.meshes.forEach((mesh_i) => {
      let mesh_in = new Cervus.Entity({
        vertices: json.meshes[mesh_i].vertices,
        indices: [].concat.apply([], json.meshes[mesh_i].faces),
        normals: json.meshes[mesh_i].normals,
        material: new Cervus.materials.Phong,
        color:  '#000000',
      });

      // mesh_in.local_matrix = child.transformation;
      let scale = get_scaling([], child.transformation);
      let rotation = get_rotation([], child.transformation);

      mesh_in.position = [
        child.transformation[3],
        child.transformation[7],
        child.transformation[11]
      ];

      mesh_in.scale = scale;

      mesh_in.rotate_ud(-Math.PI/2);

      game.add(mesh_in);
    });
  });
});

game.add_frame_action(() => {
  // game.light_position = game.camera.position;

  // meshes.forEach((mesh, i) => {
  //   // if (i=== 2) return;
  //   // console.log(mesh.color);
  // });
});
