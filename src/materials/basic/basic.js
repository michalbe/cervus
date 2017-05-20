import { vertex_code, fragment_code } from './shader.js';
import { create_program_object, create_shader_object, gl, set_projection } from '../../core/context.js';

// let instance = null;

class Basic {

  constructor() {
    // if(!instance) {
    //   instance = this;
    // }

    this.program = create_program_object(
      create_shader_object(gl.VERTEX_SHADER, vertex_code),
      create_shader_object(gl.FRAGMENT_SHADER, fragment_code)
    );

    gl.useProgram(this.program);
    const aVertex = gl.getAttribLocation(this.program, "aVertex");
    gl.enableVertexAttribArray(aVertex);

    // TODO: This should use global camera settings...
    set_projection(this.program, 45, window.innerWidth / window.innerHeight, 0.1, 300);

    // return instance;
  }

  update(entity) {
    gl.useProgram(this.program);

    gl.bindBuffer(gl.ARRAY_BUFFER, entity.buffers.vertices);
    gl.vertexAttribPointer(gl.getAttribLocation(this.program, "aVertex"), 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, entity.buffers.indices);
    gl.drawElements(gl.TRIANGLES, entity.buffers.qty, gl.UNSIGNED_SHORT, 0);

    gl.uniform4fv(
      gl.getUniformLocation(this.program, "uColor"),
      entity.color_vec
    );

    gl.uniformMatrix4fv(
      gl.getUniformLocation(this.program, "uModelView"),
      false,
      entity.model_view_matrix
    );
  }
}

export { Basic };
