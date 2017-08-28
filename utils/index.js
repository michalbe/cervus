export function hex_to_vec(hex) {
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
}

export function vec_to_hex(vec) {
  return vec.reduce((sum, value) => {
    let val = (~~(value * 255)).toString(16);

    if (val.length === 1) {
      val = '0' + val;
    }

    return sum + val;
  }, '#');
}
