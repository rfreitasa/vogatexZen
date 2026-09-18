
const db = require('../models/db');
const moment = require('moment');

//metodos do primeiro banco 
exports.getOrganizacaoById = async (id) => {
   const query = db.read.select('*')
   .from('ORGANIZACAO')
   .where('ORGANIZACAO_ID', '=', id);
   return query;
};

exports.getOrganizacoes= async () => {
    const query = db.read.select('*')
    .from('ORGANIZACAO');
    return query;
};
  
exports.getConnectionData = async (email)=>{
    const query = db.read.select('ORGANIZACAO_TIPO','ORGANIZACAO_API','ORGANIZACAO_BD','ORGANIZACAO_USUARIO','ORGANIZACAO_PASSWORD')
    .from('ORGANIZACAO');
    return query;

}

exports.getOrganizacaoByName = async (input) => {
    const query = db.read.select('*')
    .from('ORGANIZACAO')
    .where('ORGANIZACAO_NOME', '=', input);
    return query;
};

exports.createOrganizacao = async (data) => {
    console.log(data)
  const createdAt = moment().format('YYYY-MM-DD hh:mm:ss');
  const query = db.write('ORGANIZACAO').insert({
        ORGANIZACAO_NOME: data.nome || null,
        ORGANIZACAO_TIPO: data.tipo || null,
        ORGANIZACAO_API: data.api || null,
        ORGANIZACAO_BD: data.bd || null,
        ORGANIZACAO_USUARIO: data.usuario || null,
        ORGANIZACAO_PASSWORD:  data.password || null, //se nao passar o perfil setamos como 1- vendedor
        ORGANIZACAO_FRETE: data.frete || null,
        ORGANIZACAO_FRETE_REDESP: data.frete_redesp || null,
        ORGANIZACAO_LISTA_ORDEM: data.lista_ordem || null,
        ORGANIZACAO_USER_SMTP: data.user_smtp || null,
        ORGANIZACAO_PASSWD_SMTP: data.passwd_smtp || null,
        ORGANIZACAO_DOMINIO_SMTP: data.dominio_smtp || null,
        ORGANIZACAO_EXIBE_OBS: data.exibe_obs || null,
        ORGANIZACAO_PRODUTO_SESTOQUE: data.produto_sestoque || null,
        ORGANIZACAO_ATIVO: data.ativo || 0,
        CREATED_AT: createdAt,
        UPDATED_AT: createdAt
    });
  console.info("query -->", query.toQuery())
  return query;
};





exports.updateOrganizacao = async (data) => {
    try {
      const id_organizacao = data.ORGANIZACAO_ID;
  
      // Atualiza o campo 'updated_at' com a data e hora atual
      data.updated_at = moment().format('YYYY-MM-DD HH:mm:ss');
  
      // Campos que podem ser atualizados na tabela ORGANIZACAO
      const canBeUpdated = [
        'ORGANIZACAO_FRETE',
        'ORGANIZACAO_FRETE_REDESP',
        'ORGANIZACAO_LISTA_ORDEM',
        'ORGANIZACAO_USER_SMTP',
        'ORGANIZACAO_PASSWD_SMTP',
        'ORGANIZACAO_DOMINIO_SMTP',
        'ORGANIZACAO_EXIBE_OBS',
        'ORGANIZACAO_PRODUTO_SESTOQUE',
        'ORGANIZACAO_VENDE_SESTOQUE'
      ];
  
      const toBeUpdated = {};
  
      // Preenche 'toBeUpdated' com os campos válidos e não vazios
      for (const field in data) {
        if (canBeUpdated.includes(field) && data[field] !== '') {
          toBeUpdated[field] = data[field];
        }
      }
  
      // Realiza a atualização na tabela ORGANIZACAO
      await db.write('ORGANIZACAO')
        .where('ORGANIZACAO_ID', id_organizacao)
        .update(toBeUpdated);
  
      // Verifica se há alguma tabela de preço com 'default' igual a 'sim'
      const hasDefaultPrice = await db.read.select('LISTA_PRECOS_DEFAULT').from('LISTA_PRECOS').where('LISTA_PRECOS_DEFAULT', 'sim').first();
  
      // Se houver, altera para ''
      if (hasDefaultPrice) {
        await db.write('LISTA_PRECOS').where('LISTA_PRECOS_DEFAULT', 'sim').update({ LISTA_PRECOS_DEFAULT: '' });
      }
  
      // Define 'default' para 'sim' na tabela 'LISTA_PRECOS' correspondente
      await db.write('LISTA_PRECOS').where('LISTA_PRECOS_ID', data.ORGANIZACAO_LISTA_DEFAULT).update({ LISTA_PRECOS_DEFAULT: 'sim' });
  
      // Retorna 'ok' se a atualização foi bem-sucedida
      return 'ok';
    } catch (error) {
      // Log do erro e retorno de 'nok' em caso de falha
      console.error(error);
      return 'nok';
    }
  };
  