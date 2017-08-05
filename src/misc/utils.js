const obj_to_vec = (obj) => [obj.x, obj.y, obj.z];

const hex_to_vec = (hex) => {
  if (hex.charAt(0) === '#') {
    hex = hex.substr(1);
  }

  if (hex.length === 3) {
    hex = hex.split('').map((el) => {
      return el + '' +  el;
    });
  }

  return hex.match(/.{1,2}/g).map((el) => {
    return parseFloat((parseInt(el, 16) / 255).toFixed(1));
  });
};

export { obj_to_vec, hex_to_vec }
