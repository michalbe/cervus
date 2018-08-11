import { Tween } from '../core';
import { mat4 } from '../math';

export class MatrixTween extends Tween {
  action() {
    for (let i = 0; i < this.from.length; i++) {
        this.object[i] = this.from[i] + this.current_step * (this.to[i] - this.from[i]);
    }
  }

  pre_start() {
    super.pre_start();
    this.from = mat4.clone(this.object);
  }
}
