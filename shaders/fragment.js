//
// Variables used by fragment shader
//
// vec4 c; // color
// vec3 fp; // vertex position
// vec3[MAX_LIGHTS] lp; // light position
// vec2[MAX_LIGHTS] li; // light intensity
// vec3[MAX_LIGHTS] lc; // light color
// int al; // active lights
// vec3 fn; // vertex normals
// vec2 v_t; // texture coordinates
// sampler2D u_t; //texture
// sampler2D n_m; // normal map

export function fragment(defines) {
  return `#version 300 es

    ${defines.map(def => `
      #define ${def}
    `).join('')}

    precision mediump float;

    uniform vec4 c;

    in vec3 fp;

    #ifdef LIGHTS
      #define MAX_LIGHTS 100

      uniform vec3[MAX_LIGHTS] lp;
      uniform vec2[MAX_LIGHTS] li;
      uniform vec3[MAX_LIGHTS] lc;
      uniform int al;

      in vec3 fn;
    #endif

    #if defined(TEXTURE) || defined(NORMAL_MAP)
      in vec2 v_t;
    #endif

    #ifdef TEXTURE
      uniform sampler2D u_t;
    #endif

    #ifdef NORMAL_MAP
      uniform sampler2D n_m;
    #endif

    #ifdef FOG
      uniform vec3 fog_color;
      uniform vec2 fog_distance;
      in float f_distance;
    #endif

    out vec4 frag_color;

    void main()
    {
      #ifdef FOG
        float fog_factor = clamp((fog_distance.y - f_distance) / (fog_distance.y - fog_distance.x), 0.0, 1.0);
      #endif

      #ifdef LIGHTS
        #ifdef TEXTURE
          vec4 p_c = texture(u_t, v_t);
        #else
          vec4 p_c = c;
        #endif

        #ifdef NORMAL_MAP
          vec3 Q1 = dFdx(fp);
          vec3 Q2 = dFdy(fp);

          vec2 st1 = dFdx(v_t);
          vec2 st2 = dFdy(v_t);

          vec3 tangent = normalize(Q1 * st2.t - Q2 * st1.t);
          vec3 bitangent = normalize(-Q1 * st2.s + Q2 * st1.s);

          mat3 TBN = mat3(tangent, bitangent, fn);

          vec3 n = normalize(texture(n_m, v_t).rgb * 2.0 - 1.0) * TBN;
        #else
          vec3 n = fn;
        #endif

        vec4 light = vec4(0.0, 0.0, 0.0, 1.0);
        for (int i = 0; i < al; i++) {
          light += vec4(p_c.rgb * li[i].x + li[i].y * max(dot(n, normalize(lp[i] - fp)) * lc[i], 0.0), p_c.a);
        }

        #ifdef FOG
          frag_color = mix(vec4(fog_color, 1.0), light, fog_factor);
        #else
          frag_color = light;
        #endif
      #else
        #ifdef TEXTURE
            #ifdef FOG
              frag_color = mix(vec4(fog_color, 1.0), texture(u_t, v_t), fog_factor);
            #else
              frag_color = texture(u_t, v_t);
            #endif
        #else
          #ifdef FOG
            frag_color = mix(vec4(fog_color, 1.0), c, fog_factor);
          #else
            frag_color = c;
          #endif
        #endif
      #endif
    }
  `;
}
