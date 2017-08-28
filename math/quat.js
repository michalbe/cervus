import { fromMat3, normalize } from 'gl-matrix/src/gl-matrix/quat';

export {
  create,
  multiply,
  setAxisAngle as set_axis_angle
} from 'gl-matrix/src/gl-matrix/quat';

// XXX gl-matrix has a bug in quat.setAxes:
// https://github.com/toji/gl-matrix/issues/234
// The following implementation changes the order of axes to match our
// interpretation.
export function set_axes(out, left, up, forward) {
  const matrix = Float32Array.of(...left, ...up, ...forward);
  return normalize(out, fromMat3(out, matrix));
}
