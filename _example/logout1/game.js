/* global Cervus */

var restaurant = `
    <style>
      .neon {
        width: 100%;
        height: 100%;
        padding: 1em;
        color: #28D7FE;
        font-family: Arial;
        text-style: italic;
        text-shadow: 
        .1vw 0vw .25vw #28D7FE, .2vw 0vw .25vw #28D7FE, .4vw 0vw .25vw #28D7FE, 
        .1vw 0vw .1vw #1041FF, .2vw 0vw 0vw #1041FF, .4vw 0vw 0vw #1041FF,
        .1vw 0vw .1vw #1041FF, .2vw 0vw .1vw #1041FF, .4vw 0vw 0vw #1041FF,
        .1vw 0vw .8vw #1041FF, .2vw 0vw .8vw #1041FF, .4vw 0vw .8vw #1041FF, .2vw 0vw .5vw #1041FF,
        .1vw 0vw .5vw #1041FF, .2vw 0vw .5vw #1041FF, .4vw 0vw .5vw #1041FF, 
        .1vw 0vw 10vw #1041FF, .2vw 0vw 10vw #1041FF, .4vw 0vw 10vw #1041FF;
      }
    </style>
    <div xmlns="http://www.w3.org/1999/xhtml" class="neon">
      Restaurant
    </div>
`;

var bar = `
    <style>
      .neon {
        width: 100%;
        height: 100%;
        padding: 1em;
        color: #A9FFDC;
        background-color: #000;
        font-family: Arial;
        font-style: italic;
        text-shadow: 
        -.1vw 0vw .25vw #A9FFDC, -.2vw 0vw .25vw #A9FFDC, -.4vw 0vw .25vw #A9FFDC, 
        -.1vw 0vw .1vw #00CC2A, -.2vw 0vw .1vw #00CC2A, -.4vw 0vw .1vw #00CC2A,
        -.1vw 0vw .8vw #00CC2A, -.2vw 0vw .8vw #00CC2A, -.4vw 0vw .8vw #00CC2A, .2vw 0vw .5vw #00CC2A,
        -.1vw 0vw .5vw #00CC2A, -.2vw 0vw .5vw #00CC2A, -.4vw 0vw .5vw #00CC2A, 
        -.1vw 0vw 10vw #16FA19, -.2vw 0vw 10vw #16FA19, -.4vw 0vw 10vw #16FA19;
      }
    </style>
    <div xmlns="http://www.w3.org/1999/xhtml" class="neon">
      Bar
    </div>
`;

var jackpots = `
    <style>
      .neon {
        width: 100%;
        height: 100%;
        padding: 1em;
        color: #FED128;
        background-color: #000;
        font-family: Arial;
        font-style: italic;
        text-shadow: 
        -.1vw 0vw .1vw #FED128, -.15vw 0vw .2vw #FED128, -.2vw 0vw .2vw #FED128, 
        -.1vw 0vw 3vw #F0130B, -.2vw 0vw 3vw #F0130B, -.4vw 0vw 3vw #F0130B,
        -.1vw 0vw 5vw #F0130B, -.2vw 0vw 5vw #F0130B, -.4vw 0vw .8vw #F0130B, .2vw 0vw 10vw #F0130B;
      }
    </style>
    <div xmlns="http://www.w3.org/1999/xhtml" class="neon">
      JACKPOTS
    </div>
`;

const game = new Cervus.core.Game({
  width: window.innerWidth,
  height: window.innerHeight,
  far: 1000,
  clear_color: "#000"
});

game.canvas.addEventListener(
  'click', () => game.canvas.requestPointerLock()
);

game.camera.get_component(Cervus.components.Transform).position = [0, 1.5, 0];
game.camera.get_component(Cervus.components.Move).keyboard_controlled = true;
game.camera.get_component(Cervus.components.Move).mouse_controlled = true;

let basic_material = new Cervus.materials.BasicMaterial({
  requires: [
    Cervus.components.Render,
    Cervus.components.Transform
  ]
});

const plane = new Cervus.shapes.Plane();
plane.get_component(Cervus.components.Render).material = basic_material;
plane.get_component(Cervus.components.Render).color = "#000000";
plane.get_component(Cervus.components.Transform).scale = [1000, 1, 1000];
game.add(plane);

{
  const building = new Cervus.core.Entity({
    components: [new Cervus.components.Transform()]
  });
  building.get_component(Cervus.components.Transform).position = [20, 0, 100];

  const box = new Cervus.shapes.Box();
  box.get_component(Cervus.components.Render).material = basic_material;
  box.get_component(Cervus.components.Render).color = "#333333";
  box.get_component(Cervus.components.Transform).scale = [30, 140, 15];
  building.add(box);

  const neon = new Cervus.shapes.Box();
  neon.get_component(Cervus.components.Render).material = new Cervus.materials.BasicMaterial({
    requires: [
      Cervus.components.Render,
      Cervus.components.Transform
    ],
    texture: image_from_dom(restaurant)
  });
  //neon.get_component(Cervus.components.Render).material = basic_material;
  neon.get_component(Cervus.components.Render).color = "#28D7FE";
  neon.get_component(Cervus.components.Transform).position = [0, 60, -10];
  neon.get_component(Cervus.components.Transform).scale = [20, 10, 1];
  building.add(neon);

  game.add(building);
}

{
  const building = new Cervus.core.Entity({
    components: [new Cervus.components.Transform()]
  });
  building.get_component(Cervus.components.Transform).position = [-30, 0, 50];

  const box = new Cervus.shapes.Box();
  box.get_component(Cervus.components.Render).material = basic_material;
  box.get_component(Cervus.components.Render).color = "#222";
  box.get_component(Cervus.components.Transform).scale = [45, 40, 15];
  building.add(box);

  const neon = new Cervus.shapes.Box();
  neon.get_component(Cervus.components.Render).material = new Cervus.materials.BasicMaterial({
    requires: [
      Cervus.components.Render,
      Cervus.components.Transform
    ],
    texture: image_from_dom(bar)
  });
  neon.get_component(Cervus.components.Render).material = basic_material;
  neon.get_component(Cervus.components.Render).color = "#A9FFDC";
  neon.get_component(Cervus.components.Transform).position = [15, 15, -10];
  neon.get_component(Cervus.components.Transform).scale = [10, 5, 1];
  building.add(neon);

  game.add(building);
}

{
  const building = new Cervus.core.Entity({
    components: [new Cervus.components.Transform()]
  });
  building.get_component(Cervus.components.Transform).position = [-30, 0, 100];

  const box = new Cervus.shapes.Box();
  box.get_component(Cervus.components.Render).material = basic_material;
  box.get_component(Cervus.components.Render).color = "#111";
  box.get_component(Cervus.components.Transform).scale = [20, 100, 40];
  building.add(box);

  const neon = new Cervus.shapes.Box();
  neon.get_component(Cervus.components.Render).material = new Cervus.materials.BasicMaterial({
    requires: [
      Cervus.components.Render,
      Cervus.components.Transform
    ],
    texture: image_from_dom(jackpots)
  });
  neon.get_component(Cervus.components.Render).material = basic_material;
  neon.get_component(Cervus.components.Render).color = "#FED128";
  neon.get_component(Cervus.components.Transform).position = [0, 40, -21];
  neon.get_component(Cervus.components.Transform).scale = [20, 10, 1];
  building.add(neon);

  game.add(building);
}


function image_from_dom(html) {
  let data = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
      <foreignObject width="100%" height="100%">
        ${html}
      </foreignObject>
    </svg>`);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject('Error loading image.');
    img.src = `data:image/svg+xml,${data}`;
    if (img.complete) {
      resolve(img);
    }
  });
}

image_from_dom(restaurant).then(image => document.body.appendChild(image));
