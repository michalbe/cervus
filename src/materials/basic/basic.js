import { vertex_code, fragment_code } from './shader.js';
import { create_program_object, create_shader_object, gl } from '../../core/context.js';

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
      V: gl.getAttribLocation(this.program, 'V')
    };
  }

  render(entity) {
    gl.useProgram(this.program);
    gl.uniformMatrix4fv(this.uniforms.p, gl.FALSE, entity.game ? entity.game.projMatrix : entity.parent.game.projMatrix);
    gl.uniformMatrix4fv(this.uniforms.v, gl.FALSE, entity.game ? entity.game.viewMatrix : entity.parent.game.viewMatrix);

    gl.uniformMatrix4fv(
        this.uniforms.w,
        gl.FALSE,
        entity.model_view_matrix
      );

      gl.uniform4fv(
        this.uniforms.m,
        entity.color_vec
      );

      // debugger;
      gl.bindBuffer(gl.ARRAY_BUFFER, entity.buffers.vertices);
      gl.vertexAttribPointer(
        this.attribs.V,
        3, gl.FLOAT, gl.FALSE,
        0, 0
      );
      gl.enableVertexAttribArray(this.attribs.V);

      // gl.bindBuffer(gl.ARRAY_BUFFER, entity.buffers.normals);
      // gl.vertexAttribPointer(
      //
      //   this.attribs.vNorm,
      //   3, gl.FLOAT, gl.FALSE,
      //   0, 0
      // );

      // gl.enableVertexAttribArray(this.attribs.vNorm);

      // gl.bindBuffer(gl.ARRAY_BUFFER, null);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, entity.buffers.indices);
      gl.drawElements(gl.TRIANGLES, entity.buffers.qty, gl.UNSIGNED_SHORT, 0);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }
}

export { Basic };
