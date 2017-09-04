import { get_scaling } from '../math/mat4';

export const model_loader = (url) => new Promise((resolve, reject) => {
  const meshes = [];
  fetch(url)
  .then((data) => {
    // if (!data) {
    //   return reject('File not found');
    // }
    return data.json();
  })
  .then((json) => {
    json.rootnode.children.forEach(child => {
      if (!child.meshes) {
        reject('Meshes not found.');
        return;
      }

      child.meshes.forEach((mesh) => {
        meshes.push({
          vertices: json.meshes[mesh].vertices,
          indices: [].concat(...json.meshes[mesh].faces),
          normals: json.meshes[mesh].normals,
          scale: get_scaling([], child.transformation),
          position: [
            child.transformation[3],
            child.transformation[7],
            child.transformation[11]
          ]
        });
      });
      resolve(meshes);
    });
  });
});
