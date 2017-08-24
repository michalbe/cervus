import * as from_values from 'gl-vec3/fromValues';
import * as normalize from 'gl-vec3/normalize';
import * as distance from 'gl-vec3/distance';
import * as angle from 'gl-vec3/angle';
import * as subtract from 'gl-vec3/subtract';
import * as add from 'gl-vec3/add';
import * as vec3_scale from 'gl-vec3/scale';
import * as transform_mat4 from 'gl-vec3/transformMat4';
import * as cross from 'gl-vec3/cross';

// XXX We should simply re-export mat4 here and then in other places:
// import { mat4 } from './core/math';
import { mat4 } from 'gl-matrix';

import { hex_to_vec } from '../misc/utils.js';

const math = {
  vec3: {
    from_values: from_values.default,
    normalize: normalize.default,
    distance: distance.default,
    angle: angle.default,
    subtract: subtract.default,
    add: add.default,
    scale: vec3_scale.default,
    transform_mat4: transform_mat4.default,
    cross: cross.default
  },
  // XXX Keep this here for now for compatibility.
  mat4,
  to_radian: (a) => a * Math.PI / 180,
  hex_to_vec
};

export { math };

export function look_at(
  out, [eyex, eyey, eyez], target, [upx, upy, upz]
) {
  let y0 = target[0] - eyex;
  let y1 = target[1] - eyey;
  let y2 = target[2] - eyez;

  const len = y0*y0 + y1*y1 + y2*y2;
  if (len > 0) {
    const rev_magnitude = 1 / Math.sqrt(len);
    y0 *= rev_magnitude;
    y1 *= rev_magnitude;
    y2 *= rev_magnitude;
  }

  const x0 = upy * y2 - upz * y1;
  const x1 = upz * y0 - upx * y2;
  const x2 = upx * y1 - upy * y0;

  out[0] = x0;
  out[1] = x1;
  out[2] = x2;
  out[3] = 0;
  out[4] = y0;
  out[5] = y1;
  out[6] = y2;
  out[7] = 0;
  out[8] = y1 * x2 - y2 * x1;
  out[9] = y2 * x0 - y0 * x2;
  out[10] = y0 * x1 - y1 * x0;
  out[11] = 0;
  out[12] = eyex;
  out[13] = eyey;
  out[14] = eyez;
  out[15] = 1;
  return out;
};
