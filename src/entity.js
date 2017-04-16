import { create_float_buffer, create_index_buffer, set_model_view, gl, program } from './context.js';

const zero_vector = {
  x: 0,
  y: 0,
  z: 0
};

const to_vec = (obj) => [obj.x, obj.y, obj.z];

class Entity {
  constructor(options) {
    this.position = Object.assign({}, zero_vector);
    this.rotation = Object.assign({}, zero_vector);
    this.scale = Object.assign({}, zero_vector);

    this.indices = options.indices;
    this.vertices = options.vertices;

    this.create_buffers();
  }

  create_buffers() {
    this.buffers = {
      vertices: create_float_buffer(this.vertices),
      indices: create_index_buffer(this.indices),
      qty: this.indices.length
    }
  }

  update(tick_time) {
    const rotation = tick_time / 1000;
    const axis = [0, 0, 0];

		set_model_view(program, to_vec(this.position), rotation, axis);
  }

  render() {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.vertices);
    gl.vertexAttribPointer(gl.getAttribLocation(program, "aVertex"), 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
    gl.drawElements(gl.TRIANGLES, this.buffers.qty, gl.UNSIGNED_SHORT, 0);
  }
}

export { Entity }
