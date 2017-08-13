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
      mProj: gl.getUniformLocation(this.program, 'mProj'),
      mView: gl.getUniformLocation(this.program, 'mView'),
      mWorld: gl.getUniformLocation(this.program, 'mWorld'),

      pointLightPosition: gl.getUniformLocation(this.program, 'pointLightPosition'),
      meshColor: gl.getUniformLocation(this.program, 'meshColor'),
    };

    this.attribs = {
      vPos: gl.getAttribLocation(this.program, 'vPos'),
      vNorm: gl.getAttribLocation(this.program, 'vNorm'),
    };
  }

  render(entity) {
    gl.useProgram(this.program);
    gl.uniformMatrix4fv(this.uniforms.mProj, gl.FALSE, entity.game ? entity.game.projMatrix : entity.parent.game.projMatrix);
    gl.uniformMatrix4fv(this.uniforms.mView, gl.FALSE, entity.game ? entity.game.viewMatrix : entity.parent.game.viewMatrix);
    gl.uniform3fv(this.uniforms.pointLightPosition, [0, 2, 2]);

    gl.uniformMatrix4fv(
        this.uniforms.mWorld,
        gl.FALSE,
        entity.model_view_matrix
      );
      // console.trace();
      // console.log(entity.color_vec.length, entity.color_vec);
      // debugger;
      gl.uniform4fv(
        this.uniforms.meshColor,
        entity.color_vec
      );

      // debugger;
      gl.bindBuffer(gl.ARRAY_BUFFER, entity.buffers.vertices);
      gl.vertexAttribPointer(
        this.attribs.vPos,
        3, gl.FLOAT, gl.FALSE,
        0, 0
      );
      gl.enableVertexAttribArray(this.attribs.vPos);

      gl.bindBuffer(gl.ARRAY_BUFFER, entity.buffers.normals);
      gl.vertexAttribPointer(

        this.attribs.vNorm,
        3, gl.FLOAT, gl.FALSE,
        0, 0
      );

      gl.enableVertexAttribArray(this.attribs.vNorm);

      gl.bindBuffer(gl.ARRAY_BUFFER, null);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, entity.buffers.indices);
      gl.drawElements(gl.TRIANGLES, entity.buffers.qty, gl.UNSIGNED_SHORT, 0);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }
}

export { Phong };
