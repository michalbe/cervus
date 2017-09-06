const default_options = {
  entity: null
};

export class Component {
  constructor(options) {
    Object.assign(this,  default_options, options);
  }

  set(values) {
    Object.assign(this, values);
  }

  update() {
  }

  render() {
  }
}
