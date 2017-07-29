import { vec3, mat4 } from 'gl-matrix';

export class Camera {
  constructor(position, lookAt, up) {
    this.forward = vec3.create();
    this.up = vec3.create();
    this.right = vec3.create();

    this.position = position;
    this.moveable = false;

    this.MoveForwardSpeed = 3.5;
    this.RotateSpeed = 1.5;

    this.directions = {
      Up: false,
      Right: false,
      Down: false,
      Left: false,
      Forward: false,
      Back: false,

      RotLeft: false,
      RotRight: false,
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
    const lookAt = vec3.create();
    vec3.add(lookAt, this.position, this.forward);
    mat4.lookAt(out, this.position, lookAt, this.up);
    return out;
  }

  rotateRight(rad) {
    const rightMatrix = mat4.create();
    mat4.rotate(rightMatrix, rightMatrix, rad, vec3.fromValues(0, 1, 0));
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
      case 'ArrowUp':
        this.directions.Up = true;
        break;
      case 'ArrowDown':
        this.directions.Down = true;
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
      case 'ArrowUp':
        this.directions.Up = false;
        break;
      case 'ArrowDown':
        this.directions.Down = false;
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
