import { gl, canvas } from './context';
import { hex_to_vec } from '../utils';
import { vec3, mat4, to_radian } from './math';
import { Entity } from './entity';

const default_options = {
  width: 800,
  height: 600,
  dom: document.body,
  fps: 60,
  autostart: true,
  keyboard_controlled_camera: false,
  mouse_controlled_camera: false,
  clear_color: '#FFFFFF',
  light_position: vec3.zero.slice(),
  light_intensity: 0.6
};

class Game {
  constructor(options) {
    this.entities = [];

    this.options = default_options;

    this.camera = new Entity();

    // this.camera.look_at([0, 0, 0]);

    this.camera.game = this;

    this.projMatrix = mat4.create();
    this.viewMatrix = mat4.create();

    mat4.perspective(
      this.projMatrix,
      to_radian(90),
      canvas.width / canvas.height,
      0.35,
      85.0
    )

    options = options || {};
    Object.keys(options).forEach(key => {
      this.options[key] = options[key];
    });

    this.light_position = this.options.light_position;
    this.light_intensity = this.options.light_intensity;
    this.camera.keyboard_controlled = this.options.keyboard_controlled_camera;
    this.camera.mouse_controlled = this.options.mouse_controlled_camera;
    this.clear_color = this.options.clear_color;
    this.clear_color_vec = hex_to_vec(this.clear_color);

    canvas.width = this.options.width;
    canvas.height = this.options.height;

    this.options.dom.appendChild(canvas);

    this.running = this.options.autostart;

    this.last_tick = performance.now();
    this.last_render = this.last_tick;
    this.tick_length = 1000/this.options.fps;

    this.keys = {};
    this.mouse_delta = {x: 0, y: 0};

    window.addEventListener('keydown', this.key_down.bind(this));
    window.addEventListener('keyup', this.key_up.bind(this));

    window.addEventListener('mousemove', this.mouse_move.bind(this));

    this.actions = [];

    this.tick(performance.now());

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    gl.clearColor(
      this.clear_color_vec[0],
      this.clear_color_vec[1],
      this.clear_color_vec[2],
      1
    );

    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
  }

  stop() {
    this.running = false;
  }

  start() {
    this.running = true;
    this.last_tick = performance.now();
    window.requestAnimationFrame((tick_time) => this.tick(tick_time));
  }

  tick(tick_time) {
    if (this.running) {
      window.requestAnimationFrame((tick_time) => this.tick(tick_time));
    }

    const next_tick = this.last_tick + this.tick_length;

    if (tick_time > next_tick) {
      const ticks_qty = Math.floor((tick_time - this.last_tick) / this.tick_length);
      this.perform_ticks(ticks_qty);
      this.draw(this.last_tick);
    }

  }

  add_frame_action(action) {
    this.actions.push(action);
  }

  remove_frame_action(action_to_remove) {
    this.actions = this.actions.filter(action => {
      return action !== action_to_remove;
    });
  }

  key_down(e) {
    this.keys[e.keyCode] = true;
  }

  key_up(e) {
    this.keys[e.keyCode] = false
  }

  mouse_move(e) {
    // Accumulate the deltas for each mousemove event that that fired between
    // any two ticks. Our +X is left, +Y is up while the browser's +X is to the
    // right, +Y is down. Inverse the values by subtracting rather than adding.
    this.mouse_delta.x -= e.movementX,
    this.mouse_delta.y -= e.movementY
  }

  perform_ticks(ticks_qty) {
    // Mouse delta is measured since the last time this.tick was run.  If there
    // is more than one tick to perform we need to scale the delta down to
    // maintain consistent movement.
    this.mouse_delta.x /= ticks_qty;
    this.mouse_delta.y /= ticks_qty;

    for(var i=0; i < ticks_qty; i++) {
      this.last_tick = this.last_tick + this.tick_length;
      this.update(this.last_tick);
    }

    // Reset the mouse delta.
    this.mouse_delta.x = 0;
    this.mouse_delta.y = 0;
  }

  update(tick_time) {
    Object.keys(this.actions).forEach(action => {
      if (this.actions[action]) {
        this.actions[action](tick_time);
      }
    });

    this.entities.forEach((entity) => entity.update(this.tick_length));

    this.camera.update(this.tick_length);
    this.camera.get_view_matrix(this.viewMatrix);
  }

  draw(ticks_qty) {
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

  add(entity) {
    entity.game = this;
    this.entities.push(entity);
  }
}

export { Game };
