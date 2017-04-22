const vertex_code =
  "attribute vec3 aVertex;" +
  "attribute vec3 aNormal;" +

  "uniform mat4 uModelView;" +
  "uniform mat4 uProjection;" +
  "uniform mat3 uNormalMatrix;" +
  "uniform vec3 uLightPosition;" +

  "uniform float uScale;" +

  "varying float vDiffuse;" +
  "varying float vSpecular;" +
  "varying vec4 vPosition;" +
  "varying vec3 vNormal;" +

  "void main(void) {" +
    "vPosition = uModelView * vec4(aVertex * uScale, 1.0);" +
    "vNormal = normalize(aVertex);" +

    "vec3 normal = normalize(uNormalMatrix * aNormal);" +
    "vec3 lightDir = uLightPosition - vPosition.xyz;" +
    "lightDir = normalize(lightDir);" +

    "vDiffuse = max(dot(normal, lightDir), 0.0);" +

    "vec3 viewDir = normalize(vPosition.xyz);" +
    "vec3 reflectDir = reflect(lightDir, normal);" +
    "float specular = dot(reflectDir, viewDir);" +
    "vSpecular = pow(specular, 16.0);" +

    "gl_Position = uProjection * vPosition;" +
  "}"
;

const fragment_code =
  "#ifdef GL_ES\n" +
    "precision mediump float;\n" +
  "#endif\n" +

  // "uniform sampler2D uTexture;" +
  "uniform float uAmbient;" +
  "uniform vec4 uColor;" +

  "varying float vDiffuse;" +
  "varying float vSpecular;" +
  "varying vec3 vNormal;" +

  "void main(void) {" +
    // "float theta = acos(vNormal.y) / 3.14159;" +
    // "float phi = atan(vNormal.z, vNormal.x) / (2.0 * 3.14159);" +
    // "vec2 texCoord = vec2(-phi, theta);" +

    // "float texColor = texture2D(uTexture, texCoord).r;" +

    "float light = uAmbient + vDiffuse + vSpecular;" + // + texColor;" +
    "gl_FragColor = vec4(uColor * light);" +
  "}"
;

export { vertex_code, fragment_code };
