import { math } from '../core/math.js';

class BasicTween {
  constructor(options) {
    this.object = options.object;
    this.property = options.property;
    this.to = options.to;
    this.time = options.time || 1000;
    this.game = options.game;
  }

  do_step(tick, resolve) {
    const current_tick = (tick - this.first_tick) / this.tick_length;

    const current_step = Math.min(1, current_tick * this.step);
    const _from = [];
    math.vec3.lerp(_from, this.from, this.to, current_step);
    this.object[this.property] = _from;
    // console.log(_from);
    if (current_step === 1) {
      this.game.remove_frame_action(this.do_step.bound);
      resolve();
    }
  }

  pre_start() {
    this.from = this.object[this.property].slice();
    this.tick_length = this.game.tick_length;
    this.first_tick = this.game.last_tick;
    this.number_of_ticks = Math.ceil(this.time / this.tick_length);
    this.step = 1 / this.number_of_ticks;
  }

  start() {
    this.pre_start();
    return new Promise((resolve) => {
      this.do_step.bound = (tick) => {
        this.do_step(tick, resolve);
      };
      this.game.add_frame_action(this.do_step.bound);
    });
  }
}

export { BasicTween }
