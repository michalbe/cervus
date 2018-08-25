import { Entity } from '../core';
import { Transform } from '../components';

export class Group extends Entity {
  constructor(options) {
    super(Object.assign({
      components: [
          new Transform()
      ]
    }, options));
  }
}
