const vertex_code =`#version 300 es

  in vec3 aVertex;
  in vec3 aNormal;

  uniform mat4 uModelView;
  uniform mat4 uProjection;
  uniform mat3 uNormalMatrix;
  uniform vec3 uLightPosition;

  out float vDiffuse;
  out float vSpecular;
  out vec4 vPosition;
  out vec3 vNormal;

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

const fragment_code =`#version 300 es

  #ifdef GL_ES
    precision mediump float;
  #endif

  uniform float uAmbient;
  uniform vec3 uColor;

  in float vDiffuse;
  in float vSpecular;
  in vec3 vNormal;

  out vec4 outColor;
  void main(void) {

    float light = uAmbient + vDiffuse + vSpecular;

    outColor = vec4(uColor * light, 0.9);
  }
`;

export { vertex_code, fragment_code };
