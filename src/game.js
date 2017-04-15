import { gl, canvas, create_float_buffer, create_index_buffer, program, set_model_view, set_projection } from './context.js';

const default_options = {
  width: 800,
  height: 600,
  dom: document.body,
  fps: 60,
  autostart: true
};

class Game {

  constructor(options) {
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
    gl.useProgram(program);
    const aVertex = gl.getAttribLocation(program, "aVertex");

    gl.enableVertexAttribArray(aVertex);

    set_projection(program, 60, this.options.width / this.options.height, 0.1, 100);

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
      this.draw();
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

    const rotation = Date.now() / 1000;
    const axis = [0, 1, 0.5];
    const position = [0, 0, -5];

		set_model_view(program, position, rotation, axis);
    // console.log('update');
  }

  draw() {
    if (this.object) {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			gl.viewport(0, 0, canvas.width, canvas.height);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.object.vbo);
			gl.vertexAttribPointer(gl.getAttribLocation(program, "aVertex"), 3, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.object.ibo);
			gl.drawElements(gl.TRIANGLES, this.object.num, gl.UNSIGNED_SHORT, 0);
    }
  }

  create_object(indices, vertices) {
    this.object = {
        vbo : create_float_buffer(vertices),
        ibo : create_index_buffer(indices),
        num : indices.length
      }
  }
}

export { Game };
