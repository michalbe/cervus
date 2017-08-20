import * as from_values from 'gl-vec3/fromValues';
import * as subtract from 'gl-vec3/subtract';
import * as cross from 'gl-vec3/cross';

import * as create from 'gl-mat4/create';
import * as perspective from 'gl-mat4/perspective';

const math = {
  vec3: {
    from_values: from_values.default,
    subtract: subtract.default,
    cross: cross.default
  },
  mat4: {
    create: create.default,
    perspective: perspective.default
  },
  to_radian: (a) => a * Math.PI / 180
};

export { math };
