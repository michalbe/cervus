import { Component } from '../core/component';

const default_options = {
}

export class RigidBody extends Component {
  constructor(options) {
    super(options);
    Object.assign(this,  default_options, options);
  }


  update() {

  }
}
