import { create_float_buffer, create_index_buffer } from './context';
import { Entity } from './entity';

export class AnimatedEntity extends Entity {
  constructor(options) {
    super(options);

    if (!this.frames || !this.frames.length) {
      this.buffers = [];
    }

    this.current_frame = 0;
    this.next_frame = 1;
    this.current_tick = 0;

    // I'll leave those in here as a foundation to our future documentation.
    // `frame_time` defines number of gameloop ticks after next frame will
    // be rendered
    // this.frame_time;
    // this.frames

  }

  create_buffers() {
    this.number_of_frames = this.frames.length;
    this.buffers = this.frames.map(frame => ({
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

  update(tick_length) {
    if (this.skip) {
      return;
    }

    this.current_tick++;
    // frame_delta is an interpolation amount between current and
    // next frame vertices
    this.frame_delta = 1 - (this.current_tick % this.frame_time)/this.frame_time;

    if (!(this.current_tick % this.frame_time)) {
      this.current_frame = this.next_frame;
      this.next_frame = this.get_next_frame();
    }
    super.update(tick_length);
  }
}
