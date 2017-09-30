// Variables used by Vertex shader
//
// mat4 p; //projection
// mat4 v; //view
// mat4 w; // world
// vec3 P_current; // current frame vertex position
// float frame_delta;
// vec3 P_next; // next frame vertex position
// vec3 N_next; // next frame normal
// vec3 N_current; // current frame normal
// vec3 fn; // output normal
// vec2 a_t; // texture coordinates
// vec2 v_t; // texture coordinates output

export function vertex(defines) {
  return `#version 300 es

    ${defines.map(def => `
      #define ${def}
    `).join('')}

    precision mediump float;

    uniform mat4 p;
    uniform mat4 v;
    uniform mat4 w;

    in vec3 P_current;

    #ifdef MORPH
      uniform float frame_delta;
      in vec3 P_next;
      in vec3 N_next;
    #endif

    #ifdef LIGHTS
      in vec3 N_current;
      out vec3 fn;
    #endif

    #if defined(TEXTURE) || defined(NORMAL_MAP)
      in vec2 a_t;
      out vec2 v_t;
    #endif

    out vec3 fp;

    void main()
    {

      #ifdef MORPH
        float next_frame_delta = 1.0 - frame_delta;
        fp = (w * vec4(P_next * next_frame_delta + P_current * frame_delta, 1.0)).xyz;

        #ifdef LIGHTS
          fn = (w * vec4(N_current * N_next, 0.0)).xyz;
        #endif
      #else
        fp = (w * vec4(P_current, 1.0)).xyz;

        #ifdef LIGHTS
          fn = (w * vec4(N_current, 0.0)).xyz;
        #endif
      #endif

      gl_Position = p * v * vec4(fp, 1.0);

      #if defined(TEXTURE) || defined(NORMAL_MAP)
        v_t = a_t;
      #endif
    }
  `;
}
