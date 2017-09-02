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
    // this.frame_delay;
    // this.frames

  }

  create_buffers() {
    this.number_of_frames = this.frames.length;
    this.buffers = this.frames.map(frame => {
      return {
        vertices: create_float_buffer(frame.vertices),
        indices: create_index_buffer(frame.indices),
        qty: frame.indices.length,
        normals: create_float_buffer(frame.normals)
      };
    });
  }

  get_next_frame() {
    let current_frame = this.current_frame;
    current_frame++;
    if (current_frame === this.number_of_frames) {
      current_frame = 0;
    }

    return current_frame;
  }

  update(tick_length) {
    if (this.skip) {
      return;
    }

    this.current_tick++;
    this.frame_delta = 1 - (this.current_tick % this.frame_delay)/this.frame_delay;

    if (!(this.current_tick % this.frame_delay)) {
      this.current_frame = this.next_frame;
      this.next_frame = this.get_next_frame();
    }
    super.update(tick_length);
  }
}
