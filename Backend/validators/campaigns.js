'use strict';

const { errorResponse } = require('../libs/response');

exports.validaCadastroCampaigns = (body) => {
  const bodyStruct = {};

  // Campos obrigatórios para cadastrar campanha
  const arr = [
    'nome',
    'inicio',
    'fim',
      ];

  arr.map((item) => {
    const check = body.hasOwnProperty(item);
    if (!check) throw errorResponse(400, item + 'Missing');
    bodyStruct[item] = body[item];
  });

  // Validação simples de datas (ex.: não permitir fim antes do início)
  if (body.inicio && body.fim) {
    const inicio = new Date(body.inicio);
    const fim = new Date(body.fim);

    if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
      throw errorResponse(401, 'Data inválida');
    }

    if (fim < inicio) {
      throw errorResponse(401, 'Data fim não pode ser anterior à data início');
    }
  }

  return bodyStruct;
};
