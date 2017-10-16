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

    #ifdef ANIMATION
      uniform mat4 uBones[60];
      in highp vec2 sWeights;
      in highp vec2 sIndices;

      mat4 boneTransform() {
        mat4 ret;

        // Weight normalization factor
        float normfac = 1.0 / (sWeights.x + sWeights.y);

        // Weight1 * Bone1 + Weight2 * Bone2
        ret = normfac * sWeights.y * uBones[int(sIndices.y)]
            + normfac * sWeights.x * uBones[int(sIndices.x)];

        return ret;
      }
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

      #ifdef ANIMATION
      mat4 bt = (length(sWeights) > 0.5)?
        boneTransform()
        :
        mat4(
            1., 0., 0., 0.,
            0., 1., 0., 0.,
            0., 0., 1., 0.,
            0., 0., 0., 1.
        );

        gl_Position = p * v * w * bt * vec4(P_current, 1.0);
      #else
        gl_Position = p * v * vec4(fp, 1.0);
      #endif

      #if defined(TEXTURE) || defined(NORMAL_MAP)
        v_t = a_t;
      #endif
    }
  `;
}
