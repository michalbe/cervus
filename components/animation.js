import { Component } from '../core';
import { create_index_buffer } from '../core';

import * as mat4 from '../math/mat4';
import * as quat from '../math/quat';
import * as vec3 from '../math/vec3';

import { Render } from './render';

const default_options = {
  skin_indices: [],
  skin_weights: [],
  bones: [],
  frames: [],
  current_frame: 0,
  current_lerp: 0
}

export class Animation extends Component {
  constructor(options) {
    super(options);
    Object.assign(this,  default_options, options);

    if(this.bones && this.bones.length) {
      this.calculate_bones_matrices();
    }
  }

  static get features() {
    return ['ANIMATION'];
  }

  calculate_bones_matrices() {
    this.bones.forEach(bone => {
      const localMatrix = mat4.create();

      // ... calculate the local matrix...
      mat4.compose(localMatrix, bone.rotation, bone.position, bone.scale);

      bone.worldMatrix = mat4.create();
      bone.localMatrix = mat4.create();
      bone.inverseBindpose = mat4.create();

      mat4.copy(bone.localMatrix, localMatrix)

      // ... set it as the world matrix if it is a root bone
      if(bone.parent == -1) {
        mat4.copy(bone.worldMatrix, localMatrix)
      } else { // ... or multiply it with its parent's world matrix if it is not.
        mat4.multiply(bone.worldMatrix, this.bones[bone.parent].worldMatrix, localMatrix)
      }
      // Finally, invert the worldMatrix and save it for later
      mat4.invert(bone.inverseBindpose, bone.worldMatrix);
    });

  }

  create_buffers() {
    this.number_of_frames = this.frames.length;
    this.entity.get_component(Render).buffers.skin_indices = create_index_buffer(this.skin_indices);
    this.entity.get_component(Render).buffers.skin_weights = create_index_buffer(this.skin_weights);
  }

  get_frame() {
    const frame_matrix = [];
    while (this.current_lerp > 1) {
      this.current_lerp -= 1.0;
      this.current_frame++;
    }

    const previous_frame  = this.frames[this.current_frame % this.frames.length];
    const next_frame = this.frames[(this.current_frame + 1) % this.frames.length];
    var pwms = [];

    previous_frame.forEach((bone, index) => {
      const next_bone = next_frame[index];
      const parent = this.bones[index].parent;
      const world_matrix = pwms[index] = mat4.create();
      const local_matrix = mat4.create();
      const offset_matrix = mat4.create();

      const quaternion = quat.create();
      const vector = vec3.of(0, 0, 0);

      //
      quat.slerp(quaternion, bone.rotation, next_bone.rotation, this.current_lerp);
      vec3.lerp(vector, bone.position, next_bone.position, this.current_lerp);

      // XXX: THIS SHOULD USE SCALE AS WELL
      mat4.frt(local_matrix, quaternion, vector);

      if(parent == -1) {
        mat4.copy(world_matrix, local_matrix);
      } else {
        mat4.multiply(world_matrix, pwms[parent], local_matrix);
      }

      mat4.multiply(offset_matrix, world_matrix, this.bones[index].inverseBindpose);

      frame_matrix.push.apply(frame_matrix, offset_matrix);
    });

    return new Float32Array(frame_matrix);
  }

  update() {
    this.current_lerp += 0.05;
  }
}
