import { Game } from './core/game.js';
import { Entity } from './core/entity.js';
import { Group } from './core/group.js';
import { shapes } from './shapes/shapes.js';
import { vec3, mat4, glMatrix } from 'gl-matrix';

const math = {
  vec3,
  mat4,
  glMatrix
};

export {
  Game,
  Entity,
  Group,
  shapes,
  math
}
