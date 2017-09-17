const default_options = {
  entity: null
};

export class Component {
  constructor(options) {
    Object.assign(this,  default_options, options);
    this.features = [];
  }

  /*
   * Called in Entity.add_component.
   *
   * Use this to intialize the component instance. this.entity is available
   * here.
   */
  mount() {
  }

  set(values) {
    Object.assign(this, values);
  }

  /*
   * Called on each tick.
   */
  update() {
  }

  /*
   * Called on each animation frame.
   */
  render() {
  }
}
