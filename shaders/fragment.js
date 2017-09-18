export function fragment(defines) {
  return `#version 300 es

    ${defines.map(def => `
      #define ${def}
    `).join('')}

    precision mediump float;

    uniform vec4 c; // color

    in vec3 fp; // vertex position

    #ifdef LIGHTS
      #define MAX_LIGHTS 25

      uniform vec3[MAX_LIGHTS] lp; // light position
      uniform vec2[MAX_LIGHTS] li; // light intensity
      uniform vec3[MAX_LIGHTS] lc; // light color
      uniform int al; // active lights

      in vec3 fn; // vertex normals
   #endif

    out vec4 frag_color;

    void main()
    {
      #ifdef LIGHTS
        vec4 light = vec4(0.0, 0.0, 0.0, 1.0);
        for (int i = 0; i < al; i++) {
          light += vec4(c.rgb * li[i].x + li[i].y * max(dot(fn, normalize(lp[i] - fp)) * lc[i], 0.0), c.a);
        }

        frag_color = light;
      #endif

      #ifndef LIGHTS
        frag_color = c;
      #endif
    }
  `;
}
