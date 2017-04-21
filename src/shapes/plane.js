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

class Plane extends Entity {
  constructor(options = {}) {
    options.vertices = vertices;
    options.indices = indices;
    
    super(options);
  }
}

export { Plane };
