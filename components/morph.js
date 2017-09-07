import { Component } from '../core';
import { create_float_buffer, create_index_buffer } from '../core';

import { Render } from './render';

const default_options = {
  buffers: [],
  current_frame: 0,
  next_frame: 1,
  current_tick: 0,
  frame_time: 16
}

export class Morph extends Component {
  constructor(options) {
    super(options);
    Object.assign(this,  default_options, options);

    if (this.frames && this.frames.length) {
      this.create_buffers();
    }
  }

  create_buffers() {
    this.number_of_frames = this.frames.length;
    this.entity.get_component(Render).buffers = this.frames.map(frame => ({
      vertices: create_float_buffer(frame.vertices),
      indices: create_index_buffer(frame.indices),
      qty: frame.indices.length,
      normals: create_float_buffer(frame.normals)
    }));
  }

  get_next_frame() {
    let current_frame = this.current_frame;
    current_frame++;
    return current_frame % this.number_of_frames;
  }

  update() {
    this.current_tick++;

    // frame_delta is an interpolation amount between current and
    // next frame vertices
    this.frame_delta = 1 - (this.current_tick % this.frame_time)/this.frame_time;

    if (!(this.current_tick % this.frame_time)) {
      this.current_frame = this.next_frame;
      this.next_frame = this.get_next_frame();
    }
  }
}
