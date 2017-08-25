const vertex_code =`
  precision mediump float;
  uniform mat4 p;
  uniform mat4 v;
  uniform mat4 w;
  attribute vec3 P;
  void main()
  {
    gl_Position = p * v * vec4((w * vec4(P, 1.0)).xyz, 1.0);
  }
`;

const fragment_code =`
  precision mediump float;
  uniform vec4 m;
  void main() {
    gl_FragColor = m;
  }
`;

export { vertex_code, fragment_code };
