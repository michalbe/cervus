import { vec3, mat4 } from 'gl-matrix';

export class Camera {
  constructor(position, lookAt, up) {
    this.forward = [];
    this.up = [];
    this.right = [];

    this.position = position;
    this.moveable = false;

    this.move_speed = 3.5;
    this.rotate_speed = 1.5;

    this.directions = {
      Up: false,
      Right: false,
      Down: false,
      Left: false,
      Forward: false,
      Back: false,

      RotLeft: false,
      RotRight: false,
      RotUp: false,
      RotDown: false
    };

    vec3.subtract(this.forward, lookAt, this.position);
    vec3.cross(this.right, this.forward, up);
    vec3.cross(this.up, this.right, this.forward);

    vec3.normalize(this.forward, this.forward);
    vec3.normalize(this.right, this.right);
    vec3.normalize(this.up, this.up);

    window.addEventListener('keydown', this.keyDownWindowListener.bind(this));
    window.addEventListener('keyup', this.keyUpWindowListener.bind(this));
  }

  getViewMatrix (out) {
    const lookAtVect = [];
    vec3.add(lookAtVect, this.position, this.forward);
    mat4.lookAt(out, this.position, lookAtVect, this.up);
    return out;
  }

  rotateRight(rad) {
    const rightMatrix = mat4.create();
    mat4.rotate(rightMatrix, rightMatrix, rad, vec3.fromValues(0, 0, 1));
    vec3.transformMat4(this.forward, this.forward, rightMatrix);
    this.realign();
  }

  rotateUp(rad) {
    const rightMatrix = mat4.create();
    mat4.rotate(rightMatrix, rightMatrix, rad, vec3.fromValues(1, 0, 0));
    vec3.transformMat4(this.forward, this.forward, rightMatrix);
    this.realign();
  }

  realign() {
    vec3.cross(this.right, this.forward, this.up);
    vec3.cross(this.up, this.right, this.forward);

    vec3.normalize(this.forward, this.forward);
    vec3.normalize(this.right, this.right);
    vec3.normalize(this.up, this.up);
  }

  moveForward(dist) {
    vec3.scaleAndAdd(this.position, this.position, this.forward, dist);
  }

  moveRight(dist) {
    vec3.scaleAndAdd(this.position, this.position, this.right, dist);
  }

  moveUp(dist) {
    vec3.scaleAndAdd(this.position, this.position, this.up, dist);
  }

  keyDownWindowListener(e) {
    if (!this.moveable) {
      return;
    }
    switch(e.code) {
      case 'KeyW':
        this.directions.Forward = true;
        break;
      case 'KeyA':
        this.directions.Left = true;
        break;
      case 'KeyD':
        this.directions.Right = true;
        break;
      case 'KeyS':
        this.directions.Back = true;
        break;
      case 'KeyQ':
        this.directions.Up = true;
        break;
      case 'KeyE':
        this.directions.Down = true;
        break;
      case 'ArrowUp':
        this.directions.RotUp = true;
        break;
      case 'ArrowDown':
        this.directions.RotDown = true;
        break;
      case 'ArrowRight':
        this.directions.RotRight = true;
        break;
      case 'ArrowLeft':
        this.directions.RotLeft = true;
        break;
    }
  }

  keyUpWindowListener(e) {
    if (!this.moveable) {
      return;
    }
    switch(e.code) {
      case 'KeyW':
        this.directions.Forward = false;
        break;
      case 'KeyA':
        this.directions.Left = false;
        break;
      case 'KeyD':
        this.directions.Right = false;
        break;
      case 'KeyS':
        this.directions.Back = false;
        break;
      case 'KeyQ':
        this.directions.Up = false;
        break;
      case 'KeyE':
        this.directions.Down = false;
        break;
      case 'ArrowUp':
        this.directions.RotUp = false;
        break;
      case 'ArrowDown':
        this.directions.RotDown = false;
        break;
      case 'ArrowRight':
        this.directions.RotRight = false;
        break;
      case 'ArrowLeft':
        this.directions.RotLeft = false;
        break;
    }
  }
}
