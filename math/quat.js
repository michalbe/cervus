import { fromMat3, normalize } from 'gl-matrix/src/gl-matrix/quat';
import { to_degrees } from './';

export {
  create,
  multiply,
  fromEuler as from_euler,
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

// https://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles
export function to_euler(quat) {
  const [w, x, y, z] = quat;
  const y_sqr = y * y;

	const t0 = 2 * (w * x + y * z);
	const t1 = 1 - 2 * (x * x + y_sqr);
	const X = to_degrees(Math.atan2(t0, t1));

	let t2 = 2 * (w * y - z * x);
  if (t2 > 1) {
    t2 = 1;
  } else if (t2 < -1) {
    t2 = -1;
  }

	const Y = to_degrees(Math.asin(t2));

	const t3 = 2 * (w * z + x * y);
	const t4 = 1 - 2 * (y_sqr + z * z);
	const Z = to_degrees(Math.atan2(t3, t4));

	return [X, Y, Z];
}
