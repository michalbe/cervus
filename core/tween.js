export class Tween {
  constructor(options) {
    this.to = options.to;
    this.time = options.time || 1000;
    this.game = options.game;
    this.object = options.object;
    this.property = options.property;
    this.cb = options.cb;
  }

  do_step(tick) {
    this.current_step = Math.min(
      1,
      ((tick - this.first_tick) / this.tick_delta) * this.step
    );
    this.action();
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
      const bound = (tick) => {
        if (this.current_step === 1) {
          this.game.off('tick', bound);
          resolve();
        } else {
          this.do_step(tick, resolve);
        }
      };
      this.game.on('tick', bound);
    });
  }
}
