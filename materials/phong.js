import { create_program_object, create_shader_object, gl } from '../core/context';

const vertex_code =`
  precision mediump float;
  uniform mat4 p;
  uniform mat4 v;
  uniform mat4 w;
  attribute vec3 P;
  attribute vec3 N;
  varying vec3 fp;
  varying vec3 fn;

  void main()
  {
    fp = (w * vec4(P, 1.0)).xyz;
    fn = (w * vec4(N, 0.0)).xyz;
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


export class PhongMaterial {
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
    };

    this.attribs = {
      P: gl.getAttribLocation(this.program, 'P'),
      N: gl.getAttribLocation(this.program, 'N'),
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

    gl.bindBuffer(gl.ARRAY_BUFFER, entity.buffers.vertices);

    gl.vertexAttribPointer(
      this.attribs.P,
      3, gl.FLOAT, gl.FALSE,
      0, 0
    );

    gl.enableVertexAttribArray(this.attribs.P);

    gl.bindBuffer(gl.ARRAY_BUFFER, entity.buffers.normals);
    gl.vertexAttribPointer(
      this.attribs.N,
      3, gl.FLOAT, gl.FALSE,
      0, 0
    );

    gl.enableVertexAttribArray(this.attribs.N);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, entity.buffers.indices);
    gl.drawElements(gl.TRIANGLES, entity.buffers.qty, gl.UNSIGNED_SHORT, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    gl.uniform3fv(this.uniforms.lp, game.light_position);
    gl.uniform2fv(this.uniforms.li, [game.light_intensity, 1 - game.light_intensity]);
  }
}

export const phong = new PhongMaterial();