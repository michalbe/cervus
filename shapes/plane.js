import { Entity } from '../core';

const vertices = [
  -1,  0,  1,
   1,  0,  1,
   1, 0,  -1,
  -1, 0,  -1
];

const indices = [
   0,  1,  3,
   3,  1,  2
];

const normals = [
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0
];

export class Plane extends Entity {
  constructor(options = {}) {
    options.vertices = vertices;
    options.indices = indices;
    options.normals = normals;

    super(options);
  }
}
