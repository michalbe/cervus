import { hex_to_rgb } from '../utils';
import { mat4, to_radian } from '../math';
import { gl, canvas } from './context';
import { Entity } from './entity';
import { Transform, Move, Light } from '../components';

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
  left: -10,
  right: 10,
  bottom: -10,
  top: 10,
  clear_color: '#FFFFFF',
  clear_opacity: 1,
  projection: 'perspective'
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

    this.light = new Entity({
      components: [
        new Transform(),
        new Light()
      ]
    });
    this.add(this.light);


    this.projMatrix = mat4.create();
    this.viewMatrix = mat4.create();

    if (this.projection === 'ortho') {
      this.setup_ortho_camera();
    } else {
      this.setup_perspective_camera();
    }

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

  setup_ortho_camera() {
    mat4.ortho(
      this.projMatrix,
      this.left,
      this.right,
      this.bottom,
      this.top,
      this.near,
      this.far
    );
  }

  setup_perspective_camera() {
    mat4.perspective(
      this.projMatrix,
      to_radian(this.fov),
      this.width / this.height,
      this.near,
      this.far
    );
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
      this.clear_opacity
    );
  }

  set clear_opacity(value) {
    this._clear_opacity = value;
    const color_vec = hex_to_rgb(this._clear_color);

    gl.clearColor(
      color_vec[0],
      color_vec[1],
      color_vec[2],
      this._clear_opacity
    );
  }

  get clear_opacity() {
    return this._clear_opacity;
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
    this.entities_by_component = new WeakMap();
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
    return handler;
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

  track_entity(entity) {
    entity.game = this;

    for (let component of entity.components.values()) {
      if (!this.entities_by_component.has(component.constructor)) {
        this.entities_by_component.set(component.constructor, new Set());
      }
      this.entities_by_component.get(component.constructor).add(entity);
    }

    // Recursively track children.
    for (let child of entity.entities) {
      this.track_entity(child);
    }
  }

  untrack_entity(entity) {
    entity.game = null;

    for (let component of entity.components.values()) {
      this.entities_by_component.get(component.constructor).delete(entity);
    }

    // Recursively untrack children.
    for (let child of entity.entities) {
      this.remove_from_components_sets(child);
    }
  }

  get_entities_by_component(component) {
    return Array.from(this.entities_by_component.get(component));
  }

  add(entity) {
    this.entities.add(entity);
    this.track_entity(entity);
  }

  remove(entity) {
    this.entities.delete(entity);
    this.untrack_entity(entity);
  }
}
