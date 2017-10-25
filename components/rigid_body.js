import { Component } from '../core/component';
import { Transform } from './';
import * as physics from '../physics';

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
    const shape = new physics.colliders[this.shape](
      this.transform.scale
    );

    this.body = new physics.Body(shape, this.mass);

    [this.body.position.x, this.body.position.y, this.body.position.z] = this.transform.position;
    this.world.addRigidBody(this.body);
  }

  update() {
    this.transform.position = [
      this.body.position.x,
      this.body.position.y,
      this.body.position.z
    ];

    this.transform.rotation = [
      this.body.rotation.x,
      this.body.rotation.y,
      this.body.rotation.z,
      this.body.rotation.w
    ];
  }
}
