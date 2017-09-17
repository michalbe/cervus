/* global Cervus */

const game = new Cervus.core.Game({
  width: window.innerWidth,
  height: window.innerHeight,
  far: 1000
});

game.canvas.addEventListener(
  'click', () => game.canvas.requestPointerLock()
);

game.camera.get_component(Cervus.components.Transform).position = [0, 1.5, 0];
game.camera.get_component(Cervus.components.Move).keyboard_controlled = true;
game.camera.get_component(Cervus.components.Move).mouse_controlled = true;

const material = new Cervus.materials.BasicMaterial({
  components: [Cervus.components.Render, Cervus.components.Transform]
});

const plane = new Cervus.shapes.Plane();
plane.get_component(Cervus.components.Render).material = material;
plane.get_component(Cervus.components.Render).color = "#000000";
plane.get_component(Cervus.components.Transform).scale = [1000, 1, 1000];
game.add(plane);

for (let i = 0; i < 20; i++) {
  const sign = Math.cos(i * Math.PI);
  const x = 75 + 100 * Math.sin(i * Math.PI / 6);
  const box = new Cervus.shapes.Box();
  const [box_transform, box_render] = box.get_components(Cervus.components.Transform, Cervus.components.Render);
  box_render.material = Cervus.materials.basic;
  box_render.color = "#000000";
  box_transform.position = [sign * x, 20, 20 * i];
  box_transform.scale = [90, 40, 15];
  game.add(box);
}
