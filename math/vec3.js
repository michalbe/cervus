const V = Float32Array;

export {
  normalize,
  subtract,
  add,
  scale,
  transformMat4 as transform_mat4,
  cross,
  lerp
} from 'gl-matrix/src/gl-matrix/vec3';

export const zero = V.of(0, 0, 0);
export const unit = V.of(1, 1, 1);
export const left = V.of(1, 0, 0);
export const up = V.of(0, 1, 0);
export const forward = V.of(0, 0, 1);

export const of = (...vals) => V.of(...vals);
