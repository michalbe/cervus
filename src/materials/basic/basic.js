import { vertex_code, fragment_code } from './shader.js';
import { create_program_object, create_shader_object, gl, set_projection } from '../../core/context.js';

let instance = null;

class Basic {

  constructor() {
    if(!instance) {
      instance = this;
    }

    this.program = create_program_object(
      create_shader_object(gl.VERTEX_SHADER, vertex_code),
      create_shader_object(gl.FRAGMENT_SHADER, fragment_code)
    );

    gl.useProgram(this.program);
    const aVertex = gl.getAttribLocation(this.program, "aVertex");
    gl.enableVertexAttribArray(aVertex);

    // TODO: This should use global camera settings...
    set_projection(this.program, 45, window.innerWidth / window.innerHeight, 0.1, 300);

    return instance;
  }


}

export { Basic };
