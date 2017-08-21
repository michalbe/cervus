import * as from_values from 'gl-vec3/fromValues';
import * as normalize from 'gl-vec3/normalize';
import * as subtract from 'gl-vec3/subtract';
import * as add from 'gl-vec3/add';
import * as scale_and_add from 'gl-vec3/scaleAndAdd';
import * as transform_mat4 from 'gl-vec3/transformMat4';
import * as cross from 'gl-vec3/cross';

import * as create from 'gl-mat4/create';
import * as perspective from 'gl-mat4/perspective';
import * as rotate from 'gl-mat4/rotate';
import * as look_at from 'gl-mat4/lookAt';

const math = {
  vec3: {
    from_values: from_values.default,
    normalize: normalize.default,
    subtract: subtract.default,
    add: add.default,
    scale_and_add: scale_and_add.default,
    transform_mat4: transform_mat4.default,
    cross: cross.default
  },
  mat4: {
    create: create.default,
    perspective: perspective.default,
    rotate: rotate.default,
    look_at: look_at.default
  },
  to_radian: (a) => a * Math.PI / 180
};

export { math };
