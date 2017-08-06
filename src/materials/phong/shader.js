const vertex_code =`
  precision mediump float;

  uniform mat4 mProj;
  uniform mat4 mView;
  uniform mat4 mWorld;

  attribute vec3 vPos;
  attribute vec3 vNorm;

  varying vec3 fPos;
  varying vec3 fNorm;

  void main()
  {
    fPos = (mWorld * vec4(vPos, 1.0)).xyz;
    fNorm = (mWorld * vec4(vNorm, 0.0)).xyz;

    gl_Position = mProj * mView * vec4(fPos, 1.0);
  }
`;

const fragment_code =`
  precision mediump float;

  uniform vec3 pointLightPosition;
  uniform vec4 meshColor;

  varying vec3 fPos;
  varying vec3 fNorm;

  void main()
  {
    vec3 toLightNormal = normalize(pointLightPosition - fPos);

    float lightIntensity = 0.8 + 0.2 * max(dot(fNorm, toLightNormal), 0.0);

    gl_FragColor = vec4(meshColor.rgb * lightIntensity, meshColor.a);
  }
`;

export { vertex_code, fragment_code };
