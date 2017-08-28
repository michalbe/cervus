import { vec3 } from '../core/math';
import BasicTween from './basic-tween';

export default class VecTween extends BasicTween {
  action() {
    const _from = [];
    vec3.lerp(_from, this.from, this.to, this.current_step);
    this.object[this.property] = _from;
  }

  pre_start() {
    super.pre_start();
    this.from = this.object[this.property].slice();
  }
}
