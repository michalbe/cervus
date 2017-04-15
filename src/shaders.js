const vertex_code =
  "attribute vec3 aVertex;" +
  "uniform mat4 uModelView;" +
  "uniform mat4 uProjection;" +
  "varying vec4 vColor;" +
  "void main(void) {" +
    "gl_Position = uProjection * uModelView * vec4(aVertex, 1.0);" +
    "vColor = vec4((aVertex.xyz + 1.0) / 2.0, 1.0);" +
  "}"
;

const fragment_code =
  "#ifdef GL_ES\r\n" +
    "precision mediump float;\r\n" +
  "#endif\r\n" +
  "varying vec4 vColor;" +
  "void main(void) {" +
    "gl_FragColor = vColor;" +
  "}"
;

export { vertex_code, fragment_code };
