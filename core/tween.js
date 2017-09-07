export class Tween {
  constructor(options) {
    this.to = options.to;
    this.time = options.time || 1000;
    this.game = options.game;
    this.object = options.object;
    this.property = options.property;
  }

  do_step(tick, resolve) {
    this.current_step = Math.min(
      1,
      ((tick - this.first_tick) / this.tick_delta) * this.step
    );
    this.action();
    if (this.current_step === 1) {
      this.game.off('tick', this.do_step.bound);
      resolve();
    }
  }

  action() {}

  pre_start() {
    this.tick_delta = this.game.tick_delta;
    this.first_tick = this.game.last_tick;
    this.number_of_ticks = Math.ceil(this.time / this.tick_delta);
    this.step = 1 / this.number_of_ticks;
  }

  start() {
    this.pre_start();
    return new Promise((resolve) => {
      this.do_step.bound = (tick) => {
        this.do_step(tick, resolve);
      };
      this.game.on('tick', this.do_step.bound);
    });
  }
}
