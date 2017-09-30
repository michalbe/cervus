import { Component } from '../core';
import { create_float_buffer, create_index_buffer } from '../core/context';
import { hex_to_rgb } from '../utils';

const default_options = {
  material: null,
  vertices: [],
  indices: [],
  normals: [],
  uvs: [],
  color: 'fff',
  opacity: 1
}

export class Render extends Component {
  constructor(options) {
    super(options);
    Object.assign(this, default_options, options);

    this.create_buffers();
  }

  set color(hex) {
    this._color = hex || 'fff';
    this.color_vec = [...hex_to_rgb(this._color), this.opacity];
  }

  get color() {
    return this._color;
  }

  create_buffers() {
    this.buffers = {
      vertices: create_float_buffer(this.vertices),
      indices: create_index_buffer(this.indices),
      qty: this.indices.length,
      normals: create_float_buffer(this.normals),
      uvs: create_float_buffer(this.uvs)
    }
  }

  render() {
    this.material.render(this.entity);
  }
}
