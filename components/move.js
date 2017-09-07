import { Component } from '../core';
import { Transform } from './transform';

import { vec3 } from '../math';

// When using arrow keys for rotation simulate the mouse delta of this value.
const KEY_ROTATION_DELTA = 3;

const default_options = {
  keyboard_controlled: false,
  mouse_controlled: false,

  move_speed: 3.5,
  rotate_speed: .5,

  dir_desc: {
    87: 'f',
    65: 'l',
    68: 'r',
    83: 'b',
    69: 'u',
    81: 'd',
    38: 'pu',
    40: 'pd',
    39: 'yr',
    37: 'yl'
  }
};

export class Move extends Component {
  constructor(options) {
    super(options);
    Object.assign(this,  default_options, options);
  }

  handle_keys(tick_length, {f, b, l, r, u, d, pu, pd, yl, yr}) {
    const entity_transform = this.entity.get_component(Transform);
    const dist = tick_length / 1000 * this.move_speed;

    // The desired XZ direction vector in self space. This is what the user
    // wanted to do: walk forward/backward and left/right.
    const direction = vec3.of(l - r, 0, f - b);

    // Transform the input from self to local space.  If the user wanted to go
    // "left" in the entity's self space what does it mean in the local space?
    vec3.transform_mat4(direction, direction, entity_transform.matrix);
    // Direction is now a point in the entity's local space. Subtract the
    // position to go back to a movement vector.
    vec3.subtract(direction, direction, entity_transform.position);

    // Up and down movement always happens relative to the local space
    // regardless of the current pitch of the entity.  This can be understood
    // as projecting the direction vector to the XZ plane first (Y = 0) and
    // then adding the Y input.
    direction[1] = (u - d);

    // Scale direction by this tick's distance.
    vec3.normalize(direction, direction);
    vec3.scale(direction, direction, dist);

    entity_transform.translate(direction);

    // Simulate mouse deltas for rotation.
    const mouse_delta = {
      x: yl * KEY_ROTATION_DELTA - yr * KEY_ROTATION_DELTA,
      y: pu * KEY_ROTATION_DELTA - pd * KEY_ROTATION_DELTA,
    };

    this.handle_mouse(tick_length, mouse_delta);
  }

  handle_mouse(tick_length, {x, y}) {
    const entity_transform = this.entity.get_component(Transform);
    // Check if there's any input to handle.
    if (x === 0 && y === 0) {
      return;
    }

    const time_delta = tick_length / 1000;
    const azimuth = this.rotate_speed * time_delta * x;
    const polar = this.rotate_speed * time_delta * y;

    // Polar (with the zenith being the Y axis) to Cartesian, but polar is
    // counted from Z to Y rather than from Y to Z, so we swap cos(polar) for
    // sin(polar) and vice versa.
    const forward = vec3.of(
      Math.cos(polar) * Math.sin(azimuth),
      Math.sin(polar),
      Math.cos(polar) * Math.cos(azimuth)
    );
    vec3.normalize(forward, forward);
    // Transform forward to the object's local coordinate space (relative to
    // the parent).
    vec3.transform_mat4(forward, forward, entity_transform.matrix);
    entity_transform.look_at(forward);
  }

  update(tick_length) {
    if (this.keyboard_controlled && this.entity.game) {
      const current_dirs = {};

      for (const [key_code, dir] of Object.entries(this.dir_desc)) {
        current_dirs[dir] = this.entity.game.get_key(key_code);
      }

      this.handle_keys(tick_length, current_dirs);
    }

    if (this.mouse_controlled && this.entity.game) {
      this.handle_mouse(tick_length, this.entity.game.mouse_delta);
    }
  }
}
