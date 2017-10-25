import { Component } from '../core/component';
import { Transform } from './';
import { to_euler } from '../math/quat';

import * as Goblin from 'goblinphysics';

const default_options = {
  world: null,
  mass: 5,
  shape: 'box'
}

export class RigidBody extends Component {
  constructor(options) {
    super(options);
    Object.assign(this,  default_options, options);
  }

  mount() {
    this.transform = this.entity.get_component(Transform);
    // const body_data = Object.assign({},
    //   this.physics,
    //   {
    //     position: transform.position,
    //     rotation: to_euler(transform.rotation),
    //     size: transform.scale
    //   }
    // );
    const shape = new Goblin.default.BoxShape(
      this.transform.scale[0]/2,
      this.transform.scale[1]/2,
      this.transform.scale[2]/2
    );

    this.body = new Goblin.default.RigidBody(shape, this.mass);
    [this.body.position.x, this.body.position.y, this.body.position.z] = this.transform.position;
    this.world.addRigidBody(this.body);
  }

  update() {
    this.world.step(1/this.entity.game.fps);
    this.transform.position = [
      this.body.position.x,
      this.body.position.y,
      this.body.position.z
    ];
  }
}
