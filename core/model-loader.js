import { get_scaling } from '../math/mat4';

export function model_loader(urls) {
  if (!Array.isArray(urls)) {
    urls = [urls];
  }

  function validate_response(data) {
    if (!data.ok) {
      throw new Error('Model loader error: ' + data.statusText);
    }

    return data.json();
  }

  function parse_model(json) {
    const meshes = [];

    for (const child of json.rootnode.children) {
      if (!child.meshes) {
        console.warn("Model doesn't contain any mesh (is it Camera?)");
        continue;
      }

      for (const mesh of child.meshes) {
        meshes.push({
          vertices: json.meshes[mesh].vertices,
          indices: [].concat(...json.meshes[mesh].faces),
          normals: json.meshes[mesh].normals,
          scale: get_scaling([], child.transformation),
          position: [
            child.transformation[3],
            child.transformation[11],
            -child.transformation[7]
          ],
          uvs:  json.meshes[mesh].texturecoords[0]
        });
      }
    }

    if (!meshes.length) {
      throw new Error('Meshes not found.');
    }

    return meshes;
  }

  return Promise.all(urls.map(url => {
    return fetch(url)
      .then(validate_response)
      .then(parse_model)
  }));
}
