
exports.validaSendMail = body => {
    const bodyStruct = {};
    
    const arr = ['usuario','emails','url','tipo','assunto','descricao'];
  
    arr.map((item) => {
      const check = body.hasOwnProperty(item);
      if (!check) throw errorResponse(400, item+'Missing');
      bodyStruct[item] = body[item]
    });
  
    return bodyStruct;
  };