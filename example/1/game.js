/* global Cervus */

// const material = 'shadow_phong';
const material = 'phong';

const game = new Cervus.Game({
  width: window.innerWidth,
  height: window.innerHeight,
  movable_camera: false, //true
  // dom: document.body,
  // fps: 1
});

const cube2 = new Cervus.shapes.Box({
  material: material
});
cube2.position.y = -10;
cube2.position.x = -5;
cube2.position.z = 3;
cube2.color = "#FF00FF";
game.add(cube2);

const cube8 = new Cervus.shapes.Box({
  material: material
});
cube8.position = {x: 0, z: 0, y: -5};
cube8.color = "#ffffff";
// game.add(cube8);

const cube = new Cervus.shapes.Box({
  material: 'basic'//material
});
cube.position.y = -12;
cube.position.x = 3;
cube.color = "#BADA55";
cube.scale.x = cube.scale.z = 2;
game.add(cube);

const sphere = new Cervus.shapes.Sphere({
  material: material,
  color: '#ff0000',
  rotation: {
    x: Math.PI/4,
    z: Math.PI/4,
    y: 0
  }
});
sphere.position.y = -10;
sphere.position.x = 3;
sphere.scale = {x: 0.5, z:0.5, y: 0.5};
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
plane.scale = {x: 100, z:100, y:1 };
game.add(plane);

const plane3 = new Cervus.shapes.Plane({
  material: material,
  color: '#CCCCCC'
});

plane3.position.y = -15;
plane3.position.z = -1.5;
plane3.scale = {x: 150, z: 1, y: 150 };
game.add(plane3);

const plane4 = new Cervus.shapes.Plane({
  material: material,
  color: '#00FF00'
});

plane4.position.y = -15;
plane4.position.z = 0;
plane4.rotation.x = Math.PI/2;
plane4.scale = {x: 10, z: 1, y: 10 };
game.add(plane4);

const plane2 = new Cervus.shapes.Plane({
  material: material,
  color: '#cc00cc',
});
plane2.position.y = -13;
plane2.position.z = 1;
plane2.position.x = -3;
plane2.rotation.x = -Math.PI/2;
plane2.scale = {x: 2, z:2, y:1 };
game.add(plane2);

//
// const light = new Cervus.shapes.Sphere({
//   material: 'phong',
//   color: '#32cd32'
// });
// light.position.x = window.lightPosition[0];
// light.position.z = window.lightPosition[1];
// light.position.y = window.lightPosition[2];
// light.scale = {x: 0.1, z: 0.1, y: 0.1};
// game.add(light);

game.add_frame_listener('cube_rotation', (delta) => {
  cube.rotation.z = sphere.rotation.x = delta / 1000;
  if (cube2.position.x > 5) {
    dir = -1;
  } else if (cube2.position.x < -5) {
    dir = 1;
  }

  sphere.position.x += 0.06 * dir * -1;
  cube2.position.x += 0.06 * dir;
  //
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
  // light.position.z = window.lightPosition[1];
  // light.position.y = window.lightPosition[2];

});
