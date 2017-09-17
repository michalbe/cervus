import { gl } from '../core/context';
import { Material } from '../core';

import { Render, Morph, Light, Transform } from '../components';

export class PhongMaterial extends Material {
  constructor(options) {
    super(options);
    this.add_feature('LIGHTS');

    this.setup_program();
    this.get_uniforms_and_attrs(
      ['p', 'v', 'w', 'lp', 'li', 'lc', 'c', 'frame_delta'],
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

      gl.uniform1f(this.uniforms.frame_delta, morph.frame_delta);
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
    gl.drawElements(this.draw_mode, buffers.qty, gl.UNSIGNED_SHORT, 0);

    const light = Array.from(game.get_entities_by_component(Light))[0];

    gl.uniform3fv(this.uniforms.lp, light.get_component(Transform).position);
    gl.uniform2fv(this.uniforms.li, [
      light.get_component(Light).intensity,
      1 - light.get_component(Light).intensity
    ]);

    gl.uniform3fv(this.uniforms.lc, light.get_component(Light).color_vec);


  }
}
