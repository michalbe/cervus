import { Component } from '../core/component';
import { Transform } from './';
import { to_euler } from '../math/quat';

import * as OIMO from 'oimo';

const default_options = {
  world: null,
  physics: null
}

export class RigidBody extends Component {
  constructor(options) {
    super(options);
    Object.assign(this,  default_options, options);
  }

  mount() {
    const transform_component = this.entity.get_component(Transform);
    const body_data = Object.assign({},
      this.physics,
      {
        position: transform_component.position,
        rotation: to_euler(transform_component.rotation),
        size: transform_component.scale
      }
    );
    console.log(body_data);
    this.body = this.world.add(body_data);
  }

  update() {

  }
}
