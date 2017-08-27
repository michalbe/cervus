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
  translate,
  fromRotationTranslationScale,
  lookAt,
} from 'gl-matrix/src/gl-matrix/mat4';

import {
  create as quat_create,
  multiply as quat_multiply,
  setAxisAngle,
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
    perspective,
    multiply,
    translate,
    compose: fromRotationTranslationScale,
    look_at: lookAt,
  },
  quat: {
    create: quat_create,
    multiply: quat_multiply,
    set_axis_angle: setAxisAngle,
  },
  to_radian: (a) => a * Math.PI / 180,
  hex_to_vec
};
