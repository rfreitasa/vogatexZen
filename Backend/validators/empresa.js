'use strict';


const {errorResponse} = require('../libs/response');

exports.validaCadastroEmpresa = body => {
  const bodyStruct = {};
  const arr = ['id_erp', 'nome', 'contrato_ini', 'contrato_fim', 'valor_mensal', 'obs', 'obs', 'cep',  'endereco',
'numero', 'complemento', 'bairro', 'cidade', 'email', 'contato', 'logo', 'organizacao_id', 'cnpj', 'estado',
'telefone', 'ativo' ];


  arr.map((item) => {
    const check = body.hasOwnProperty(item);
    if (!check) throw errorResponse(400, item+'Missing');
    bodyStruct[item] = body[item]
  });

  return bodyStruct;
};
