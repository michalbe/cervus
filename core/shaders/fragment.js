export const fragment = (defines) =>
  `#version 300 es

  ${defines.map(def => `
    #define ${def}
  `).join('')}

  precision mediump float;

  uniform vec4 c;

  in vec3 fp;

  #ifdef LIGHTS
    uniform vec3 lp;
    uniform vec2 li;

    in vec3 fn;
 #endif

  out vec4 frag_color;

  void main()
  {
    #ifdef LIGHTS
      frag_color = vec4(c.rgb * li.x + li.y * max(dot(fn, normalize(lp - fp)), 0.0), c.a);
    #endif

    #ifndef LIGHTS
      frag_color = c;
    #endif
  }
`;
