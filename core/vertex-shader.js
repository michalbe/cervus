export const vertex = (defines) =>
  `#version 300 es

  ${defines.map(def => `
    #define ${def}
  `).join('')}

  precision mediump float;

  uniform mat4 projection;
  uniform mat4 view;
  uniform mat4 world;

  #ifdef MORPH
    uniform float frame_delta;
    uniform float do_morph;
    in vec3 position_next;
    in vec3 normal_next;
  #endif

  in vec3 position;

  #ifdef LIGHTS
    in vec3 normal;
    out vec3 out_normal;
  #endif

  out vec3 out_position;

  void main()
  {

    #ifdef MORPH
      float next_frame_delta = 1.0 - frame_delta;
      out_position = (world * vec4(position_next * next_frame_delta + position * frame_delta, 1.0)).xyz;
      out_normal = (world * vec4(normal_next * next_frame_delta + normal * frame_delta, 0.0)).xyz;
    #endif

    #ifndef MORPH
      out_position = (world * vec4(position, 1.0)).xyz;
      out_normal = (world * vec4(normal, 0.0)).xyz;
    #endif

    gl_position = projection * view * vec4(out_position, 1.0);
  }
`;
