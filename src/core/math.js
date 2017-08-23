import * as from_values from 'gl-vec3/fromValues';
import * as normalize from 'gl-vec3/normalize';
import * as distance from 'gl-vec3/distance';
import * as angle from 'gl-vec3/angle';
import * as subtract from 'gl-vec3/subtract';
import * as add from 'gl-vec3/add';
import * as vec3_scale from 'gl-vec3/scale';
import * as scale_and_add from 'gl-vec3/scaleAndAdd';
import * as transform_mat4 from 'gl-vec3/transformMat4';
import * as cross from 'gl-vec3/cross';

import * as multiply from 'gl-mat4/multiply';
import * as create from 'gl-mat4/create';
import * as perspective from 'gl-mat4/perspective';
import * as rotate from 'gl-mat4/rotate';
import * as translate from 'gl-mat4/translate';
import * as scale from 'gl-mat4/scale';
import * as identity from 'gl-mat4/identity';
import * as look_at from 'gl-mat4/lookAt';

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
    scale_and_add: scale_and_add.default,
    transform_mat4: transform_mat4.default,
    cross: cross.default
  },
  mat4: {
    multiply: multiply.default,
    create: create.default,
    perspective: perspective.default,
    rotate: rotate.default,
    translate: translate.default,
    scale: scale.default,
    identity: identity.default,
    look_at: look_at.default
  },
  to_radian: (a) => a * Math.PI / 180,
  hex_to_vec
};

export { math };
