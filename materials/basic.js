import { gl } from '../core/context';
import { Material } from '../core';

import { Render, Morph, Transform } from '../components';

export class BasicMaterial extends Material {
  constructor(options) {
    super(options);

    this.setup_program();
  }

  get_locations() {
    this.get_uniforms_and_attrs(
      ['p', 'v', 'w', 'c', 'frame_delta', 'fog_color', 'fog_distance', 'camera'],
      ['P_current', 'P_next', 'a_t']
    );
  }

  apply_shader(entity, game) {
    const [render, morph] = entity.get_components(Render, Morph);
    let buffers = render.buffers;

    if (render.material.has_feature('MORPH')) {

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

    if (render.material.has_feature('TEXTURE')) {

      gl.uniform1i(this.uniforms.u_t, 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, render.material._textures.gl_texture);

      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.uvs);
      gl.enableVertexAttribArray(this.attribs.a_t);
      gl.vertexAttribPointer(this.attribs.a_t, 2, gl.FLOAT, true, 0, 0);

    }

    if (render.material.has_feature('FOG')) {
      gl.uniform3fv(this.uniforms.fog_color, this.fog.color);
      gl.uniform2fv(this.uniforms.fog_distance, this.fog.distance);
      gl.uniform3fv(this.uniforms.camera, game.camera.get_component(Transform).position);
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
    gl.drawElements(this.draw_mode, buffers.qty, gl.UNSIGNED_SHORT, 0);
  }
}
