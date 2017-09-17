import { gl } from '../core/context';
import { Material } from '../core';

import { Render, Morph } from '../components';

export class BasicMaterial extends Material {
  constructor() {
    super();

    this.vertex_shader = {
      variables: `uniform mat4 p;
        uniform mat4 v;
        uniform mat4 w;
        uniform float frame_delta;
        uniform float do_morph;
        in vec3 P_current;
        in vec3 P_next;`,

      body: `if (do_morph == 1.0) {
        float next_frame_delta = 1.0 - frame_delta;
        gl_Position = p * v * vec4((w * vec4(P_next * next_frame_delta + P_current * frame_delta, 1.0)).xyz, 1.0);
      } else {
        gl_Position = p * v * vec4((w * vec4(P_current, 1.0)).xyz, 1.0);
      }`
    };

    this.fragment_shader = {
      variables: `
        uniform vec4 c;
        out vec4 frag_color;
      `,
      body: 'frag_color = c;'
    };

    this.setup_program();
    this.get_uniforms_and_attrs(
      ['p', 'v', 'w', 'c', 'frame_delta', 'do_morph'],
      ['P_current',  'P_next']
    );
  }

  apply_shader(entity) {
    const [render, morph] = entity.get_components(Render, Morph);
    let buffers = render.buffers;

    if (morph) {

      buffers = render.buffers[morph.current_frame];

      // next frame
      gl.bindBuffer(gl.ARRAY_BUFFER, render.buffers[morph.next_frame].vertices);
      gl.vertexAttribPointer(
        this.attribs.P_next,
        3, gl.FLOAT, gl.FALSE,
        0, 0
      );
      gl.enableVertexAttribArray(this.attribs.P_next);

      gl.uniform1f(this.uniforms.do_morph, 1);
      gl.uniform1f(this.uniforms.frame_delta, morph.frame_delta);

    } else {

      gl.uniform1f(this.uniforms.do_morph, 0);

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
  }
}

export const basic = new BasicMaterial();
