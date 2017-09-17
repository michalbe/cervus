export function vertex(defines) {
  return `#version 300 es

    ${defines.map(def => `
      #define ${def}
    `).join('')}

    precision mediump float;

    uniform mat4 p; //projection
    uniform mat4 v; //view
    uniform mat4 w; // world

    in vec3 P_current; // current vertex position

    #ifdef MORPH
      uniform float frame_delta;
      in vec3 P_next; // next vertex position
      in vec3 N_next; // next normal
    #endif

    #ifdef LIGHTS
      in vec3 N_current; // next normal
      out vec3 fn; // output normal
    #endif

    out vec3 fp; // output vertex position

    void main()
    {

      #ifdef MORPH
        float next_frame_delta = 1.0 - frame_delta;
        fp = (w * vec4(P_next * next_frame_delta + P_current * frame_delta, 1.0)).xyz;

        #ifdef LIGHTS
          fn = (w * vec4(N_next * next_frame_delta + N_current * frame_delta, 0.0)).xyz;
        #endif
      #endif

      #ifndef MORPH
        fp = (w * vec4(P_current, 1.0)).xyz;

        #ifdef LIGHTS
          fn = (w * vec4(N_current, 0.0)).xyz;
        #endif
      #endif

      gl_Position = p * v * vec4(fp, 1.0);
    }
  `;
}
