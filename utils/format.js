function zeros(n) {
  let zero = '';
  let newN = n;
  newN = n.toString();
  if (newN.length < 2) {
    for (let i = 0; i < 2 - newN.length; i += 1) {
      zero += '0';
    }
  }
  return zero + newN;
}

function numberFormat(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default {
  numberFormat,
  zeros,
};
