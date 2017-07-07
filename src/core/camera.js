import { vec3, mat4 } from 'gl-matrix';

export class Camera {
  constructor(position, lookAt, up) {
    this.forward = vec3.create();
    this.up = vec3.create();
    this.right = vec3.create();

    this.position = position;

    vec3.subtract(this.forward, lookAt, this.position);
    vec3.cross(this.right, this.forward, up);
    vec3.cross(this.up, this.right, this.forward);

    vec3.normalize(this.forward, this.forward);
    vec3.normalize(this.right, this.right);
    vec3.normalize(this.up, this.up);
  }

  getViewMatrix (out) {
    const lookAt = vec3.create();
    vec3.add(lookAt, this.position, this.forward);
    mat4.lookAt(out, this.position, lookAt, this.up);
    return out;
  }

  rotateRight(rad) {
  const rightMatrix = mat4.create();
    mat4.rotate(rightMatrix, rightMatrix, rad, vec3.fromValues(0, 0, 1));
    vec3.transformMat4(this.forward, this.forward, rightMatrix);
    this.realign();
  }

  realign = function() {
    vec3.cross(this.right, this.forward, this.up);
    vec3.cross(this.up, this.right, this.forward);

    vec3.normalize(this.forward, this.forward);
    vec3.normalize(this.right, this.right);
    vec3.normalize(this.up, this.up);
  };

  moveForward(dist) {
    vec3.scaleAndAdd(this.position, this.position, this.forward, dist);
  }

  moveRight(dist) {
    vec3.scaleAndAdd(this.position, this.position, this.right, dist);
  }

  moveUp(dist) {
    vec3.scaleAndAdd(this.position, this.position, this.up, dist);
  }
}
