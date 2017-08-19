import { vertex_code, fragment_code } from './shader.js';
import { create_program_object, create_shader_object, gl } from '../../core/context.js';

class Phong {

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

      lp: gl.getUniformLocation(this.program, 'lp'),
      c: gl.getUniformLocation(this.program, 'c'),
      li: gl.getUniformLocation(this.program, 'li'),
    };

    this.attribs = {
      P: gl.getAttribLocation(this.program, 'P'),
      N: gl.getAttribLocation(this.program, 'N'),
    };
  }

  render(entity) {
    const game = entity.game || entity.parent.game;
    gl.useProgram(this.program);
    gl.uniformMatrix4fv(this.uniforms.p, gl.FALSE, game.projMatrix);
    gl.uniformMatrix4fv(this.uniforms.v, gl.FALSE, game.viewMatrix);
    // gl.uniform3fv(this.uniforms.lp, entity.game ? entity.game.camera.position : entity.parent.game.camera.position);
    gl.uniform3fv(this.uniforms.lp, game.light_position);
    gl.uniform2fv(this.uniforms.li, [1 - game.light_intensity, game.light_intensity]);

    gl.uniformMatrix4fv(
        this.uniforms.w,
        gl.FALSE,
        entity.model_view_matrix
      );
      // console.trace();
      // console.log(entity.color_vec.length, entity.color_vec);
      // debugger;
      gl.uniform4fv(
        this.uniforms.c,
        entity.color_vec
      );

      // debugger;
      gl.bindBuffer(gl.ARRAY_BUFFER, entity.buffers.vertices);
      gl.vertexAttribPointer(
        this.attribs.P,
        3, gl.FLOAT, gl.FALSE,
        0, 0
      );
      gl.enableVertexAttribArray(this.attribs.P);

      gl.bindBuffer(gl.ARRAY_BUFFER, entity.buffers.normals);
      gl.vertexAttribPointer(

        this.attribs.N,
        3, gl.FLOAT, gl.FALSE,
        0, 0
      );

      gl.enableVertexAttribArray(this.attribs.N);

      gl.bindBuffer(gl.ARRAY_BUFFER, null);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, entity.buffers.indices);
      gl.drawElements(gl.TRIANGLES, entity.buffers.qty, gl.UNSIGNED_SHORT, 0);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }
}

export { Phong };
