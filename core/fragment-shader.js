export const fragment = (defines) =>
  `#version 300 es
  
  ${defines.map(def => `
    #define ${def}
  `).join('')}

  precision mediump float;

  #ifdef LIGHTS
    uniform vec3 light_position;
    uniform vec2 light_intensity;

    in vec3 normal;
 #endif

  uniform vec4 color;

  in vec3 position;

  out vec4 frag_color;

  void main()
  {
    #ifdef LIGHTS
      frag_color = vec4(color.rgb * light_intensity.x + light_intensity.y * max(dot(normal, normalize(light_position - position)), 0.0), color.a);
    #endif

    #ifndef LIGHTS
      frag_color = c;
    #endif
  }
  `
;
