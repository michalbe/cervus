export function fragment(defines) {
  return `#version 300 es

    ${defines.map(def => `
      #define ${def}
    `).join('')}

    precision mediump float;

    uniform vec4 c; // color

    in vec3 fp; // vertex position

    #ifdef LIGHTS
      #define MAX_LIGHTS 100

      uniform vec3[MAX_LIGHTS] lp; // light position
      uniform vec2[MAX_LIGHTS] li; // light intensity
      uniform vec3[MAX_LIGHTS] lc; // light color
      uniform int al; // active lights

      in vec3 fn; // vertex normals
    #endif

    #ifdef TEXTURE
      in vec2 v_t; // texture coordinates
      uniform sampler2D u_t;
    #endif

    out vec4 frag_color;

    void main()
    {
      #ifdef LIGHTS
        #ifdef TEXTURE
          vec4 p_c = texture(u_t, v_t);
        #endif
        #ifndef TEXTURE
          vec4 p_c = c;
        #endif
        vec4 light = vec4(0.0, 0.0, 0.0, 1.0);
        for (int i = 0; i < al; i++) {
          light += vec4(p_c.rgb * li[i].x + li[i].y * max(dot(fn, normalize(lp[i] - fp)) * lc[i], 0.0), p_c.a);
        }

        frag_color = light;
      #endif

      #ifndef LIGHTS
        #ifdef TEXTURE
          frag_color = texture(u_t, v_t);
        #endif

        #ifndef TEXTURE
          frag_color = c;
        #endif
      #endif
    }
  `;
}
