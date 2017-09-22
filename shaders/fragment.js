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

    #if defined(TEXTURE) || defined(NORMAL_MAP)
      in vec2 v_t; // texture coordinates
    #endif

    #ifdef TEXTURE
      uniform sampler2D u_t;
    #endif

    #ifdef NORMAL_MAP
      uniform sampler2D n_m;
    #endif

    out vec4 frag_color;

    void main()
    {
      #ifdef LIGHTS
        #ifdef TEXTURE
          vec4 p_c = texture(u_t, v_t);
        #else
          vec4 p_c = c;
        #endif

        #ifdef NORMAL_MAP
          vec3 n = normalize(texture(n_m, v_t).rgb * -2.0 + 1.0);
        #else
          vec3 n = fn;
        #endif
        vec4 light = vec4(0.0, 0.0, 0.0, 1.0);
        for (int i = 0; i < al; i++) {
          light += vec4(p_c.rgb * li[i].x + li[i].y * max(dot(n, normalize(lp[i] - fp)) * lc[i], 0.0), p_c.a);
        }

        frag_color = light;
      #else
        #ifdef TEXTURE
          frag_color = texture(u_t, v_t);
        #else
          frag_color = c;
        #endif
      #endif
    }
  `;
}
