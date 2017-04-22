const vertex_code =
  "attribute vec3 aVertex;" +
  "uniform mat4 uModelView;" +
  "uniform mat4 uProjection;" +
  "void main(void) {" +
    "gl_Position = uProjection * uModelView * vec4(aVertex, 1.0);" +
  "}"
;

const fragment_code =
  "#ifdef GL_ES\r\n" +
    "precision mediump float;\r\n" +
  "#endif\r\n" +
  "uniform vec4 uColor;" +
  "void main(void) {" +
    "gl_FragColor = uColor;" +
  "}"
;

export { vertex_code, fragment_code };
