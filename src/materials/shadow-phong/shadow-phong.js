import { vertex_code, fragment_code } from './shader.js';
import { generator_vertex_code, generator_fragment_code } from './map-shader.js';
import { create_program_object, create_shader_object, gl } from '../../core/context.js';
import { vec3, mat4, vec2, glMatrix } from 'gl-matrix';
import { Camera } from '../../core/camera.js';

class ShadowPhong {

  constructor() {
    window.lightPosition = this.lightPosition = [6, 1, 5];
    this.textureSize = 2048;

    window.shadow_program = this.program = create_program_object(
      create_shader_object(gl.VERTEX_SHADER, vertex_code),
      create_shader_object(gl.FRAGMENT_SHADER, fragment_code)
    );

    if (this.program.error) {
      console.log(this.program.error); return;
    }

    window.map_program = this.map_program = create_program_object(
      create_shader_object(gl.VERTEX_SHADER, generator_vertex_code),
      create_shader_object(gl.FRAGMENT_SHADER, generator_fragment_code)
    );

    if (this.map_program.error) {
      console.log(this.map_program.error); return;
    }

    this.uniforms = {
      mProj: gl.getUniformLocation(this.program, 'mProj'),
      mView: gl.getUniformLocation(this.program, 'mView'),
      mWorld: gl.getUniformLocation(this.program, 'mWorld'),

      pointLightPosition: gl.getUniformLocation(this.program, 'pointLightPosition'),
      meshColor: gl.getUniformLocation(this.program, 'meshColor'),
      lightShadowMap: gl.getUniformLocation(this.program, 'lightShadowMap'),
      shadowClipNearFar: gl.getUniformLocation(this.program, 'shadowClipNearFar')
    };

    this.attribs = {
      vPos: gl.getAttribLocation(this.program, 'vPos'),
      vNorm: gl.getAttribLocation(this.program, 'vNorm'),
    };

    this.map_uniforms = {
      mProj: gl.getUniformLocation(this.map_program, 'mProj'),
      mView: gl.getUniformLocation(this.map_program, 'mView'),
      mWorld: gl.getUniformLocation(this.map_program, 'mWorld'),

      pointLightPosition: gl.getUniformLocation(this.map_program, 'pointLightPosition'),
      shadowClipNearFar: gl.getUniformLocation(this.map_program, 'shadowClipNearFar')
    };

    this.map_attribs = {
      vPos: gl.getAttribLocation(this.map_program, 'vPos')
    };

    this.shadowMapCube = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.shadowMapCube);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    // gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
    // gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    for (var i = 0; i < 6; i++) {
      gl.texImage2D(
        gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,
        0, gl.RGBA,
        this.textureSize, this.textureSize,
        0, gl.RGBA,
        gl.UNSIGNED_BYTE, null
      );
    }

    this.shadowMapFramebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.shadowMapFramebuffer);

    this.shadowMapRenderbuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.shadowMapRenderbuffer);
    gl.renderbufferStorage(
      gl.RENDERBUFFER, gl.DEPTH_COMPONENT16,
      this.textureSize, this.textureSize
    );

    // gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    // gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    // gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    this.shadowMapCameras = [
      // Positive X
      new Camera(
        this.lightPosition,
        vec3.add(vec3.create(), this.lightPosition, vec3.fromValues(1, 0, 0)),
        vec3.fromValues(0, -1, 0)
      ),
      // Negative X
      new Camera(
        this.lightPosition,
        vec3.add(vec3.create(), this.lightPosition, vec3.fromValues(-1, 0, 0)),
        vec3.fromValues(0, -1, 0)
      ),
      // Positive Y
      new Camera(
        this.lightPosition,
        vec3.add(vec3.create(), this.lightPosition, vec3.fromValues(0, 1, 0)),
        vec3.fromValues(0, 0, 1)
      ),
      // Negative Y
      new Camera(
        this.lightPosition,
        vec3.add(vec3.create(), this.lightPosition, vec3.fromValues(0, -1, 0)),
        vec3.fromValues(0, 0, -1)
      ),
      // Positive Z
      new Camera(
        this.lightPosition,
        vec3.add(vec3.create(), this.lightPosition, vec3.fromValues(0, 0, 1)),
        vec3.fromValues(0, -1, 0)
      ),
      // Negative Z
      new Camera(
        this.lightPosition,
        vec3.add(vec3.create(), this.lightPosition, vec3.fromValues(0, 0, -1)),
        vec3.fromValues(0, -1, 0)
      )
    ];

    this.shadowMapViewMatrices = [
      mat4.create(),
      mat4.create(),
      mat4.create(),
      mat4.create(),
      mat4.create(),
      mat4.create()
    ];
    this.shadowMapProj = mat4.create();
    this.shadowClipNearFar = vec2.fromValues(0.05, 15.0);
    mat4.perspective(
      this.shadowMapProj,
      glMatrix.toRadian(90),
      1.0,
      this.shadowClipNearFar[0],
      this.shadowClipNearFar[1]
    );

  }

  generate_shadow_map(entity) {
    // for (var i = 0; i < this.shadowMapCameras.length; i++) {
    //   mat4.getTranslation(this.shadowMapCameras[i].position, this.lightPosition);
    //   this.shadowMapCameras[i].get_matrix(this.shadowMapViewMatrices[i]);
    // }
    this.lightPosition = window.lightPosition;

    this.shadowMapCameras = [
      // Positive X
      new Camera(
        this.lightPosition,
        vec3.add(vec3.create(), this.lightPosition, vec3.fromValues(1, 0, 0)),
        vec3.fromValues(0, -1, 0)
      ),
      // Negative X
      new Camera(
        this.lightPosition,
        vec3.add(vec3.create(), this.lightPosition, vec3.fromValues(-1, 0, 0)),
        vec3.fromValues(0, -1, 0)
      ),
      // Positive Y
      new Camera(
        this.lightPosition,
        vec3.add(vec3.create(), this.lightPosition, vec3.fromValues(0, 1, 0)),
        vec3.fromValues(0, 0, 1)
      ),
      // Negative Y
      new Camera(
        this.lightPosition,
        vec3.add(vec3.create(), this.lightPosition, vec3.fromValues(0, -1, 0)),
        vec3.fromValues(0, 0, -1)
      ),
      // Positive Z
      new Camera(
        this.lightPosition,
        vec3.add(vec3.create(), this.lightPosition, vec3.fromValues(0, 0, 1)),
        vec3.fromValues(0, -1, 0)
      ),
      // Negative Z
      new Camera(
        this.lightPosition,
        vec3.add(vec3.create(), this.lightPosition, vec3.fromValues(0, 0, -1)),
        vec3.fromValues(0, -1, 0)
      )
    ];

    // Set GL state status
    gl.useProgram(this.map_program);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.shadowMapCube);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.shadowMapFramebuffer);
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.shadowMapRenderbuffer);

    gl.viewport(0, 0, this.textureSize, this.textureSize);
    // gl.enable(gl.DEPTH_TEST);
    // gl.enable(gl.CULL_FACE);

    // Set per-frame uniforms
    gl.uniform2fv(
      this.map_uniforms.shadowClipNearFar,
      this.shadowClipNearFar
    );
    gl.uniform3fv(
      this.map_uniforms.pointLightPosition,
      this.lightPosition
    );
    gl.uniformMatrix4fv(
      this.map_uniforms.mProj,
      gl.FALSE,
      this.shadowMapProj
    );

    for (var i = 0; i < this.shadowMapCameras.length; i++) {
      // Set per light uniforms
      gl.uniformMatrix4fv(
        this.map_uniforms.mView,
        gl.FALSE,
        this.shadowMapCameras[i].get_matrix(this.shadowMapViewMatrices[i])
      );

      // Set framebuffer destination
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,
        this.shadowMapCube,
        0
      );

      gl.framebufferRenderbuffer(
        gl.FRAMEBUFFER,
        gl.DEPTH_ATTACHMENT,
        gl.RENDERBUFFER,
        this.shadowMapRenderbuffer
      );

      // gl.clearColor(0, 0, 0, 1);
      // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // Per object uniforms
      gl.uniformMatrix4fv(
        this.map_uniforms.mWorld,
        gl.FALSE,
        entity.world_matrix
      );

      // Set attributes
      gl.bindBuffer(gl.ARRAY_BUFFER, entity.buffers.vertices);
      gl.vertexAttribPointer(
        this.map_attribs.vPos,
        3, gl.FLOAT, gl.FALSE,
        0, 0
      );
      gl.enableVertexAttribArray(this.map_attribs.vPos);

      // gl.bindBuffer(gl.ARRAY_BUFFER, null);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, entity.buffers.indices);
      gl.drawElements(gl.TRIANGLES, entity.buffers.qty, gl.UNSIGNED_SHORT, 0);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

  }

  render(entity) {
    // Clear back buffer, set per-frame uniforms
    // gl.enable(gl.CULL_FACE);
    // gl.enable(gl.DEPTH_TEST);

    // gl.clearColor(0, 0, 0, 1);
    // gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    gl.useProgram(this.program);

    // gl.clearColor(0, 0, 0, 1);

    gl.uniformMatrix4fv(this.uniforms.mProj, gl.FALSE, entity.game.projMatrix);
    gl.uniformMatrix4fv(this.uniforms.mView, gl.FALSE, entity.game.viewMatrix);
    gl.uniform3fv(this.uniforms.pointLightPosition, this.lightPosition);
    gl.uniform2fv(this.uniforms.shadowClipNearFar, this.shadowClipNearFar);
    gl.uniform1i(this.uniforms.lightShadowMap, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.shadowMapCube);

    gl.uniformMatrix4fv(
      this.uniforms.mWorld,
      gl.FALSE,
      entity.world_matrix
    );
    gl.uniform4fv(
      this.uniforms.meshColor,
      entity.color_vec
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, entity.buffers.vertices);
    gl.vertexAttribPointer(
      this.attribs.vPos,
      3, gl.FLOAT, gl.FALSE,
      0, 0
    );
    gl.enableVertexAttribArray(this.attribs.vPos);

    gl.bindBuffer(gl.ARRAY_BUFFER, entity.buffers.normals);
    gl.vertexAttribPointer(

      this.attribs.vNorm,
      3, gl.FLOAT, gl.FALSE,
      0, 0
    );

    gl.enableVertexAttribArray(this.attribs.vNorm);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, entity.buffers.indices);
    gl.drawElements(gl.TRIANGLES, entity.buffers.qty, gl.UNSIGNED_SHORT, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }
}

export { ShadowPhong };
