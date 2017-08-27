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
  invert,
  perspective,
  multiply,
  translate,
  rotate,
  fromRotationTranslationScale,
  lookAt,
  targetTo
} from 'gl-matrix/src/gl-matrix/mat4';

import {
  create as quat_create,
  multiply as quat_multiply,
  setAxisAngle,
  fromMat3,
  normalize as quat_normalize
} from 'gl-matrix/src/gl-matrix/quat';

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
    invert,
    perspective,
    multiply,
    translate,
    rotate,
    compose: fromRotationTranslationScale,
    look_at: lookAt,
  },
  quat: {
    create: quat_create,
    multiply: quat_multiply,
    set_axes,
    set_axis_angle: setAxisAngle,
  },
  to_radian: (a) => a * Math.PI / 180,
  hex_to_vec
};

// XXX gl-matrix has a bug in quat.setAxes:
// https://github.com/toji/gl-matrix/issues/234
// The following implementation changes the order of axes to match our
// interpretation.
function set_axes(out, left, up, forward) {
  const matrix = Float32Array.of(...left, ...up, ...forward);
  return quat_normalize(out, fromMat3(out, matrix));
}
