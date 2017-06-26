import { vertex_code, fragment_code } from './shader.js';
import { create_program_object, create_shader_object, gl, set_projection, set_normal_matrix } from '../../core/context.js';

let instance = null;

class Phong {

  constructor() {
    // if(!instance) {
    //   instance = this;
    // }

    this.program = create_program_object(
      create_shader_object(gl.VERTEX_SHADER, vertex_code),
      create_shader_object(gl.FRAGMENT_SHADER, fragment_code)
    );

    gl.useProgram(this.program);

    this.aVertex = gl.getAttribLocation(this.program, "aVertex");
    this.aNormal = gl.getAttribLocation(this.program, "aNormal");
    // this.uScale = gl.getUniformLocation(this.program, "uScale");
    this.uColor = gl.getUniformLocation(this.program, "uColor");



    // TODO: This should use global camera settings...
    set_projection(this.program, 45, window.innerWidth / window.innerHeight, 0.1, 300);

    // return instance;
  }

  update(entity) {
    gl.useProgram(this.program);
    // console.log(entity.buffers);

    gl.enableVertexAttribArray(this.aVertex);
    gl.bindBuffer(gl.ARRAY_BUFFER, entity.buffers.vertices);
    gl.vertexAttribPointer(this.aVertex, 3, gl.FLOAT, false, 0, 0);

    // Find out how to calculate NORMALS for vertices
    gl.enableVertexAttribArray(this.aNormal);
    gl.bindBuffer(gl.ARRAY_BUFFER, entity.buffers.normals);
    gl.vertexAttribPointer(this.aNormal, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, entity.buffers.indices);
    gl.drawElements(gl.TRIANGLES, entity.buffers.qty, gl.UNSIGNED_SHORT, 0);


    gl.uniform1f(
        gl.getUniformLocation(this.program, "uAmbient"),
        0.12
    );

    gl.uniform3f(
        gl.getUniformLocation(this.program, "uLightPosition"),
        5, 5, 5
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

    set_normal_matrix(this.program, entity.model_view_matrix);
  }
}

export { Phong };
