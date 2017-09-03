import { create_program_object, create_shader_object, gl } from '../core/context';

export class Material {
  constructor() {
    this.uniforms = {};
    this.attribs = {};
  }

  setup_program() {
    this.program = create_program_object(
      create_shader_object(gl.VERTEX_SHADER, this.get_shader_code('vertex')),
      create_shader_object(gl.FRAGMENT_SHADER, this.get_shader_code('fragment'))
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

  get_shader_code(type) {
    return `
      precision mediump float;
      ${this[type + '_shader'].variables}

      void main()
      {
        ${this[type + '_shader'].body}
      }
    `;
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

    gl.useProgram(this.program);
    gl.uniformMatrix4fv(this.uniforms.p, gl.FALSE, game.projMatrix);
    gl.uniformMatrix4fv(this.uniforms.v, gl.FALSE, game.viewMatrix);

    gl.uniformMatrix4fv(
      this.uniforms.w,
      gl.FALSE,
      entity.world_matrix
    );

    gl.uniform4fv(
      this.uniforms.c,
      entity.color_vec
    );

    this.apply_shader(entity, game);
  }
}
