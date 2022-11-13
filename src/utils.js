const httpError = (h, message) => {
  const response = h.response({
    status: 'fail',
    message,
  });
  response.code(400);
  return response;
};

const bsValidator = (object, validator) => {
  const myMap = Object.entries(object)
  const keys = Object.entries(validator).reverse()
  let message = null;
  keys.map((e) => {
    const obj = myMap.filter((m) => m[0] === e[0])
    // console.log(obj, e)
    if (obj.length === 0) {
      [, message] = e
      return e
    }
    console.log(obj)
    if (obj[0][1] === undefined) {
      [, message] = e
    }
    return e;
  });
  return message
}

module.exports = { httpError, bsValidator }
