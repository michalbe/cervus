const vertex_code =`
  attribute vec3 aVertex;
  uniform mat4 uModelView;
  uniform mat4 uProjection;

  void main(void) {
    gl_Position = uProjection * uModelView * vec4(aVertex, 1.0);
  }
`;

const fragment_code =`
  #ifdef GL_ES
    precision mediump float;
  #endif

  uniform vec4 uColor;

  void main(void) {
    gl_FragColor = uColor;
  }
`;

export { vertex_code, fragment_code };
