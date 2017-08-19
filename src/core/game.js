import { gl, canvas } from './context.js';
import { vec3, mat4, glMatrix } from 'gl-matrix';
import { hex_to_vec } from '../misc/utils.js';
import { Camera } from './camera.js';

const default_options = {
  width: 800,
  height: 600,
  dom: document.body,
  fps: 60,
  autostart: true,
  movable_camera: false,
  clear_color: '#FFFFFF',
  light_position: { x: 0, y: 0, z: 0 }
};

class Game {

  constructor(options) {
    this.entities = [];
    this.run = true;

    this.options = default_options;

    this.camera = new Camera(
      vec3.fromValues(0, 0, 1.85),
      vec3.fromValues(0, -1, 1.85),
      vec3.fromValues(0, 0, 1)
    );

    this.projMatrix = mat4.create();
    this.viewMatrix = mat4.create();

    mat4.perspective(
      this.projMatrix,
      glMatrix.toRadian(90),
      canvas.width / canvas.height,
      0.35,
      85.0
    )

    options = options || {};
    Object.keys(options).forEach(key => {
      this.options[key] = options[key];
    });

    this.light_position = this.options.light_position;
    this.camera.moveable = this.options.movable_camera;
    this.clear_color = this.options.clear_color;
    this.clear_color_vec = hex_to_vec(this.clear_color);

    canvas.width = this.options.width;
    canvas.height = this.options.height;

    this.options.dom.appendChild(canvas);

    this.running = this.options.autostart;

    this.last_tick = performance.now();
    this.last_render = this.last_tick;
    this.tick_length = 1000/this.options.fps;

    this.actions = {};

    this.tick((typeof performance !== 'undefined' && performance.now()) || 0);

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    gl.clearColor(
      this.clear_color_vec[0],
      this.clear_color_vec[1],
      this.clear_color_vec[2],
      1
    );

    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

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
    if (this.run) {
      for(var i=0; i < ticks_qty; i++) {
        this.last_tick = this.last_tick + this.tick_length;
        this.update( this.last_tick );
      }
    }
  }

  update(tick_time) {
    Object.keys(this.actions).forEach(action => {
      if (this.actions[action]) {
        this.actions[action](tick_time);
      }
    });


    this.entities.forEach((entity) => entity.update());
    if (this.options.movable_camera) {
      this.camera.update(this.tick_length);
      this.camera.get_matrix(this.viewMatrix);
    }
  }

  draw(ticks_qty) {
      if (this.run) {
        this.clear_color_vec = hex_to_vec(this.clear_color);
        gl.clearColor(
          this.clear_color_vec[0],
          this.clear_color_vec[1],
          this.clear_color_vec[2],
          1
        );
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, canvas.width, canvas.height);
        // this.entities.forEach((entity) => entity.generate_shadow_map && entity.generate_shadow_map(ticks_qty));
        // gl.viewport(0, 0, canvas.width, canvas.height);
        this.entities.forEach((entity) => entity.render(ticks_qty));
      }
  }

  add(entity) {
    entity.game = this;
    this.entities.push(entity);
  }
}

export { Game };
