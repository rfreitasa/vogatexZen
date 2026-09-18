'use strict';


const {errorResponse} = require('../libs/response');


exports.validaTotFaturado = body => {
  const bodyStruct = {};
  
  const arr = ['email', 'periodo'];

  arr.map((item) => {
    const check = body.hasOwnProperty(item);
    if (!check) throw errorResponse(400, item+'Missing');
    bodyStruct[item] = body[item]
  });

  return bodyStruct;
};


