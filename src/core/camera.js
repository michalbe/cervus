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

    this.dir = {
      u: false,
      Right: false,
      Down: false,
      Left: false,
      Forward: false,
      Back: false,

      r_l: false,
      r_r: false,
      r_u: false,
      r_d: false
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
        this.dir.Forward = true;
        break;
      case 'KeyA':
        this.dir.Left = true;
        break;
      case 'KeyD':
        this.dir.Right = true;
        break;
      case 'KeyS':
        this.dir.Back = true;
        break;
      case 'KeyQ':
        this.dir.u = true;
        break;
      case 'KeyE':
        this.dir.Down = true;
        break;
      case 'ArrowUp':
        this.dir.r_u = true;
        break;
      case 'ArrowDown':
        this.dir.r_d = true;
        break;
      case 'ArrowRight':
        this.dir.r_r = true;
        break;
      case 'ArrowLeft':
        this.dir.r_l = true;
        break;
    }
  }

  keyUpWindowListener(e) {
    if (!this.moveable) {
      return;
    }
    switch(e.code) {
      case 'KeyW':
        this.dir.Forward = false;
        break;
      case 'KeyA':
        this.dir.Left = false;
        break;
      case 'KeyD':
        this.dir.Right = false;
        break;
      case 'KeyS':
        this.dir.Back = false;
        break;
      case 'KeyQ':
        this.dir.u = false;
        break;
      case 'KeyE':
        this.dir.Down = false;
        break;
      case 'ArrowUp':
        this.dir.r_u = false;
        break;
      case 'ArrowDown':
        this.dir.r_d = false;
        break;
      case 'ArrowRight':
        this.dir.r_r = false;
        break;
      case 'ArrowLeft':
        this.dir.r_l = false;
        break;
    }
  }

  update(tick_length) {
    if (this.dir.Forward && !this.dir.Back) {
      this.moveForward(tick_length / 1000 * this.move_speed);
    }

    if (this.dir.Back && !this.dir.Forward) {
      this.moveForward(-tick_length / 1000 * this.move_speed);
    }

    if (this.dir.Right && !this.dir.Left) {
      this.moveRight(tick_length / 1000 * this.move_speed);
    }

    if (this.dir.Left && !this.dir.Right) {
      this.moveRight(-tick_length / 1000 * this.move_speed);
    }

    if (this.dir.u && !this.dir.Down) {
      this.moveUp(tick_length / 1000 * this.move_speed);
    }

    if (this.dir.Down && !this.dir.u) {
      this.moveUp(-tick_length / 1000 * this.move_speed);
    }

    if (this.dir.r_r && !this.dir.r_l) {
      this.rotateRight(-tick_length / 1000 * this.rotate_speed);
    }

    if (this.dir.r_l && !this.dir.r_r) {
      this.rotateRight(tick_length / 1000 * this.rotate_speed);
    }

    if (this.dir.RotUp && !this.dir.RotDown) {
      this.rotateUp(-tick_length / 1000 * this.rotate_speed);
    }

    if (this.dir.RotDown && !this.dir.RotUp) {
      this.rotateUp(tick_length / 1000 * this.rotate_speed);
    }
  }
}
