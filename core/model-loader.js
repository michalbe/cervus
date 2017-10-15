import { get_scaling, get_rotation } from '../math/mat4';

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

  function find_bone_index(bones, name) {
    return bones.findIndex((bone) => {
      return bone.name === name;
    });
  }

  function traverse(node, parent_id, output) {
    parent_id = output.push({
      name: node.name,
      parent: parent_id,
      position: [
        node.transformation[3],
        node.transformation[11],
        -node.transformation[7]
      ],
      scale: get_scaling([], node.transformation),
      rotation: get_rotation([], node.transformation)
    });
    parent_id--;
    // action(parent_id, output);
    if (node.children) {
      node.children.forEach((child) => {
        traverse(child, parent_id, output);
      });
    }
  }

  function parse_model(json) {
    const meshes = [];
    const bones = [];
    let skinIndices, skinWeights;

    console.log(json);
    for (const animation of json.animations) {
      animation.channels.forEach((channel) => {
        // console.log(channel.positionkeys);
      });
    }

    for (const child of json.rootnode.children) {
      if (!child.meshes) {
        if (child.name && Array.isArray(child.children)) {

          let parent_id = -1;

          traverse(child, parent_id, bones);
          // console.log(bones);
          continue;
        } else {
          console.warn("Model doesn't contain any mesh (is it Camera?)");
          continue;
        }
      }

      for (const mesh of child.meshes) {
        const mesh_data = json.meshes[mesh];
        const final_data = {
          vertices: mesh_data.vertices,
          indices: [].concat(...mesh_data.faces),
          normals: mesh_data.normals,
          scale: get_scaling([], child.transformation),
          position: [
            child.transformation[3],
            child.transformation[11],
            -child.transformation[7]
          ],
          uvs:  mesh_data.texturecoords[0]
        };

        skinIndices = Array(final_data.vertices.length/3*2).fill(0);
        skinWeights = Array(final_data.vertices.length/3*2).fill(0);

        if (mesh_data.bones && bones) {
          for (const bone of mesh_data.bones) {
            // console.log(bone);
            const bone_index = find_bone_index(bones, bone.name);
            bones[bone_index].offset_matrix = bone.offsetmatrix;
            bone.weights.forEach((weight) => {
              // if (skinWeights.indexOf(weight[0]) > -1) {
              //   console.log(weight[0], ' jest!');
              // } else {
              //   skinWeights.push(weight[0]);
              // }
              const verticle = weight[0] * 2;
              weight = weight[1];

              if (!skinWeights[verticle]) {
                skinWeights[verticle] = weight;
              } else if (!skinWeights[verticle + 1]) {
                skinWeights[verticle + 1] = weight;
              } else {
                // console.log('skipping next bone');
              }

              if (!skinIndices[verticle]) {
                skinIndices[verticle] = bone_index;
              } else if (!skinIndices[verticle + 1]) {
                skinIndices[verticle + 1] = bone_index;
              } else {
                // console.log('skipping next bone');
              }
            });
          }
        }

        meshes.push(final_data);
      }
    }

    if (!meshes.length) {
      throw new Error('Meshes not found.');
    }

    return {
      meshes,
      bones,
      skinIndices,
      skinWeights
    };
  }

  return Promise.all(urls.map(url => {
    return fetch(url)
      .then(validate_response)
      .then(parse_model)
  }));
}
