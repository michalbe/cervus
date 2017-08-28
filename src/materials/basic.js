import { create_program_object, create_shader_object, gl } from '../core/context';

const vertex_code =`
  precision mediump float;
  uniform mat4 p;
  uniform mat4 v;
  uniform mat4 w;
  attribute vec3 P;
  void main()
  {
    gl_Position = p * v * vec4((w * vec4(P, 1.0)).xyz, 1.0);
  }
`;

const fragment_code =`
  precision mediump float;
  uniform vec4 m;
  void main() {
    gl_FragColor = m;
  }
`;

class Basic {

  constructor() {
    this.program = create_program_object(
      create_shader_object(gl.VERTEX_SHADER, vertex_code),
      create_shader_object(gl.FRAGMENT_SHADER, fragment_code)
    );

    if (this.program.error) {
      console.log(this.program.error); return;
    }

    this.uniforms = {
      p: gl.getUniformLocation(this.program, 'p'),
      v: gl.getUniformLocation(this.program, 'v'),
      w: gl.getUniformLocation(this.program, 'w'),

      m: gl.getUniformLocation(this.program, 'm'),
    };

    this.attribs = {
      P: gl.getAttribLocation(this.program, 'P')
    };
  }

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
      this.uniforms.m,
      entity.color_vec
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, entity.buffers.vertices);

    gl.vertexAttribPointer(
      this.attribs.P,
      3, gl.FLOAT, gl.FALSE,
      0, 0
    );

    gl.enableVertexAttribArray(this.attribs.P);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, entity.buffers.indices);
    gl.drawElements(gl.TRIANGLES, entity.buffers.qty, gl.UNSIGNED_SHORT, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }
}

const basic = new Basic();
export { basic };
