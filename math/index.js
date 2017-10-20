import * as _vec3 from './vec3';
import * as _mat4 from './mat4';
import * as _quat from './quat';

export {
  _vec3 as vec3,
  _mat4 as mat4,
  _quat as quat
};

export function to_radian(a) {
  return a * Math.PI / 180;
}

export function to_degrees(a) {
  return a * 180 / Math.PI;
}
