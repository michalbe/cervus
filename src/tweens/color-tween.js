import { vec_to_hex, hex_to_vec } from '../utils';
import { vec3 } from '../core/math';
import { BasicTween } from './basic-tween';

class ColorTween extends BasicTween {
  action() {
    const _from = [];
    vec3.lerp(_from, this.from, this.to, this.current_step);
    // console.log(this.from, this.to, _from, this.current_step);
    this.object[this.property] = vec_to_hex(_from);
  }

  pre_start() {
    super.pre_start();
    this.initial_to = this.initial_to || this.to;
    this.from = hex_to_vec(this.object[this.property]);
    this.to = hex_to_vec(this.initial_to);
  }
}

export { ColorTween }
