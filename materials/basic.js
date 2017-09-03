import { gl } from '../core/context';
import { Material } from './material';

export class BasicMaterial extends Material {
  constructor() {
    super();

    this.vertex_shader = {
      variables: `uniform mat4 p;
        uniform mat4 v;
        uniform mat4 w;
        uniform float frame_delta;
        uniform float do_morph;
        attribute vec3 P_current;
        attribute vec3 P_next;`,

      body: `if (do_morph == 1.0) {
        float next_frame_delta = 1.0 - frame_delta;
        gl_Position = p * v * vec4((w * vec4(P_next * next_frame_delta + P_current * frame_delta, 1.0)).xyz, 1.0);
      } else {
        gl_Position = p * v * vec4((w * vec4(P_current, 1.0)).xyz, 1.0);
      }`
    };

    this.fragment_shader = {
      variables: 'uniform vec4 c;',
      body: 'gl_FragColor = c;'
    };

    this.setup_program();
    this.get_uniforms_and_attrs(
      ['p', 'v', 'w', 'c', 'frame_delta', 'do_morph'],
      ['P_current', 'P_next']
    );
  }

  apply_shader(entity) {
    let buffers = entity.buffers;

    if (Array.isArray(entity.buffers)) {
      buffers = entity.buffers[entity.current_frame];
    }

    // current frame
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertices);
    gl.vertexAttribPointer(
      this.attribs.P_current,
      3, gl.FLOAT, gl.FALSE,
      0, 0
    );

    gl.enableVertexAttribArray(this.attribs.P_current);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
    gl.drawElements(gl.TRIANGLES, buffers.qty, gl.UNSIGNED_SHORT, 0);

    if (typeof entity.next_frame === 'number') {
      buffers = entity.buffers[entity.next_frame];
      // next frame
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertices);

      gl.vertexAttribPointer(
        this.attribs.P_next,
        3, gl.FLOAT, gl.FALSE,
        0, 0
      );
      gl.enableVertexAttribArray(this.attribs.P_next);

      gl.uniform1f(this.uniforms.do_morph, 1);
    } else {
      gl.uniform1f(this.uniforms.do_morph, 0);
    }

    gl.uniform1f(this.uniforms.frame_delta, entity.frame_delta);
  }
}

export const basic = new BasicMaterial();
