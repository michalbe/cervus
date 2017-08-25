import * as from_values from 'gl-vec3/fromValues';
import * as normalize from 'gl-vec3/normalize';
import * as distance from 'gl-vec3/distance';
import * as angle from 'gl-vec3/angle';
import * as subtract from 'gl-vec3/subtract';
import * as add from 'gl-vec3/add';
import * as vec3_scale from 'gl-vec3/scale';
import * as transform_mat4 from 'gl-vec3/transformMat4';
import * as cross from 'gl-vec3/cross';
import { mat4 } from 'gl-matrix';
import { hex_to_vec } from '../misc/utils.js';

export const math = {
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
  mat4: {
    multiply: mat4.multiply,
    create: mat4.create,
    perspective: mat4.perspective,
    rotate: mat4.rotate,
    translate: mat4.translate,
    scale: mat4.scale,
    identity: mat4.identity,
    from_rotation: mat4.fromRotation,
    look_at: mat4.lookAt,
    target_to: mat4.targetTo
  },
  to_radian: (a) => a * Math.PI / 180,
  hex_to_vec
};
