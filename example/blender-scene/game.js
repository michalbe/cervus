/* global Cervus */

const material = 'phong';
const meshes = [];
const colors = ['#00ff00', '#A52A2A', '#006400'];

const game = new Cervus.Game({
  width: window.innerWidth,
  height: window.innerHeight,
  movable_camera: true
  // dom: document.body,
  // fps: 1
});

// const light = new Cervus.shapes.Sphere({
//   material: 'phong',
//   color: '#32cd32'
// });
//
// light.position.z = -50;
// // light.scale = {x: 0.1, y: 0.1, z: 0.1};
// game.add(light);

fetch('models/scene.json')
.then((data) => {
  return data.json();
})
.then((json) => {
  console.log(json);
  // json.meshes.forEach((mesh, i) => {
  //   let col = ~~(Math.random() * 100);
  //   if (col < 10) {
  //     col = '0' + col;
  //   }
  //   // meshes.push(new Cervus.Entity({
  //   //   vertices: mesh.vertices,
  //   //   indices: mesh.faces,
  //   //   normals: mesh.normals
  //   // }));
  //   let mesh_in = new Cervus.Entity({
  //     vertices: mesh.vertices,
  //     indices: [].concat.apply([], mesh.faces),
  //     normals: mesh.normals,
  //     material: 'phong',
  //     color:  '#' + col + col + col//colors[i]
  //   });
  //   // mesh_in.scale = {x: 0.1, y: 0.1, z: 0.1};
  //   game.add(mesh_in);
  //   meshes.push(mesh_in);
  // });

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
        material: 'phong',
        color:  '#FFFFFF' //+ col + 'ff' +  col//colors[i]
      });

      let transform = mat4.getTranslation([], child.transformation);
      let scale = mat4.getScaling([], child.transformation);
      let rotation = mat4.getRotation([], child.transformation);

      console.log(rotation);
      mesh_in.position = {
        x: child.transformation[3],
        y: child.transformation[7],
        z: child.transformation[11]
      };
      // mesh_in.position = {
      //   x: transform[0],
      //   y: transform[1],
      //   z: transform[2]
      // };

      mesh_in.scale = {
        x: scale[0],
        y: scale[1],
        z: scale[2]
      };

      mesh_in.rotation = {
        x: rotation[0],
        y: rotation[1],
        z: rotation[2]
      };

      game.add(mesh_in);
    });
  });
  // meshes.forEach((Mesh) => {
  //   var mesh_instance = new Mesh({
  //     material: 'phong',
  //     color: '#00ffff'
  //   });
  //
  //   game.add(mesh_instance);
  // });
});

// game.add_frame_listener('elo', (delta) => {
//   meshes.forEach((mesh, i) => {
//     // if (i=== 2) return;
//     // console.log(mesh.color);
//   });
// });
