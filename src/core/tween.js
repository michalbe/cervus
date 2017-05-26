class Tween {
  constructor(options) {
    this.from = options.from;
    this.to = options.to;
    this.time = options.time || 1;
    this.game = options.game;
  }
}

export { Tween }
