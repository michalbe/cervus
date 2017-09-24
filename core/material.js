import { create_program_object, create_shader_object, gl } from './context';
import { Transform, Render } from '../components';
import { image_loader } from './';

import { vertex } from '../shaders';
import { fragment } from '../shaders';

export class Material {
  constructor(options) {
    this.uniforms = {};
    this.attribs = {};
    this.draw_mode = gl.TRIANGLES;
    this.features = new Set([].concat(
      ...Array.from(options.requires || []).map(comp => comp.features))
    );

    this._textures = {};

    this.texture = options.texture || false;
    this.normal_map = options.normal_map || false;
  }

  add_feature(feature) {
    this.features.add(feature);
  }

  has_feature(feature) {
    return this.features.has(feature);
  }

  remove_feature(feature) {
    this.features.delete(feature);
  }

  setup_program() {
    this.program = create_program_object(
      create_shader_object(
        gl.VERTEX_SHADER,
        vertex(Array.from(this.features))
      ),
      create_shader_object(
        gl.FRAGMENT_SHADER,
        fragment(Array.from(this.features))
      )
    );

    if (this.program.error) {
      console.log(this.program.error); return;
    } else {
      this.get_locations();
    }

  }

  get_uniforms_and_attrs(uniforms, attrs) {
    uniforms.forEach(uniform => {
      this.uniforms[uniform] = gl.getUniformLocation(this.program, uniform);
    });

    attrs.forEach(attr => {
      this.attribs[attr] = gl.getAttribLocation(this.program, attr);
    });
  }

  // apply_shader(entity, game) {
  //
  // }

  set texture(url) {
    this.build_texture(url, this._texture_url, 'TEXTURE', 'gl_texture');
  }

  get texture() {
    return this._texture_url;
  }

  set normal_map(url) {
    this.build_texture(url, this._normal_map_url, 'NORMAL_MAP', 'gl_normal_map');
  }

  get normal_map() {
    return this._normal_map_url;
  }

  build_texture(new_url, url_location, feature, gl_texture_key) {
    if (new_url !== url_location && new_url) {

      url_location = new_url;

      if (!this._textures[gl_texture_key]) {
        this._textures[gl_texture_key] = gl.createTexture();
      }

      image_loader(new_url)
      .then(image => {

        gl.bindTexture(gl.TEXTURE_2D, this._textures[gl_texture_key]);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);

        if (!this.has_feature(feature)) {
          this.add_feature(feature);
          this.setup_program();
        }
      })
      .catch(console.error);

    } else if (!new_url) {

      url_location = new_url;
      this.remove_feature(feature);
      this.setup_program();

    }
  }

  render(entity) {
    let ent = entity;
    let game = ent.game;

    while(ent.parent && !game) {
      ent = ent.parent;
      game = ent.game;
    }

    const [entity_transform, entity_render] = entity.get_components(Transform, Render);

    gl.useProgram(this.program);
    gl.uniformMatrix4fv(this.uniforms.p, gl.FALSE, game.projMatrix);
    gl.uniformMatrix4fv(this.uniforms.v, gl.FALSE, game.viewMatrix);

    gl.uniformMatrix4fv(
      this.uniforms.w,
      gl.FALSE,
      entity_transform.world_matrix
    );

    gl.uniform4fv(
      this.uniforms.c,
      entity_render.color_vec
    );

    this.apply_shader(entity, game);
  }
}
