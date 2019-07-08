const default_options = {
  components: [],
  skip: false,
};

export class Entity {
  constructor(options) {
    Object.assign(this, default_options, options);

    this.entities = new Set();
    this.components = new Map();

    this.add_components(options.components);
  }

  add_component(component) {
    component.entity = this;
    component.mount();
    this.components.set(component.constructor, component);
  }

  add_components(components = []) {
    components.forEach((component) => this.add_component(component));
  }

  get_component(component) {
    return this.components.get(component);
  }

  get_components(...components) {
    return components.map(component => this.get_component(component));
  }

  add(entity) {
    entity.parent = this;
    this.entities.add(entity);

    if (this.game) {
      // Track the child if the current entity already exists in the scene.
      this.game.track_entity(entity);
    }
  }

  update(tick_delta) {
    if (this.skip) {
      return;
    }

    const update_each = updatable => updatable.update(tick_delta);
    this.components.forEach(update_each);
    this.entities.forEach(update_each);
  }

  render(tick_delta) {
    if (this.skip) {
      return;
    }

    const render_each = renderable => renderable.render(tick_delta);
    this.components.forEach(render_each);
    this.entities.forEach(render_each);
  }
}
