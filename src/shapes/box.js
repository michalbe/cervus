import { Entity } from '../core/entity.js';

const vertices = [
  -1,  1,  1,
   1,  1,  1,
   1, -1,  1,
  -1, -1,  1,

  -1,  1, -1,
   1,  1, -1,
   1, -1, -1,
  -1, -1, -1,

   1,  1,  1,
   1,  1, -1,
   1, -1, -1,
   1, -1,  1,

  -1,  1,  1,
  -1,  1, -1,
   1,  1, -1,
   1,  1,  1,

   1, -1,  1,
   1, -1, -1,
  -1, -1, -1,
  -1, -1,  1,

  -1, -1,  1,
  -1, -1, -1,
  -1,  1, -1,
  -1,  1,  1
];

const indices = [
   1,  0,  3,
   1,  3,  2,
   
   4,  5,  7,
   5,  6,  7,

   9,  8, 11,
   9, 11, 10,

  13, 12, 15,
  13, 15, 14,

  17, 16, 19,
  17, 19, 18,

  21, 20, 23,
  21, 23, 22
];

class Box extends Entity {
  constructor(options = {}) {
    options.vertices = vertices;
    options.indices = indices;

    super(options);
  }
}

export { Box };
