const db = require('../models/db');
const moment = require('moment');

// Criar campanha
exports.createCampaign = async (data) => {
  try {
    console.log(data)
    const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
    const query = db.write('CAMPANHAS').insert({
      CAMPANHA_NOME: data.nome || null,
      CAMPANHA_OBSERVACOES: data.observacoes || null,
      CAMPANHA_INICIO: data.inicio || null,
      CAMPANHA_FIM: data.fim || null,
      CAMPANHA_STATUS:  'Ativa',
      CAMPANHA_USUARIO_ID: data.criadoPor || null,
      CAMPANHA_META: data.valorEsperado || null,
      CAMPANHA_LIMITE_PEDIDO: data.limitePedido || null,
      CAMPANHA_LINHA_CREDITO: data.linhacredito || null,
      CAMPANHA_PEDIDOS_BLOQUEADOS: data.pedidosBloqueados || null,
      CAMPANHA_LOCAL: data.local || null,
      CREATED_AT: createdAt,
      UPDATED_AT: createdAt
    });

    console.info("query -->", query.toQuery())
    return query;
  } catch (error) {
    console.log(error);
    return "";
  }
}
// Buscar todas campanhas
exports.getCampaigns = async () => {
  try {
    const query = db.read.select('*')
      .from('CAMPANHAS');
    return query;
  } catch (error) {
    return "";
  }
}
exports.getCampaignsActive = async (id) => {
  try {
    const currentDate = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    
    const query = db.read.select('*')
      .from('CAMPANHAS')
      .where('CAMPANHA_STATUS', '=', 'Ativa')
      .andWhere('CAMPANHA_INICIO', '<=', currentDate) // Data início <= data atual
      .andWhere('CAMPANHA_FIM', '>=', currentDate); // Data fim >= data atual    
    return query;
  } catch (error) {
    console.error('Error fetching active campaign:', error);
    return [];
  }
}
// Buscar campanha por ID
exports.getCampaignById = async (id) => {
  try {
    const query = db.read.select('*')
      .from('CAMPANHAS')
      .where('CAMPANHA_ID', '=', id);
    return query;
  } catch (error) {
    return "";
  }
}

// Buscar campanha por nome
exports.getCampaignByName = async (nome) => {
  try {
    const query = db.read.select('*')
      .from('CAMPANHAS')
      .where('CAMPANHA_NOME', '=', nome);
    return query;
  } catch (error) {
    return "";
  }
}

// Atualizar campanha
exports.updateCampaign = async (id, data) => {
  try {

    console.log('vai alterar')
    console.log(data)
    data.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')
    const toBeUpdated = {}
    const canBeUpdated = [
      'CAMPANHA_NOME',
      'CAMPANHA_OBSERVACOES',
      'CAMPANHA_INICIO',
      'CAMPANHA_FIM',
      'CAMPANHA_META',
      'CAMPANHA_PEDIDOS_BLOQUEADOS',
      'CAMPANHA_LIMITE_PEDIDO',
      'CAMPANHA_LINHA_CREDITO',
      'CAMPANHA_LOCAL',
      'CAMPANHA_STATUS'
    ]

    for (let i in data) {
      if (canBeUpdated.indexOf(i) > -1 && data[i] !== '') {
        toBeUpdated[i] = data[i]
      }
    }

    const query = db.write('CAMPANHAS')
      .where('CAMPANHA_ID', id)
      .update(toBeUpdated)
      .finally(() => {})

    return 'ok'
  } catch (error) {
    console.log(error)
    return 'nok'
  }
}

// Deletar campanha
exports.deleteCampaign = async (id) => {
  try {
    await db.write('CAMPANHAS')
      .where('CAMPANHA_ID', id)
      .del()
    return 'ok'
  } catch (error) {
    console.log(error)
    return 'nok'
  }
}
