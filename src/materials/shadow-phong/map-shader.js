const generator_vertex_code =`
  precision mediump float;

  uniform mat4 mProj;
  uniform mat4 mView;
  uniform mat4 mWorld;

  attribute vec3 vPos;

  varying vec3 fPos;

  void main()
  {
    fPos = (mWorld * vec4(vPos, 1.0)).xyz;

    gl_Position = mProj * mView * vec4(fPos, 1.0);
  }
`;

const generator_fragment_code =`
precision mediump float;

uniform vec3 pointLightPosition;
uniform vec2 shadowClipNearFar;

varying vec3 fPos;

void main()
{
	vec3 fromLightToFrag = (fPos - pointLightPosition);

	float lightFragDist =
		(length(fromLightToFrag) - shadowClipNearFar.x)
		/
		(shadowClipNearFar.y - shadowClipNearFar.x);

	gl_FragColor = vec4(lightFragDist, lightFragDist, lightFragDist, 1.0);
}
`;

export { generator_vertex_code, generator_fragment_code };
