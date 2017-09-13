import { create_program_object, create_shader_object, gl } from './context';
import { Transform, Render } from '../components';

export class Material {
  constructor() {
    this.uniforms = {};
    this.attribs = {};
  }

  setup_program() {
    this.program = create_program_object(
      create_shader_object(
        gl.VERTEX_SHADER,
        this.get_shader_code(
          this.vertex_shader.variables,
          this.vertex_shader.body
        )
      ),
      create_shader_object(gl.FRAGMENT_SHADER,
        this.get_shader_code(
          this.fragment_shader.variables,
          this.fragment_shader.body
        ))
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

  get_shader_code(variables, body) {
    return `
      precision mediump float;
      ${variables}

      void main()
      {
        ${body}
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

    const [entity_transform, entity_render] = entity.get_components(Transform, Render);

    gl.useProgram(this.program);
    gl.uniformMatrix4fv(this.uniforms.p, gl.FALSE, game.projMatrix);
    gl.uniformMatrix4fv(this.uniforms.v, gl.FALSE, game.viewMatrix);
    // console.log(entity_transform.world_matrix, entity_render.color_vec);
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
