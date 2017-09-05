import { get_scaling } from '../math/mat4';

export async function model_loader(url) {
  const meshes = [];
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Model loader error: ' + response.statusText);
  }

  const data = await response.json();

  for (const child of data.rootnode.children) {
    if (!child.meshes) {
      throw new Error('Meshes not found.');
    }

    for (const mesh of child.meshes) {
      meshes.push({
        vertices: data.meshes[mesh].vertices,
        indices: [].concat(...data.meshes[mesh].faces),
        normals: data.meshes[mesh].normals,
        scale: get_scaling([], child.transformation),
        position: [
          child.transformation[3],
          child.transformation[7],
          child.transformation[11]
        ]
      });
    }
  }

  return meshes;
}
