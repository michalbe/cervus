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
    if (url !== this._texture_url && url) {
      this._texture_url = url;
      this.apply_texture();
    } else if (!url) {
      this._texture_url = url;
      this.remove_feature('TEXTURE');
      this.setup_program();
    }
  }

  get texture() {
    return this._texture_url;
  }

  set normal_map(url) {
    if (url !== this._normal_map_url && url) {
      this._normal_map_url = url;
      this.apply_normal_map();
    } else if (!url) {
      this._normal_map_url = url;
      this.remove_feature('NORMAL_MAP');
      this.setup_program();
    }
  }

  get normal_map() {
    return this._normal_map_url;
  }

  apply_texture() {
    console.log('LADUJE TEXTURE');
    if (!this.gl_texture) {
      this.gl_texture = gl.createTexture();
    }

    image_loader(this._texture_url)
    .then(image => {
      gl.bindTexture(gl.TEXTURE_2D, this.gl_texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
      gl.generateMipmap(gl.TEXTURE_2D);
      this.add_feature('TEXTURE');
      // this shouldn't happen when `TEXTURE` feature is already added
      this.setup_program();
    })
    .catch(console.error);
  }

  apply_normal_map() {
    console.log('LADUJE TEXTURE');
    if (!this.gl_normal_map) {
      this.gl_normal_map = gl.createTexture();
    }

    image_loader(this._normal_map_url)
    .then(image => {
      gl.bindTexture(gl.TEXTURE_2D, this.gl_normal_map);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
      gl.generateMipmap(gl.TEXTURE_2D);
      this.add_feature('NORMAL_MAP');
      // this shouldn't happen when `NORMAL_MAP` feature is already added
      this.setup_program();
    })
    .catch(console.error);
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
