import { vec3, mat4 } from 'gl-matrix';
import { math } from './math.js';

export class Camera {
  constructor(position, lookAt, up) {
    this.forward = [];
    this.up = [];
    this.right = [];

    this.position = position;
    this.moveable = false;

    this.move_speed = 3.5;
    this.rotate_speed = 1.5;

    // Movement:
    // u: up
    // r: right
    // d: down
    // l: left
    // f: forward
    // b: backward
    // r_l: rotate left
    // r_r: rotate right
    // r_u: rotate up
    // r_d: rotate down
    this.dir = {};

    this.dir_desc = {
      87: 'f',
      65: 'l',
      68: 'r',
      83: 'b',
      81: 'u',
      69: 'd',
      38: 'r_u',
      40: 'r_d',
      39: 'r_r',
      37: 'r_l'
    };

    math.vec3.subtract(this.forward, lookAt, this.position);
    math.vec3.cross(this.right, this.forward, up);
    math.vec3.cross(this.up, this.right, this.forward);

    vec3.normalize(this.forward, this.forward);
    vec3.normalize(this.right, this.right);
    vec3.normalize(this.up, this.up);

    window.addEventListener('keydown', this.key_down.bind(this));
    window.addEventListener('keyup', this.key_up.bind(this));
  }

  get_matrix(out) {
    const lookAtVect = [];
    vec3.add(lookAtVect, this.position, this.forward);
    mat4.lookAt(out, this.position, lookAtVect, this.up);
    return out;
  }

  rotate_rl(rad) {
    const rightMatrix = mat4.create();
    mat4.rotate(rightMatrix, rightMatrix, rad, vec3.fromValues(0, 0, 1));
    vec3.transformMat4(this.forward, this.forward, rightMatrix);
    this.realign();
  }

  rotate_ud(rad) {
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

  move_f(dist) {
    vec3.scaleAndAdd(this.position, this.position, this.forward, dist);
  }

  move_r(dist) {
    vec3.scaleAndAdd(this.position, this.position, this.right, dist);
  }

  move_u(dist) {
    vec3.scaleAndAdd(this.position, this.position, this.up, dist);
  }

  key_down(e) {
    if (!this.moveable) {
      return;
    }
    if (this.dir_desc[e.keyCode]) {
      this.dir[this.dir_desc[e.keyCode]] = true;
    }
  }

  key_up(e) {
    if (!this.moveable) {
      return;
    }
    if (this.dir_desc[e.keyCode]) {
      this.dir[this.dir_desc[e.keyCode]] = false;
    }
  }

  update(tick_length) {
    if (this.dir.f && !this.dir.b) {
      this.move_f(tick_length / 1000 * this.move_speed);
    }

    if (this.dir.b && !this.dir.f) {
      this.move_f(-tick_length / 1000 * this.move_speed);
    }

    if (this.dir.r && !this.dir.l) {
      this.move_r(tick_length / 1000 * this.move_speed);
    }

    if (this.dir.l && !this.dir.r) {
      this.move_r(-tick_length / 1000 * this.move_speed);
    }

    if (this.dir.u && !this.dir.d) {
      this.move_u(tick_length / 1000 * this.move_speed);
    }

    if (this.dir.d && !this.dir.u) {
      this.move_u(-tick_length / 1000 * this.move_speed);
    }

    if (this.dir.r_r && !this.dir.r_l) {
      this.rotate_rl(-tick_length / 1000 * this.rotate_speed);
    }

    if (this.dir.r_l && !this.dir.r_r) {
      this.rotate_rl(tick_length / 1000 * this.rotate_speed);
    }

    if (this.dir.r_u && !this.dir.r_d) {
      this.rotate_ud(-tick_length / 1000 * this.rotate_speed);
    }

    if (this.dir.r_d && !this.dir.r_u) {
      this.rotate_ud(tick_length / 1000 * this.rotate_speed);
    }
  }
}
