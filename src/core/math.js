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
