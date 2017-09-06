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
    this.components.set(component.constructor, component);
  }

  add_components(components) {
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
  }

  update(tick_delta) {
    if (this.skip) {
      return;
    }

    this.components.forEach(component => component.update(tick_delta));
    this.entities.forEach(entity => entity.update(tick_delta));
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
