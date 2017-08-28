import { BasicTween } from './basic-tween';

class ValueTween extends BasicTween {
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
