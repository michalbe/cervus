/* global Cervus */

const game = new Cervus.core.Game({
  width: window.innerWidth,
  height: window.innerHeight,
  light_intensity: 0.9
  // fps: 1
});

game.camera.get_component(Cervus.components.Move).keyboard_controlled = true;
game.camera.get_component(Cervus.components.Move).move_speed = 10;

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
            material: Cervus.materials.phong,
            color:  '111'
          })
        ]
      });

      mesh_in.get_component(Cervus.components.Transform).rotate_ud(-Math.PI/2);

      game.add(mesh_in);
    });
});

game.on('tick', () => {
  game.light_position = game.camera.get_component(Cervus.components.Transform).position;
  // meshes.forEach((mesh, i) => {
  //   // if (i=== 2) return;
  //   // console.log(mesh.color);
  // });
});
