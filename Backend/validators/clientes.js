'use strict';


const {errorResponse} = require('../libs/response');
const {validateCNPJ, validateCPF} = require('../libs/utilities');


exports.validaCadastroContaJuridica = body => {
  const bodyStruct = {};
  
  const arr = ['ativa', 'bloqueada', 'tipo', 'nome', 'apelido', 'cnpj', 'inscricaoEstadual',  'enderecoLogradouro','enderecoNumero', 'enderecoComplemento', 'enderecoBairro', 
  'enderecoCidade', 'enderecoEstado', 'enderecoPais', 'enderecoCep', 'observacoes', 'vendedorPadrao' ];

if (body.cnpj) {

  if (!validateCNPJ(body.cnpj)) {
    throw errorResponse(401, 'CNPJ INVÁLIDO');
  }
}

  arr.map((item) => {
    const check = body.hasOwnProperty(item);
    if (!check) throw errorResponse(400, item+'Missing');
    bodyStruct[item] = body[item]
  });

  return bodyStruct;
};



exports.validaCadastroContaFisica = body => {
    const bodyStruct = {};
  
    const arr = ['ativa', 'bloqueada', 'tipo', 'nome', 'apelido', 'cpf', 'rg',
  'enderecoNumero', 'enderecoComplemento', 'enderecoBairro', 'enderecoCidade', 'enderecoEstado', 'enderecoPais', 
  'enderecoCep',  'observacoes', 'vendedorPadrao' ];
  if (body.cpf) {
 
  if (!validateCPF(body.cpf)) {
    throw errorResponse(401, 'CPF INVÁLIDO');
  }
  }
  
    arr.map((item) => {
      const check = body.hasOwnProperty(item);
      if (!check) throw errorResponse(400, item+'Missing');
      bodyStruct[item] = body[item]
    });
  
    return bodyStruct;
  };

  exports.validateVendedores = body => {
    const bodyStruct = {};
    
    const arr = ['email' ];
  
    arr.map((item) => {
      const check = body.hasOwnProperty(item);
      if (!check) throw errorResponse(400, item+'Missing');
      bodyStruct[item] = body[item]
    });
  
    return bodyStruct;
  };
  
  