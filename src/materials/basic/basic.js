import { vertex_code, fragment_code } from './shader.js';
import { create_program_object, create_shader_object, gl, set_projection } from '../../core/context.js';

function get_program() {
  const program = create_program_object(
    create_shader_object(gl.VERTEX_SHADER, vertex_code),
    create_shader_object(gl.FRAGMENT_SHADER, fragment_code)
  );

  gl.useProgram(program);
  const aVertex = gl.getAttribLocation(program, "aVertex");
  gl.enableVertexAttribArray(aVertex);

  set_projection(program, 45, window.innerWidth / window.innerHeight, 0.1, 300);
  return program;
}

const basic = { get_program };
export { basic };
