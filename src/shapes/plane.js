import { Entity } from '../core/entity.js';

const vertices = [
  -1,  1,  1,
   1,  1,  1,
   1, -1,  1,
  -1, -1,  1
];

const indices = [
   1,  0,  3,
   1,  3,  2
];

const normals = [
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1
];

class Plane extends Entity {
  constructor(options = {}) {
    options.vertices = vertices;
    options.indices = indices;
    options.normals = normals;

    super(options);
  }
}

export { Plane };
