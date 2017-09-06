import { rgb_to_hex, hex_to_rgb } from '../utils';
import { vec3 } from '../math';
import { Tween } from '../core';

export class ColorTween extends Tween {
  action() {
    const _from = [];
    vec3.lerp(_from, this.from, this.to, this.current_step);
    // console.log(this.from, this.to, _from, this.current_step);
    this.object[this.property] = rgb_to_hex(_from);
  }

  pre_start() {
    super.pre_start();
    this.initial_to = this.initial_to || this.to;
    this.from = hex_to_rgb(this.object[this.property]);
    this.to = hex_to_rgb(this.initial_to);
  }
}
