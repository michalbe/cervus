import * as _Goblin from 'goblinphysics';

const Goblin = _Goblin.default;

export function World() {
  return new Goblin.World(
    new Goblin.SAPBroadphase(),
    new Goblin.NarrowPhase(),
    new Goblin.IterativeSolver()
  );
}

export function Body(shape, mass) {
  return new Goblin.RigidBody(shape, mass);
}

export const colliders = {
  box: function(scale) {
    return new Goblin.BoxShape(
      scale[0]/2,
      scale[1]/2,
      scale[2]/2
    );
  },

  plane: function(scale, orientation = 1) {
    return new Goblin.PlaneShape(
      orientation,
      scale[0],
      scale[2]
    );
  }
}
