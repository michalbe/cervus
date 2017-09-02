import { create_program_object, create_shader_object, gl } from '../core/context';

const vertex_code =`
  precision mediump float;
  uniform mat4 p;
  uniform mat4 v;
  uniform mat4 w;
  uniform float frame_delta;
  attribute vec3 P_current;
  attribute vec3 P_next;
  attribute vec3 N_current;
  attribute vec3 N_next;
  varying vec3 fp;
  varying vec3 fn;

  void main()
  {
    float next_frame_delta = 1.0 - frame_delta;
    fp = (w * vec4(P_next * next_frame_delta + P_current * frame_delta, 1.0)).xyz;
    fn = (w * vec4(N_next * next_frame_delta + N_current * frame_delta, 0.0)).xyz;
    gl_Position = p * v * vec4(fp, 1.0);
  }
`;

const fragment_code =`
  precision mediump float;
  uniform vec3 lp;
  uniform vec4 c;
  uniform vec2 li;
  varying vec3 fp;
  varying vec3 fn;

  void main()
  {
    gl_FragColor = vec4(c.rgb * li.x + li.y * max(dot(fn, normalize(lp - fp)), 0.0), c.a);
  }
`;


export class AnimatedPhongMaterial {
  constructor() {
    this.program = create_program_object(
      create_shader_object(gl.VERTEX_SHADER, vertex_code),
      create_shader_object(gl.FRAGMENT_SHADER, fragment_code)
    );

    if (this.program.error) {
      console.log(this.program.error); return;
    }

    this.uniforms = {
      p: gl.getUniformLocation(this.program, 'p'),
      v: gl.getUniformLocation(this.program, 'v'),
      w: gl.getUniformLocation(this.program, 'w'),

      lp: gl.getUniformLocation(this.program, 'lp'),
      c: gl.getUniformLocation(this.program, 'c'),
      li: gl.getUniformLocation(this.program, 'li'),

      frame_delta: gl.getUniformLocation(this.program, 'frame_delta'),
    };


    this.attribs = {
      P_current: gl.getAttribLocation(this.program, 'P_current'),
      P_next:  gl.getAttribLocation(this.program, 'P_next'),
      N_current: gl.getAttribLocation(this.program, 'N_current'),
      N_next: gl.getAttribLocation(this.program, 'N_next')
    };
  }

  render(entity) {
    let ent = entity;
    let game = ent.game;

    while(ent.parent && !game) {
      ent = ent.parent;
      game = ent.game;
    }

    gl.useProgram(this.program);
    gl.uniformMatrix4fv(this.uniforms.p, gl.FALSE, game.projMatrix);
    gl.uniformMatrix4fv(this.uniforms.v, gl.FALSE, game.viewMatrix);

    gl.uniformMatrix4fv(
      this.uniforms.w,
      gl.FALSE,
      entity.world_matrix
    );

    gl.uniform4fv(
      this.uniforms.c,
      entity.color_vec
    );


    // current frame
    gl.bindBuffer(gl.ARRAY_BUFFER, entity.buffers[entity.current_frame].vertices);
    gl.vertexAttribPointer(
      this.attribs.P_current,
      3, gl.FLOAT, gl.FALSE,
      0, 0
    );
    gl.enableVertexAttribArray(this.attribs.P_current);

    gl.bindBuffer(gl.ARRAY_BUFFER, entity.buffers[entity.current_frame].normals);
    gl.vertexAttribPointer(
      this.attribs.N_current,
      3, gl.FLOAT, gl.FALSE,
      0, 0
    );
    gl.enableVertexAttribArray(this.attribs.N_current);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, entity.buffers[entity.current_frame].indices);
    gl.drawElements(gl.TRIANGLES, entity.buffers[entity.current_frame].qty, gl.UNSIGNED_SHORT, 0);

    // next frame
    gl.bindBuffer(gl.ARRAY_BUFFER, entity.buffers[entity.next_frame].vertices);
    gl.vertexAttribPointer(
      this.attribs.P_next,
      3, gl.FLOAT, gl.FALSE,
      0, 0
    );
    gl.enableVertexAttribArray(this.attribs.P_next);

    gl.uniform3fv(this.uniforms.lp, game.light_position);
    gl.uniform2fv(this.uniforms.li, [game.light_intensity, 1 - game.light_intensity]);
    gl.uniform1f(this.uniforms.frame_delta, entity.frame_delta);
  }
}

export const animated_phong = new AnimatedPhongMaterial();
