import { hex_to_rgb } from '../utils';
import { vec3, mat4, to_radian } from '../math';
import { gl, canvas } from './context';
import { Entity } from './entity';
import { Transform, Move } from '../components';

const default_options = {
  canvas,
  width: 800,
  height: 600,
  dom: document.body,
  fps: 60,
  running: true,
  fov: 60,
  near: 0.35,
  far: 85,
  clear_color: '#FFFFFF',
  light_position: vec3.zero.slice(),
  light_intensity: 0.6
};

const EVENTS = ["keydown", "keyup", "mousemove"];

export class Game {
  constructor(options) {
    Object.assign(this, default_options, options);

    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.dom.appendChild(canvas);

    this.reset();

    this.camera = new Entity({
      components: [
        new Transform(),
        new Move()
      ]
    });

    this.camera.game = this;

    this.projMatrix = mat4.create();
    this.viewMatrix = mat4.create();

    mat4.perspective(
      this.projMatrix,
      to_radian(this.fov),
      this.width / this.height,
      this.near,
      this.far
    );

    this.tick_delta = 1000 / this.fps;

    for (const event_name of EVENTS) {
      const handler_name = "on" + event_name;
      this[handler_name] = this[handler_name].bind(this);
      window.addEventListener(event_name, this[handler_name]);
    }

    if (this.running) {
      this.start();
    }

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
  }

  get clear_color() {
    return this._clear_color;
  }

  set clear_color(hex) {
    this._clear_color = hex;
    const color_vec = hex_to_rgb(hex);

    gl.clearColor(
      color_vec[0],
      color_vec[1],
      color_vec[2],
      1
    );
  }

  stop() {
    this.running = false;
  }

  start() {
    this.running = true;
    this.last_tick = performance.now();
    window.requestAnimationFrame(frame_time => this.frame(frame_time));
  }

  reset() {
    this.entities = new Set();
    this.listeners = new Map();
    this.keys = {};
    this.mouse_delta = {x: 0, y: 0};
  }

  destroy() {
    for (const event_name of EVENTS) {
      window.removeEventListener(event_name, this[event_name]);
    }
  }

  emit(event_name, ...args) {
    if (this.listeners.has(event_name)) {
      for (const handler of this.listeners.get(event_name)) {
        handler(...args);
      }
    }
  }

  on(event_name, handler) {
    if (!this.listeners.has(event_name)) {
      this.listeners.set(event_name, new Set());
    }

    this.listeners.get(event_name).add(handler);
  }

  off(event_name, handler) {
    if (this.listeners.has(event_name)) {
      this.listeners.get(event_name).delete(handler);
    }
  }

  onkeydown(e) {
    this.keys[e.keyCode] = 1;
  }

  onkeyup(e) {
    this.keys[e.keyCode] = 0
  }

  get_key(key_code) {
    // Make sure we return 0 for undefined, i.e. keys we haven't seen
    // pressed at all.
    return this.keys[key_code] || 0;
  }

  onmousemove(e) {
    // Accumulate the deltas for each mousemove event that that fired between
    // any two ticks. Our +X is left, +Y is up while the browser's +X is to the
    // right, +Y is down. Inverse the values by subtracting rather than adding.
    this.mouse_delta.x -= e.movementX;
    this.mouse_delta.y -= e.movementY;
  }

  frame(frame_time) {
    if (this.running) {
      window.requestAnimationFrame(frame_time => this.frame(frame_time));
    }

    if (frame_time > this.last_tick + this.tick_delta) {
      const accumulated_delta = frame_time - this.last_tick;
      const ticks_qty = Math.floor(accumulated_delta / this.tick_delta);
      this.perform_ticks(ticks_qty);
      this.render();
    }
  }

  perform_ticks(ticks_qty) {
    // Mouse delta is measured since the last time this.tick was run.  If there
    // is more than one tick to perform we need to scale the delta down to
    // maintain consistent movement.
    this.mouse_delta.x /= ticks_qty;
    this.mouse_delta.y /= ticks_qty;

    for (let i = 0; i < ticks_qty; i++) {
      this.last_tick = this.last_tick + this.tick_delta;
      this.update();
    }

    // Reset the mouse delta.
    this.mouse_delta.x = 0;
    this.mouse_delta.y = 0;
  }

  update() {
    this.emit('tick', this.last_tick);
    this.entities.forEach(entity => entity.update(this.tick_delta));
    this.camera.update(this.tick_delta);
    this.camera.get_component(Transform).get_view_matrix(this.viewMatrix);
  }

  render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.entities.forEach(entity => entity.render());
    this.emit('afterrender');
  }

  add(entity) {
    entity.game = this;
    this.entities.add(entity);
  }

  remove(entity) {
    this.entities.delete(entity);
  }
}
