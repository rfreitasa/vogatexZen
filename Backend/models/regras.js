const db = require('../models/db')
const moment = require('moment')

//metodos do primeiro banco
exports.getRegraById = async (id) => {
  const query = db.read
    .select('*')
    .from('REGRAS_COMERCIAIS')
    .where('REGRAS_COMERCIAIS_ID', '=', id)
  return query
}

exports.getRegras = async () => {
  const query = db.read.select('*').from('REGRAS_COMERCIAIS')
  return query
}

exports.getRegrasAtribuidas = async () => {
  const query = db.read
    .select({
      REGRAS_ATRIBUIDAS_ID: 'REGRAS_ATRIBUIDAS_ID',
      REGRAS_ATRIBUIDAS_REGRAS_COMERCIAIS_NOME: 'REGRAS_COMERCIAIS_NOME',
      REGRAS_ATRIBUIDAS_EMPRESA_NOME: 'EMPRESA_NOME',
      REGRAS_ATRIBUIDAS_EMPRESA_ID: 'EMPRESA_ID_ERP',
      REGRAS_ATRIBUIDAS_LISTA_PRECOS_NOME: 'LISTA_PRECOS_NOME',
      REGRAS_ATRIBUIDAS_LISTA_PRECOS_DESCRICAO: 'LISTA_PRECOS_DESCRICAO',
      REGRAS_ATRIBUIDAS_LISTA_PRECOS_ID: 'LISTA_PRECOS_ID',
      REGRAS_ATRIBUIDAS_VALOR: 'REGRAS_ATRIBUIDAS_VALOR',
    })
    .from('REGRAS_ATRIBUIDAS')
    .innerJoin(
      'REGRAS_COMERCIAIS',
      'REGRAS_ATRIBUIDAS_REGRAS_COMERCIAIS_ID',
      '=',
      'REGRAS_COMERCIAIS_ID',
    )
    .innerJoin('EMPRESA', 'REGRAS_ATRIBUIDAS_EMPRESA_ID', '=', 'EMPRESA_ID')
    .innerJoin(
      'LISTA_PRECOS',
      'REGRAS_ATRIBUIDAS_LISTA_PRECOS',
      '=',
      'LISTA_PRECOS_ID',
    )

  return query
}

exports.ExistRegraAtribuida = async (data) => {
  console.log(data)
  const query = db.read
    .select('*')
    .from('REGRAS_ATRIBUIDAS')
    .where(
      'REGRAS_ATRIBUIDAS_REGRAS_COMERCIAIS_ID',
      '=',
      data.REGRAS_ATRIBUIDAS_REGRAS_COMERCIAIS_ID,
    )
    .where(
      'REGRAS_ATRIBUIDAS_EMPRESA_ID',
      '=',
      data.REGRAS_ATRIBUIDAS_EMPRESA_ID,
    )
    .where(
      'REGRAS_ATRIBUIDAS_LISTA_PRECOS',
      '=',
      data.REGRAS_ATRIBUIDAS_LISTA_PRECOS,
    )
  return query
}

exports.getAllListaPrecos = async () => {
  const query = db.read.select('*').from('LISTA_PRECOS')
  return query
}

exports.getAllListAttached = async (usuario_id) => {
  var query_case = db.read.raw(
    `LISTA_PRECOS_DEFAULT,LISTA_PRECOS_ID,LISTA_PRECOS_DESCRICAO,LISTA_PRECOS_NOME,
    CASE WHEN (SELECT COUNT(*) from LISTA_PRECOS_USUARIOS 
    WHERE LISTA_PRECOS_USUARIOS.LISTA_PRECOS_ID=LISTA_PRECOS.LISTA_PRECOS_ID AND 
    LISTA_PRECOS_USUARIOS.USUARIO_ID=${usuario_id})>0 THEN 'selected' else '' end as SELECIONADO  
    `,
  )

  try {
    const query = db.read.select(query_case).from('LISTA_PRECOS')

    return query
  } catch (error) {
    return ''
  }
}
exports.getRegraByName = async (input) => {
  const query = db.read
    .select('*')
    .from('REGRAS_COMERCIAIS')
    .where('REGRAS_COMERCIAIS_NOME', '=', input)
  return query
}

exports.getListaPrecosByName = async (input) => {
  const query = db.read
    .select('*')
    .from('LISTA_PRECOS')
    .where('LISTA_PRECOS_ID', '=', input)
  return query
}

exports.checkPricelist = async (nome,valor,comissao) => {
  const query = db.read
    .select('*')
    .from('LISTA_PRECOS')
    .where('LISTA_PRECOS_NOME', '=', nome)
    .andWhere('LISTA_PRECOS_VALOR_PERMITIDO_INFERIOR_AO_UNITARIO', '=', valor)
    .andWhere('LISTA_PRECOS_PERCENTUAL_COMISSAO_DEFAULT ', '=', comissao)
  return query
}


exports.createRegra = async (data) => {
  const createdAt = moment().format('YYYY-MM-DD hh:mm:ss')
  const query = db.write('REGRAS_COMERCIAIS').insert({
    REGRAS_COMERCIAIS_NOME: data.nome || null,
    REGRAS_COMERCIAIS_TIPO: data.tipo || null,
    REGRAS_COMERCIAIS_INFO: data.info || null,
    CREATED_AT: createdAt,
    UPDATED_AT: createdAt,
  })
  console.info('query -->', query.toQuery())
  return query
}

exports.createRegraAtribuida = async (data) => {
  console.log(data)
  const createdAt = moment().format('YYYY-MM-DD hh:mm:ss')
  const query = db.write('REGRAS_ATRIBUIDAS').insert({
    REGRAS_ATRIBUIDAS_EMPRESA_ID: data.REGRAS_ATRIBUIDAS_EMPRESA_ID || null,
    REGRAS_ATRIBUIDAS_REGRAS_COMERCIAIS_ID:
      data.REGRAS_ATRIBUIDAS_REGRAS_COMERCIAIS_ID || null,
    REGRAS_ATRIBUIDAS_VALOR: data.REGRAS_ATRIBUIDAS_VALOR || null,
    REGRAS_ATRIBUIDAS_LISTA_PRECOS: data.REGRAS_ATRIBUIDAS_LISTA_PRECOS || null,
    CREATED_AT: createdAt,
    UPDATED_AT: createdAt,
  })
  console.info('query -->', query.toQuery())
  return query
}

exports.createListaPrecos = async (data) => {

  const createdAt = moment().format('YYYY-MM-DD hh:mm:ss')
  const query = db.write('LISTA_PRECOS').insert({
    LISTA_PRECOS_NOME: data.nome || null,
    LISTA_PRECOS_DESCRICAO: data.descricao || null,
    LISTA_PRECOS_EXIBE_VALOR: data.LISTA_PRECOS_EXIBE_VALOR || null,
    LISTA_PRECOS_PERMITE_LISTAR_TODOS: data.LISTA_PRECOS_PERMITE_LISTAR_TODOS || null,
    LISTA_PRECOS_EDITA_VALOR_UNITARIO: data.LISTA_PRECOS_EDITA_VALOR_UNITARIO || null,
    LISTA_PRECOS_VALOR_PERMITIDO_INFERIOR_AO_UNITARIO: data.LISTA_PRECOS_VALOR_PERMITIDO_INFERIOR_AO_UNITARIO || null,
    LISTA_PRECOS_PERCENTUAL_COMISSAO_DEFAULT: data.LISTA_PRECOS_PERCENTUAL_COMISSAO_DEFAULT || 0,
    LISTA_PRECOS_MOEDA: data.LISTA_PRECOS_MOEDA || 0,
    CREATED_AT: createdAt,
  })
  console.info('query -->', query.toQuery())
  return query
}

exports.updateListaPrecos = async (data) => {
  console.log(data)
  data.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')
  const toBeUpdated = {}
  const canBeUpdated = [
    'LISTA_PRECOS_DESCRICAO',
    'LISTA_PRECOS_NOME',
    'LISTA_PRECOS_EXIBE_VALOR',
    'LISTA_PRECOS_PERMITE_LISTAR_TODOS',
    'LISTA_PRECOS_EDITA_VALOR_UNITARIO',
    'LISTA_PRECOS_VALOR_PERMITIDO_INFERIOR_AO_UNITARIO',
    'LISTA_PRECOS_PERCENTUAL_COMISSAO_DEFAULT',
    'LISTA_PRECOS_MOEDA',
    'UPDATE_AT',
  ]
  for (let i in data) {
    if (canBeUpdated.indexOf(i) > -1) {
      toBeUpdated[i] = data[i]
    }
  }
  const query = db
    .write('LISTA_PRECOS')
    .where('LISTA_PRECOS_ID', data.id)
    .update(toBeUpdated)

  console.info('query -->', query.toQuery())
  return query
}

exports.updateRegraAtribuida = async (data) => {
  data.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')
  const toBeUpdated = {}
  const canBeUpdated = ['REGRAS_ATRIBUIDAS_VALOR', 'UPDATED_AT']
  for (let i in data) {
    if (canBeUpdated.indexOf(i) > -1) {
      toBeUpdated[i] = data[i]
    }
  }
  const query = db
    .write('REGRAS_ATRIBUIDAS')
    .where('REGRAS_ATRIBUIDAS_ID', data.id)
    .update(toBeUpdated)

  console.info('query -->', query.toQuery())
  return query
}

exports.removeListaPrecos = async (id) => {
  const query = db.write('LISTA_PRECOS').where('LISTA_PRECOS_ID', id).delete()
  console.info('query -->', query.toQuery())
  return query
}
