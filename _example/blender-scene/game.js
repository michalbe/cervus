/* global Cervus */

const game = new Cervus.core.Game({
  width: window.innerWidth,
  height: window.innerHeight,
  light_intensity: 0.9,
  projection: 'ortho',
  fov: 150
  // fps: 1
});

const material = new Cervus.materials.PhongMaterial({
  requires: [
    Cervus.components.Render,
    Cervus.components.Transform
  ]
});

const material2 = new Cervus.materials.WireframeMaterial({
  requires: [
    Cervus.components.Render,
    Cervus.components.Transform
  ]
});

game.camera.get_component(Cervus.components.Move).keyboard_controlled = true;
game.camera.get_component(Cervus.components.Move).move_speed = 10;

game.setup_perspective_camera();
const persp_matrix = JSON.parse(JSON.stringify(game.projMatrix));
game.setup_ortho_camera();
const ortho_matrix = JSON.parse(JSON.stringify(game.projMatrix));

// console.log({ target_matrix});
// console.log(game.projMatrix);
const meshes = [];
Cervus.core.model_loader('models/scene.json')
.then((models) => {
  console.log(models);

  models.forEach((mesh) => {
      let mesh_in = new Cervus.core.Entity({
        components: [
          new Cervus.components.Transform({
            position: mesh.position,
            scale: mesh.scale
          }),
          new Cervus.components.Render({
            vertices: mesh.vertices,
            indices: mesh.indices,
            normals: mesh.normals,
            material: material,
            color:  '111'
          })
        ]
      });

      mesh_in.get_component(Cervus.components.Transform).rotate_ud(-Math.PI/2);

    meshes.push(mesh_in);
      game.add(mesh_in);
    });
});

let dir = -1;
let ticks = 0;
game.on('tick', () => {
  return;
  ticks++;
  game.light_position = game.camera.get_component(Cervus.components.Transform).position;
  // meshes.forEach((mesh, i) => {
  //   // if (i=== 2) return;
  //   // console.log(mesh.color);
  // });
  if (game.fov >= 60 && dir == 5) {
    dir = -5;
  } else {
    dir = 5;
  }

  game.fov += dir;
  game.setup_perspective_camera();

  if (ticks % 5 === 0) {
    const wired_mesh = meshes[~~(Math.random() * meshes.length)];
    wired_mesh.get_component(Cervus.components.Render).material = material2;

    setTimeout(() => {
      wired_mesh.get_component(Cervus.components.Render).material = material;
    }, 500);
  }

});

// setInterval(() => {
//   game.setup_ortho_camera();

//   setTimeout(() => {
//     game.setup_perspective_camera();
//   }, 500);
// }, 2000);

// setInterval(() => {

// }, 100);

window.go_perspe = function() {
  const camera_tween = new Cervus.tweens.MatrixTween({
    object: game.projMatrix,
    to: persp_matrix,
    time: 2000,
    game: game
  });

  let time = new Date();
  camera_tween.start().then(() => {
    console.log('color done!', new Date() - time)
    // console.log(target_matrix);
    // console.log(game.projMatrix);
  });
}


window.go_ortho = function() {
  const camera_tween = new Cervus.tweens.MatrixTween({
    object: game.projMatrix,
    to: ortho_matrix,
    time: 2000,
    game: game
  });

  let time = new Date();
  camera_tween.start().then(() => {
    console.log('color done!', new Date() - time)
    // console.log(target_matrix);
    // console.log(game.projMatrix);
  });
}
