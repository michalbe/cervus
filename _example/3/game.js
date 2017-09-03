/* global Cervus */

const game = new Cervus.core.Game({
  width: window.innerWidth,
  height: window.innerHeight,
  far: 1000
});

game.canvas.addEventListener(
  'click', () => game.canvas.requestPointerLock()
);

game.camera.position = [0, 1.5, 0];
game.camera.keyboard_controlled = true;
game.camera.mouse_controlled = true;

game.add(new Cervus.shapes.Plane({
  material: Cervus.materials.phong,
  color: "#000000",
  scale: [1000, 1, 1000]
}));

for (let i = 0; i < 20; i++) {
  const sign = Math.cos(i * Math.PI);
  const x = 75 + 100 * Math.sin(i * Math.PI / 6);
  game.add(new Cervus.shapes.Box({
    material: Cervus.materials.basic,
    color: "#000000",
    position: [sign * x, 20, 20 * i],
    scale: [90, 40, 15]
  }));
}
