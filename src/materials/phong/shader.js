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

export { vertex_code, fragment_code };
