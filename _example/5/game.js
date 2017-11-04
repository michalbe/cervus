/* global Cervus */
const material = new Cervus.materials.PhongMaterial({
  requires: [
    Cervus.components.Render,
    Cervus.components.Transform
  ],
  texture: Cervus.core.image_loader('../textures/4.png'),
  normal_map: Cervus.core.image_loader('../textures/normal2.jpg')
});

const phong_material = new Cervus.materials.PhongMaterial({
  requires: [
    Cervus.components.Render,
    Cervus.components.Transform
  ]
});

const game = new Cervus.core.Game({
  width: window.innerWidth,
  height: window.innerHeight,
  // clear_color: 'f0f'
  // fps: 1
});
game.camera.get_component(Cervus.components.Move).keyboard_controlled = true;
// game.camera.get_component(Cervus.components.Move).mouse_controlled = true;

// By default all entities face the user.
// Rotate the camera to see the scene.
const camera_transform = game.camera.get_component(Cervus.components.Transform);
camera_transform.position = [0, 2, 5];
camera_transform.rotate_rl(Math.PI);
// game.camera.keyboard_controlled = true;

const plane = new Cervus.shapes.Plane();
const plane_transform = plane.get_component(Cervus.components.Transform);
const plane_render = plane.get_component(Cervus.components.Render);
plane_transform.scale = [100, 1, 100];
plane_render.material = phong_material;
plane_render.color = "#eeeeee";
game.add(plane);

const cube = new Cervus.shapes.Box();
const cube_transform = cube.get_component(Cervus.components.Transform);
const cube_render = cube.get_component(Cervus.components.Render);
cube_render.material = material;
cube_render.color = "#00ff00";
cube_transform.position = [0, 0.5, -1];

const group = new Cervus.core.Entity({
  components: [
    new Cervus.components.Transform()
  ]
});
game.add(group);
group.add(cube);
//

game.on('tick', () => {
  // group.get_component(Cervus.components.Transform).rotate_rl(16/1000);

  game.light.get_component(Cervus.components.Transform).position = game.camera.get_component(Cervus.components.Transform).position;
});
