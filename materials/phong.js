import { gl } from '../core/context';
import { Material } from '../core';

import { Render, Morph } from '../components';

export class PhongMaterial extends Material {
  constructor(options) {
    super(options);
    this.add_feature('LIGHTS');
    // this.vertex_shader = {
    //   variables: `  uniform mat4 p;
    //     uniform mat4 v;
    //     uniform mat4 w;
    //     uniform float frame_delta;
    //     uniform float do_morph;
    //     in vec3 P_current;
    //     in vec3 P_next;
    //     in vec3 N_current;
    //     in vec3 N_next;
    //     out vec3 fp;
    //     out vec3 fn;`,
    //
    //   body: `if (do_morph == 1.0) {
    //     float next_frame_delta = 1.0 - frame_delta;
    //     fp = (w * vec4(P_next * next_frame_delta + P_current * frame_delta, 1.0)).xyz;
    //     fn = (w * vec4(N_next * next_frame_delta + N_current * frame_delta, 0.0)).xyz;
    //   } else {
    //     fp = (w * vec4(P_current, 1.0)).xyz;
    //     fn = (w * vec4(N_current, 0.0)).xyz;
    //   }
    //   gl_Position = p * v * vec4(fp, 1.0);`
    // };
    //
    // this.fragment_shader = {
    //   variables: `uniform vec3 lp;
    //     uniform vec4 c;
    //     uniform vec2 li;
    //     in vec3 fp;
    //     in vec3 fn;
    //     out vec4 frag_color;
    //   `,
    //
    //   body: `frag_color = vec4(c.rgb * li.x + li.y * max(dot(fn, normalize(lp - fp)), 0.0), c.a);`
    // };
    //

    this.setup_program();
    this.get_uniforms_and_attrs(
      ['p', 'v', 'w', 'lp', 'li', 'c', 'do_morph', 'frame_delta'],
      ['P_current', 'P_next', 'N_current', 'N_next']
    );
  }

  apply_shader(entity, game) {
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

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normals);
    gl.vertexAttribPointer(
      this.attribs.N_current,
      3, gl.FLOAT, gl.FALSE,
      0, 0
    );
    gl.enableVertexAttribArray(this.attribs.N_current);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
    gl.drawElements(gl.TRIANGLES, buffers.qty, gl.UNSIGNED_SHORT, 0);

    gl.uniform3fv(this.uniforms.lp, game.light_position);
    gl.uniform2fv(this.uniforms.li, [game.light_intensity, 1 - game.light_intensity]);
  }
}

// export const phong = new PhongMaterial();
