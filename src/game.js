import { canvas, gl } from './context.js';

const default_options = {
  width: 800,
  height: 600,
  dom: document.body,
  fps: 60,
};

class Game {

  constructor(options) {
    this.options = default_options;

    options = options || {};
    Object.keys(options).forEach(key => {
      this.options[key] = options[key];
    });

    console.log(this.options);
  }
}

export { Game };
