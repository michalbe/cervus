import { math } from '../core/math';
import { BasicTween } from './basic-tween';

class ValueTween extends BasicTween {
  constructor(options) {
    super(options);
  }

  action() {
    this.object[this.property] = this.from +
      this.current_step * (this.to - this.from);
  }

  pre_start() {
    super.pre_start();
    this.from = this.object[this.property];
  }
}

export { ValueTween }
