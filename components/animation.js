import { Component } from '../core';
import { create_index_buffer } from '../core';

import * as mat4 from '../math/mat4'
import { Render } from './render';

const default_options = {
  skin_indices: [],
  skin_weights: [],
  bones: [],
  frames: []

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

  get_next_frame() {

  }

  update() {

  }
}
