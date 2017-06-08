const vertex_code =`
  attribute vec3 aVertex;
  attribute vec3 aNormal;

  uniform mat4 uModelView;
  uniform mat4 uProjection;
  uniform mat3 uNormalMatrix;
  uniform vec3 uLightPosition;

  varying float vDiffuse;
  varying float vSpecular;
  varying vec4 vPosition;
  varying vec3 vNormal;

  void main(void) {
    vPosition = uModelView * vec4(aVertex, 1.0);
    vNormal = normalize(aVertex);

    vec3 normal = normalize(uNormalMatrix * aNormal);
    vec3 lightDir = uLightPosition - vPosition.xyz;
    lightDir = normalize(lightDir);

    vDiffuse = max(dot(normal, lightDir), 0.0);

    vec3 viewDir = normalize(vPosition.xyz);
    vec3 reflectDir = reflect(lightDir, normal);
    float specular = dot(reflectDir, viewDir);
    vSpecular = pow(specular, 16.0);


    gl_Position = uProjection * uModelView * vec4(aVertex, 1.0);
  }
`;

const fragment_code =`
  #ifdef GL_ES
    precision mediump float;
  #endif

  uniform float uAmbient;
  uniform vec3 uColor;

  varying float vDiffuse;
  varying float vSpecular;
  varying vec3 vNormal;

  void main(void) {

    float light = uAmbient + vDiffuse + vSpecular;

    gl_FragColor = vec4(uColor * light, 0.9);
  }
`;

export { vertex_code, fragment_code };
