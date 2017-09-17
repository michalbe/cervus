import { gl } from '../core/context';
import { BasicMaterial } from './basic';

export class WireframeMaterial extends BasicMaterial {
  constructor(options) {
    super(options);

    this.draw_mode = gl.LINE_STRIP;

  }
}
