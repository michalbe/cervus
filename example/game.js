/* global Cervus */

const material = 'shadow_phong';

const game = new Cervus.Game({
  width: window.innerWidth,
  height: window.innerHeight,
  movable_camera: true
  // dom: document.body,
  // fps: 1
});

const cube2 = new Cervus.shapes.Box({
  material: material
});
cube2.position.z = -10;
cube2.position.x = -5;
cube2.position.y = 3;
cube2.color = "#FF00FF";
game.add(cube2);

const cube8 = new Cervus.shapes.Box({
  material: material
});
cube8.position = {x: 0, y: 0, z: -5};
cube8.color = "#ffffff";
// game.add(cube8);

const cube = new Cervus.shapes.Box({
  material: material
});
cube.position.z = -12;
cube.position.x = 3;
cube.color = "#BADA55";
cube.scale.x = cube.scale.y = 2;
game.add(cube);

const sphere = new Cervus.shapes.Sphere({
  material: material,
  color: '#ff0000',
  rotation: {
    x: Math.PI/4,
    y: Math.PI/4,
    z: 0
  }
});
sphere.position.z = -10;
sphere.position.x = 3;
sphere.scale = {x: 0.5, y:0.5, z: 0.5};
// sphere.color = '#ffffff';
game.add(sphere);

let dir = 1;

const plane = new Cervus.shapes.Plane({
  material: material,
  color: '#CCCCCC'
});

plane.position.z = -50;
plane.position.y = -2;
plane.rotation.x = -Math.PI/2 + 0.03;
plane.scale = {x: 100, y:100, z:1 };
game.add(plane);

const plane3 = new Cervus.shapes.Plane({
  material: material,
  color: '#ffffff'
});

plane3.position.z = -15;
plane3.position.y = 0;
plane3.scale = {x: 15, y: 7, z: 1 };
game.add(plane3);

const plane2 = new Cervus.shapes.Plane({
  material: material,
  color: '#cc00cc',
});
plane2.position.z = -12;
plane2.position.y = 1;
plane2.position.x = -3;
plane2.rotation.x = 0;//Math.PI/2;
plane2.scale = {x: 2, y:2, z:1 };
game.add(plane2);


const light = new Cervus.shapes.Sphere({
  material: 'phong',
  color: '#32cd32'
});
light.position.x = window.lightPosition[0];
light.position.y = window.lightPosition[1];
light.position.z = window.lightPosition[2];
light.scale = {x: 0.1, y: 0.1, z: 0.1};
game.add(light);

game.add_frame_listener('cube_rotation', (delta) => {
  cube.rotation.x = sphere.rotation.x = light.rotation.x = delta / 1000;
  if (cube2.position.x > 5) {
    dir = -1;
  } else if (cube2.position.x < -5) {
    dir = 1;
  }

  sphere.position.x += 0.06 * dir * -1;
  cube2.position.x += 0.06 * dir;

  // var lightDisplacementInputAngle = 0;
  // lightDisplacementInputAngle += delta / 2337;
  //
  // var xDisplacement  = Math.sin(lightDisplacementInputAngle) * 10;
  // window.lightPosition = [
  //   xDisplacement,//window.lightPosition[0],
  //   window.lightPosition[1],
  //   window.lightPosition[2],
  // ];
  //
  // light.position.x = window.lightPosition[0];
  // light.position.y = window.lightPosition[1];
  // light.position.z = window.lightPosition[2];

});


const wall = new Cervus.shapes.Plane({
  material: material,
  color: '#ffffff',
});
wall.position.z = -10;
wall.position.x = -15;
wall.position.y = 0;
// wall.rotation.x = Math.PI;
wall.rotation.y = Math.PI/2;
wall.scale = {x: 15, y:7, z:1 };
game.add(wall);

const wall2 = new Cervus.shapes.Plane({
  material: material,
  color: '#ffffff',
});
wall2.position.z = -10;
wall2.position.x = 15;
wall2.position.y = 0;
// wall.rotation.x = Math.PI;
wall2.rotation.y = -Math.PI/2;
wall2.scale = {x: 15, y:7, z:1 };
game.add(wall2);

const wall3 = new Cervus.shapes.Plane({
  material: material,
  color: '#ffffff',
});
wall3.position.z = 5;
// wall3.position.x = 15;
wall3.position.y = 0;
// wall.rotation.x = Math.PI;
wall3.rotation.y = Math.PI;
wall3.scale = {x: 15, y:7, z:1 };
game.add(wall3);

const wall5 = new Cervus.shapes.Plane({
  material: material,
  color: '#ffffff',
});
wall5.position.z = -3;
// wall3.position.x = 15;
wall5.position.y = 7;
// wall.rotation.x = Math.PI;
wall5.rotation.x = Math.PI/2;
wall5.scale = {x: 15, y:15, z:1 };
game.add(wall5);

// document.body.addEventListener('click', () => {
//   if (cube.material === 'basic') {
//     cube.material = cube2.material = material;
//   } else {
//     cube.material = cube2.material = 'basic';
//   }
// });
