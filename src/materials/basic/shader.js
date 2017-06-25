const vertex_code =`#version 300 es

  in vec3 aVertex;
  uniform mat4 uModelView;
  uniform mat4 uProjection;
  
  void main(void) {
    gl_Position = uProjection * uModelView * vec4(aVertex, 1.0);
  }
`;

const fragment_code =`#version 300 es
  #ifdef GL_ES
    precision mediump float;
  #endif

  uniform vec4 uColor;
  out vec4 outColor;
  
  void main(void) {
    outColor = uColor;
  }
`;

export { vertex_code, fragment_code };
