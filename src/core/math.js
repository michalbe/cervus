import {
  fromValues,
  normalize,
  distance,
  angle,
  subtract,
  add,
  scale,
  transformMat4,
  cross
} from 'gl-matrix/src/gl-matrix/vec3';


import {
  create,
  perspective,
  multiply,
  rotate,
  translate,
  scale as mat4_scale,
  identity,
  fromRotation,
  lookAt,
  targetTo
} from 'gl-matrix/src/gl-matrix/mat4';

import { hex_to_vec } from '../misc/utils.js';

export const math = {
  vec3: {
    from_values: fromValues,
    normalize,
    distance,
    angle,
    subtract,
    add,
    scale,
    transform_mat4: transformMat4,
    cross
  },
  mat4: {
    create,
    perspective,
    multiply,
    rotate,
    translate,
    scale: mat4_scale,
    identity,
    from_rotation: fromRotation,
    look_at: lookAt,
    target_to: targetTo
  },
  to_radian: (a) => a * Math.PI / 180,
  hex_to_vec
};
