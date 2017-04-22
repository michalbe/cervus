import { vertex_code, fragment_code } from './shader.js';
import { create_program_object, create_shader_object, gl, set_projection } from '../../core/context.js';

let instance = null;

class Phong {

  constructor() {
    if(!instance) {
      instance = this;
    }

    this.program = create_program_object(
      create_shader_object(gl.VERTEX_SHADER, vertex_code),
      create_shader_object(gl.FRAGMENT_SHADER, fragment_code)
    );

    gl.useProgram(this.program);

    this.aVertex = gl.getAttribLocation(this.program, "aVertex");
    this.aNormal = gl.getAttribLocation(this.program, "aNormal");
    this.uScale = gl.getUniformLocation(this.program, "uScale");
    this.uColor = gl.getUniformLocation(this.program, "uColor");

    gl.enableVertexAttribArray(this.aVertex);
    gl.enableVertexAttribArray(this.aNormal);

    // TODO: This should use global camera settings...
    set_projection(this.program, 45, window.innerWidth / window.innerHeight, 0.1, 300);

    return instance;
  }

  update(entity) {
    gl.useProgram(this.program);

    gl.bindBuffer(gl.ARRAY_BUFFER, entity.buffers.vertices);
    gl.vertexAttribPointer(this.aVertex, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, entity.buffers.indices);
    gl.drawElements(gl.TRIANGLES, entity.buffers.qty, gl.UNSIGNED_SHORT, 0);

    // Find out how to calculate NORMALS for vertices
    gl.bindBuffer(gl.ARRAY_BUFFER, entity.buffers.indices);
    gl.vertexAttribPointer(this.aNormal, 3, gl.FLOAT, false, 0, 0);

    gl.uniform1f(
        gl.getUniformLocation(this.program, "uAmbient"),
        0.12
    );
    gl.uniform3f(
        gl.getUniformLocation(this.program, "uLightPosition"),
        0, 15, 0
    );

    gl.uniform3fv(
      gl.getUniformLocation(this.program, "uColor"),
      [entity.color_vec[0], entity.color_vec[1], entity.color_vec[2]]
    );

    gl.uniformMatrix4fv(
      gl.getUniformLocation(this.program, "uModelView"),
      false,
      entity.model_view_matrix
    );
  }
}

export { Phong };
