import { gl, canvas } from './context.js';

const default_options = {
  width: 800,
  height: 600,
  dom: document.body,
  fps: 60,
  autostart: true
};

class Game {

  constructor(options) {
    this.entities = [];

    this.options = default_options;

    options = options || {};
    Object.keys(options).forEach(key => {
      this.options[key] = options[key];
    });

    canvas.width = this.options.width;
    canvas.height = this.options.height;

    this.options.dom.appendChild(canvas);

    this.running = this.options.autostart;

    this.last_tick = performance.now();
    this.last_render = this.last_tick;
    this.tick_length = 1000/this.options.fps;

    this.actions = {};

    this.tick((typeof performance !== 'undefined' && performance.now()) || 0);

    gl.clearColor(0.15,0.15,0.15,1);
    gl.enable(gl.DEPTH_TEST);
    // gl.enable(gl.CULL_FACE);
    // gl.enable(gl.BLEND);
  }

  stop() {
    this.running = false;
  }

  start() {
    this.running = true;
  }

  tick(tick_time) {
    window.requestAnimationFrame((tick_time) => this.tick(tick_time));
    const next_tick = this.last_tick + this.tick_length;


    if (tick_time > next_tick) {
      const ticks_qty = Math.floor((tick_time - this.last_tick) / this.tick_length);
      this.perform_ticks(ticks_qty);
      this.draw(this.last_tick);
    }

  }

  add_frame_listener(name, action) {
    this.actions[name] = action;
  }

  remove_frame_listener(name) {
    delete this.actions[name];
  }

  perform_ticks(ticks_qty) {
    for(var i=0; i < ticks_qty; i++) {
      this.last_tick = this.last_tick + this.tick_length;
      this.update( this.last_tick );
    }
  }

  update(tick_time) {
    Object.keys(this.actions).forEach(action => {
      if (this.actions[action]) {
        this.actions[action](tick_time);
      }
    });

    this.entities.forEach((entity) => entity.update());
  }

  draw(ticks_qty) {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			gl.viewport(0, 0, canvas.width, canvas.height);
      this.entities.forEach((entity) => entity.render(ticks_qty));
  }

  add(entity) {
    this.entities.push(entity);
  }
}

export { Game };
