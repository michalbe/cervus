import { Tween } from '../core';

export class ValueTween extends Tween {
  action() {
    this.object[this.property] = this.from +
      this.current_step * (this.to - this.from);
  }

  pre_start() {
    super.pre_start();
    this.from = this.object[this.property];
  }
}
