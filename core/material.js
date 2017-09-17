import { create_program_object, create_shader_object, gl } from './context';
import { Transform, Render } from '../components';

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
  }


  add_feature(feature) {
    this.features.add(feature);
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
