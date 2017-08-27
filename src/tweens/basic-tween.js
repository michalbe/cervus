import { math } from '../core/math.js';

class BasicTween {
  constructor(options) {
    this.from = options.from;
    this.to = options.to;
    this.time = options.time || 1000;

    this.game = options.game;

    this.tick_length = this.game.tick_length;
    this.first_tick = this.game.last_tick;
    this.number_of_ticks = Math.ceil(this.time / this.tick_length);
    this.step = 1 / this.number_of_ticks;
    this.do_step.bound = this.do_step.bind(this);
    this.game.add_frame_action(this.do_step.bound);
  }

  do_step(tick) {
    const current_tick = (tick - this.first_tick) / this.tick_length;
    // console.log(current_tick);
    const current_step = Math.min(1, current_tick * this.step);
    const _from = this.from.slice();
    math.vec3.lerp(_from, _from, this.to, current_step);
    console.log(_from);
    this.from = _from;
    if (current_step === 1) {
      this.game.remove_frame_action(this.do_step.bound);
    }
  }
}

export { BasicTween }
