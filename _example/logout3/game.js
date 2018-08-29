/* global Cervus */

class Group extends Cervus.core.Entity {
  constructor(options) {
    super(Object.assign({
      components: [
          new Cervus.components.Transform()
      ]
    }, options));
  }
}

function hex_to_rgb(hex) {
  if (hex.charAt(0) === '#') {
    hex = hex.substr(1);
  }

  if (hex.length === 3) {
    hex = hex.split('').map(
      el => el + el
    ).join('');
  }

  return hex.match(/.{1,2}/g).map(
    el => parseFloat((parseInt(el, 16) / 255).toFixed(2))
  );
}

const game = new Cervus.core.Game({
  width: window.innerWidth,
  height: window.innerHeight,
  far: 1000,
  clear_color: "222"
});

game.canvas.addEventListener(
  'click', () => game.canvas.requestPointerLock()
);

game.camera.get_component(Cervus.components.Transform).position = [0, 20, 0];
game.camera.get_component(Cervus.components.Move).keyboard_controlled = true;
game.camera.get_component(Cervus.components.Move).mouse_controlled = true;
game.camera.get_component(Cervus.components.Move).move_speed = 35;

game.light.get_component(Cervus.components.Transform).position = [0, 0, 0];
game.light.get_component(Cervus.components.Light).intensity = 0.99;
game.light.get_component(Cervus.components.Light).color = "#fff";

const cube = new Cervus.shapes.Box();
const cube_render = cube.get_component(Cervus.components.Render);

let neon_material = new Cervus.materials.BasicMaterial({
  requires: [
    Cervus.components.Render,
    Cervus.components.Transform
  ]
});

neon_material.add_fog({
  color: hex_to_rgb("222"),
  distance: new Float32Array([100, 200]),
});

let building_material = new Cervus.materials.PhongMaterial({
  requires: [
    Cervus.components.Render,
    Cervus.components.Transform
  ]
});

building_material.add_fog({
  color: hex_to_rgb("222"),
  distance: new Float32Array([5, 150]),
});

const wireframe = new Cervus.materials.WireframeMaterial({
  requires: [
    Cervus.components.Render,
    Cervus.components.Transform
  ]
});

const plane = new Cervus.shapes.Box();
plane.get_component(Cervus.components.Render).material = building_material;
plane.get_component(Cervus.components.Render).color = "f00";
plane.get_component(Cervus.components.Transform).scale = [1000, 1, 1000];
game.add(plane);

{
  const building = new Group();
  building.get_component(Cervus.components.Transform).position = [20, 0, 100];
  game.add(building);

  const box = new Cervus.shapes.Box();
  box.get_component(Cervus.components.Render).material = building_material;
  box.get_component(Cervus.components.Render).color = "000";
  box.get_component(Cervus.components.Transform).scale = [30, 140, 15];
  building.add(box);

  const neon = new Cervus.shapes.Box();
  neon.get_component(Cervus.components.Render).material = neon_material;
  neon.get_component(Cervus.components.Render).color = "#28D7FE";
  neon.get_component(Cervus.components.Transform).position = [0, 60, -10];
  neon.get_component(Cervus.components.Transform).scale = [20, 10, 1];
  building.add(neon);

  building.add(new Cervus.core.Entity({
    components: [
      new Cervus.components.Transform({
        position: [0, 60, -12]
      }),
      new Cervus.components.Light({
        color: '#28D7FE',
        intensity: 0.9
      }),
      // new Cervus.components.Render({
      //   color: '#F00',
      //   material: wireframe,
      //   indices: cube_render.indices,
      //   vertices: cube_render.vertices
      // })
    ]
  }));
}

{
  const building = new Group();
  building.get_component(Cervus.components.Transform).position = [-30, 0, 50];
  game.add(building);

  const box = new Cervus.shapes.Box();
  box.get_component(Cervus.components.Render).material = building_material;
  box.get_component(Cervus.components.Render).color = "000";
  box.get_component(Cervus.components.Transform).scale = [45, 40, 15];
  building.add(box);

  const neon = new Cervus.shapes.Box();
  neon.get_component(Cervus.components.Render).material = neon_material;
  neon.get_component(Cervus.components.Render).color = "#A9FFDC";
  neon.get_component(Cervus.components.Transform).position = [15, 15, -10];
  neon.get_component(Cervus.components.Transform).scale = [10, 5, 1];
  building.add(neon);

  building.add(new Cervus.core.Entity({
    components: [
      new Cervus.components.Transform({
        position: [15, 15, -12]
      }),
      new Cervus.components.Light({
        color: '#A9FFDC',
        intensity: 0.9
      }),
      // new Cervus.components.Render({
      //   color: '#F00',
      //   material: wireframe,
      //   indices: cube_render.indices,
      //   vertices: cube_render.vertices
      // })
    ]
  }));
}

{
  const building = new Group();
  building.get_component(Cervus.components.Transform).position = [-30, 0, 100];
  game.add(building);

  const box = new Cervus.shapes.Box();
  box.get_component(Cervus.components.Render).material = building_material;
  box.get_component(Cervus.components.Render).color = "000";
  box.get_component(Cervus.components.Transform).scale = [20, 100, 40];
  building.add(box);

  const neon = new Cervus.shapes.Box();
  neon.get_component(Cervus.components.Render).material = neon_material;
  neon.get_component(Cervus.components.Render).color = "fed128";
  neon.get_component(Cervus.components.Transform).position = [0, 40, -21];
  neon.get_component(Cervus.components.Transform).scale = [20, 10, 1];
  building.add(neon);

  building.add(new Cervus.core.Entity({
    components: [
      new Cervus.components.Transform({
        position: [0, 40, -22]
      }),
      new Cervus.components.Light({
        color: '#FED128',
        intensity: 0.9
      }),
      // new Cervus.components.Render({
      //   color: '#F00',
      //   material: wireframe,
      //   indices: cube_render.indices,
      //   vertices: cube_render.vertices
      // })
    ]
  }));

}
