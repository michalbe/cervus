import {
  fromValues,
  normalize,
  distance,
  angle,
  subtract,
  add,
  scaleAndAdd,
  transformMat4,
  cross
} from 'gl-matrix/src/gl-matrix/vec3';


import {
  create,
  perspective,
  rotate,
  translate,
  scale,
  identity,
  lookAt
} from 'gl-matrix/src/gl-matrix/mat4';

import { hex_to_vec } from '../misc/utils.js';

const math = {
  vec3: {
    from_values: fromValues,
    normalize,
    distance,
    angle,
    subtract,
    add,
    scale_and_add: scaleAndAdd,
    transform_mat4: transformMat4,
    cross
  },
  mat4: {
    create,
    perspective,
    rotate,
    translate,
    scale,
    identity,
    look_at: lookAt
  },
  to_radian: (a) => a * Math.PI / 180,
  hex_to_vec
};

export { math };
