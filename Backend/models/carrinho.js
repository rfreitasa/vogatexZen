const db = require('../models/db')
const moment = require('moment-timezone')
const axios = require('axios')
const { API } = require('../configuration/api')

exports.getDataUser = async (email) => {
  try {
    const query = db.read
      .select(
        {
          usuario_password_erp: 'USUARIO_PASSWORD_ERP',
          usuario_conta_id_erp: 'USUARIO_CONTA_ID_ERP',
          usuario_id: 'USUARIO_ID',
          usuario_nome: 'USUARIO_NOME',
        },
        { organizacao_id: 'EMPRESA_ORGANIZACAO_ID' },
      )
      .from('USUARIOS')
      .innerJoin('EMPRESA', 'USUARIO_EMPRESA_ID', '=', 'EMPRESA_ID')
      .where('USUARIOS.USUARIO_EMAIL', '=', email)
    return query
  } catch (error) {
    return ''
  }
}

exports.getCarrinhoItens = async (carrinho_id) => {
  try {
    const query = db.read
      .select(
        {
          ID: 'ID',
          ITEM_CODIGO: 'ITEM_CODIGO',
          ITEM_ID: 'ITEM_ID',
          ITEM_NOME: 'ITEM_NOME',
          EMPRESA_ID: 'EMPRESA_ID',
          EMPRESA_APELIDO: 'EMPRESA_APELIDO',
          QUANTIDADE: 'QUANTIDADE',
          SALEPROFILE: 'SALEPROFILE',
          LISTA_PRECO_ID: 'LISTA_PRECO_ID',
          LISTA_PRECOS_MOEDA: 'LISTA_PRECOS_MOEDA',
          VALOR_UNITARIO: 'VALOR_UNITARIO',
          VALOR_UNITARIO_PADRAO: 'VALOR_UNITARIO_PADRAO',
          VALOR_TOTAL: 'VALOR_TOTAL',
          TIPO_VENDA: 'TIPO_VENDA',
          ITEM_GRADE: 'ITEM_GRADE',
          ITEM_UNIDADE: 'ITEM_UNIDADE',
          PROGRAMACAO_NUMERO: 'PROGRAMACAO_NUMERO',
          PROGRAMACAO_ITEM_ID: 'PROGRAMACAO_ITEM_ID',
          PROGRAMACAO_DATA: 'PROGRAMACAO_DATA',
          PEDIDO_NUM: 'PEDIDO_NUM',
          PEDIDO_ID: 'PEDIDO_ID',
          ID: 'ID',
        },

        {
          CARRINHO_USUARIO_ID: 'CARRINHO_USUARIO_ID',
          CARRINHO_CONTA_ID: 'CARRINHO_CONTA_ID',
        },
      )
      .from('CARRINHO_ITEM')
      .innerJoin(
        'CARRINHO',
        'CARRINHO_ITEM.CARRINHO_ID',
        '=',
        'CARRINHO.CARRINHO_ID',
      )
      .innerJoin(
        'LISTA_PRECOS',
        'LISTA_PRECOS.LISTA_PRECOS_ID',
        '=',
        'CARRINHO_ITEM.LISTA_PRECO_ID',
      )
      .where('CARRINHO.CARRINHO_ID', '=', carrinho_id)
    return query
  } catch (error) {
    return ''
  }
}

exports.RemovecarrinhosVencidos = async () => {
  try {
    const agora = moment().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss')
    const query = db
      .write('*')
      .from('CARRINHO')
      .del()
      .whereRaw('TIMESTAMPDIFF(MINUTE, UPDATED_AT,?) > 59', [agora])
    return query
  } catch (error) {
    return ''
  }
}

exports.HacarrinhoemAberto = async (usuario_id) => {
  try {
    const agora = moment().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss')
    const query = db.read
      .select('*')
      .from('CARRINHO')
      .where('CARRINHO_USUARIO_ID', '=', usuario_id)
      .whereRaw('TIMESTAMPDIFF(MINUTE, UPDATED_AT,?) < 51', [agora])
    return query
  } catch (error) {
    console.log(error)
    return ''
  }
}

exports.criaCarrinho = async (dados) => {
  try {
    const createdAt = moment()
      .tz('America/Sao_Paulo')
      .format('YYYY-MM-DD HH:mm:ss')
    const query = db.write('CARRINHO').insert({
      CARRINHO_USUARIO_ID: dados.usuario_id || null,
      CARRINHO_CONTA_ID: dados.conta_id || null,
      CARRINHO_CONTA_NOME: dados.nome_conta || null,
      CARRINHO_ORGANIZACAO_ID: dados.organizacao_id || null,
      created_at: createdAt,
      updated_at: createdAt,
    })
    return query
  } catch (error) {
    return ''
  }
}

exports.AdicionaItemAoCarrinho = async (carrinho_id, dados) => {
  try {
    const createdAt = moment()
      .tz('America/Sao_Paulo')
      .format('YYYY-MM-DD HH:mm:ss')


    const query = db.write('CARRINHO_ITEM').insert({
      CARRINHO_ID: carrinho_id || null,
      ITEM_CODIGO: dados.codigo ||null,
      ITEM_ID: dados.item_id || null,
      ITEM_NOME: dados.item_nome || null,
      ITEM_GRADE: dados.item_grade || '',
      ITEM_UNIDADE: dados.item_unidade || null,
      EMPRESA_ID: dados.empresa_id_erp || null,
      EMPRESA_APELIDO: dados.empresa_apelido || null,
      QUANTIDADE: dados.quantidade || null,
      LISTA_PRECO_ID: dados.lista_preco_id || null,
      VALOR_UNITARIO: dados.valor_unitario || null,
      VALOR_UNITARIO_PADRAO: dados.valor_unitario_padrao || 0,
      VALOR_TOTAL: dados.valor_unitario * dados.quantidade || null,
      TIPO_VENDA: dados.tipo_venda || null,
      PROGRAMACAO_NUMERO: dados.programacao_numero || null,
      PROGRAMACAO_ITEM_ID: dados.programacao_item_id || null,
      PROGRAMACAO_DATA: dados.programacao_data || null,
      PEDIDO_NUM: dados.pedido_num || null,
      PEDIDO_ID: dados.pedido_id || null,
      SALEPROFILE: dados.saleprofile || null,
      created_at: createdAt,
      updated_at: createdAt,
    })
    console.info('query -->', query.toQuery())

    //ATUALIZA O UPDATED_AT DO CARRINHO
    db.write('CARRINHO')
      .update({
        UPDATED_AT: createdAt,
      })
      .where('CARRINHO_ID', '=', carrinho_id)

    return query
  } catch (error) {
    return ''
  }
}

exports.AtualizaItemDoCarrinho = async (id, dados) => {
  try {


     console.log('acessou')
    if (dados.quantidade == '0') {
      const query = db
        .write('*')
        .from('CARRINHO_ITEM')
        .where('id', '=', id)
        .del()
      return query
    } else {
      const createdAt = moment()
        .tz('America/Sao_Paulo')
        .format('YYYY-MM-DD HH:mm:ss')
      const query = db
        .write('CARRINHO_ITEM')
        .update({
          QUANTIDADE: dados.quantidade || null,
          VALOR_UNITARIO: dados.valor_unitario || null,
          VALOR_UNITARIO_PADRAO: dados.valor_unitario_padrao || 0,
          VALOR_TOTAL: dados.valor_unitario * dados.quantidade || null,
          PROGRAMACAO_NUMERO: dados.programacao_numero || null,
          PROGRAMACAO_ITEM_ID: dados.programacao_item_id || null,
          PROGRAMACAO_DATA: dados.programacao_data || null,
          UPDATED_AT: createdAt,
        })
        .where('ID', '=', id)

      return query
    }
  } catch (error) {
    return ''
  }
}

exports.ConsultaItemNoCarrinho = async (carrinho_id, dados,tipo_venda,programacao_data) => {
  try {
    
    console.log('=== Consulta CARRINHO_ITEM ===');
    console.log({
      carrinho_id,
      item_id: dados.item_id,
      tipo_venda,
      empresa_id: dados.empresa_id_erp,
      programacao_data
    });
    
    const query = db.read
      .select(
        'ID',
        'ITEM_ID',
        'QUANTIDADE',
        'TIPO_VENDA',
        'VALOR_UNITARIO',
        'VALOR_UNITARIO_PADRAO',
        'PROGRAMACAO_DATA'
      )
      .from('CARRINHO_ITEM')
      .where('ITEM_ID', '=', dados.item_id)
      .andWhere('CARRINHO_ID', '=', carrinho_id)
      .andWhere('PROGRAMACAO_NUMERO', '=', tipo_venda)
      .andWhere('EMPRESA_ID', '=', dados.empresa_id_erp)
      .modify(qb => {
        if (programacao_data) {
          qb.andWhere('PROGRAMACAO_DATA', programacao_data);
        }
      })
      .limit(1)
      
    //console.log('query -->', query.toQuery())
    return query
  } catch (error) {
    console.log(error);
    return ''
  }
}

exports.ConsultaItemNoCarrinhoById = async (carrinho_id, id) => {
  try {
    const query = db.read
      .select('ID', 'ITEM_ID', 'QUANTIDADE', 'TIPO_VENDA')
      .from('CARRINHO_ITEM')
      .where('ID', '=', id)
      .where('CARRINHO_ID', '=', carrinho_id)
      .limit(1)
    console.info('query -->', query.toQuery())
    return query
  } catch (error) {
    return ''
  }
}

//consulta saldo nos carrinhos sem considerar o carrinho atual
exports.ConsultaSaldoProdutoBD = async (carrinho_id, dados) => {
 console.log(dados)
  try {
    
    
    const query = db.read
      .sum({ QUANTIDADE: 'QUANTIDADE' })
      .from('CARRINHO_ITEM')
      .where('ITEM_ID', '=', dados.item_id)
      .whereNot('CARRINHO_ID', '=', carrinho_id)
      .andWhere('PROGRAMACAO_NUMERO', '=', dados.tipo_venda)
      .andWhere('EMPRESA_ID', '=', dados.empresa_id_erp)
      .andWhere('PROGRAMACAO_DATA', '=', dados.programacao_data)

    return query
  } catch (error) {
  console.log(error)
    return ''
  }
}

//consulta saldo nos carrinhos sem considerar o carrinho atual
exports.ConsultaSaldoReservado = async (carrinho_id, dados,tipo_venda,programacao_data) => {
console.log('--------------------')
  var query_case = db.read.raw(
    `SUM(CASE WHEN  CARRINHO_ID='${carrinho_id}' THEN QUANTIDADE  END) AS QTD ,SUM(CASE WHEN  CARRINHO_ID!='${carrinho_id}' THEN QUANTIDADE  END) AS QTD_EXT`,
  )
console.log(dados)
  try {
    const query = db.read
      .select(query_case)
      .from('CARRINHO_ITEM')
      .where('ITEM_CODIGO', '=', dados.codigo)
      .andWhere("PROGRAMACAO_NUMERO", "=", tipo_venda)
      .andWhere('EMPRESA_ID',"=",dados.empresa_id_erp)   
      .andWhere("PROGRAMACAO_DATA", "=", programacao_data)


      
  
    return query
  } catch (error) {
 console.log(error)
    return ''
  }
}

exports.geraCodVenda = async () => {
  try {
    const myPromise = new Promise((resolve, reject) => {
      db.bancoexterno.get(function (err, db) {
        db &&
          db.query(`sql para gerar numero do pedido ERP`, function (
            err,
            result,
          ) {
            try {
              if (err) {
                return err
              }
              if (result != undefined) {
                resolve(result)
              } else {
                reject(err)
              }
            } catch (err) {
              reject(err)
            }
          })
        // return query;
        db.detach()
      })
      db.bancoexterno.destroy()
    })

    const query = myPromise
      .then((resultado) => {
        return resultado
      })
      .catch((err) => alert(err))

    return query
  } catch (error) {
    return ''
  }
}

exports.geraCodVendaFake = async () => {
  return Math.random()
}

/*
exports.updateCliente = async (dados) => {

                var putData = {
                  "id": dados.id,
                  "ativa": dados.ativa,
                  "bloqueada": dados.bloqueada,
                  "tipo": dados.tipo,
                  "nome": dados.nome,
                  "apelido": dados.apelido,
                  "cnpj": dados.cnpj,
                  "inscricaoEstadual": dados.inscricaoEstadual,
                  "inscricaoMunicipal": dados.inscricaoMunicipal,
                  "cpf": dados.cpf,
                  "rg": dados.rg,
                  "enderecoLogradouro": dados.enderecoLogradouro,
                  "enderecoNumero": dados.enderecoNumero,
                  "enderecoComplemento": dados.enderecoComplemento,
                  "enderecoBairro": dados.enderecoBairro,
                  "enderecoCidade": dados.enderecoCidade,
                  "enderecoEstado": dados.enderecoEstado,
                  "enderecoPais": dados.enderecoPais,
                  "enderecoCep": dados.enderecoCep,
                  "enderecoLatitude": null,
                  "enderecoLongitude": null,
                  "cliente": dados.cliente,
                  "fornecedor": dados.fornecedor,
                  "vendedor": dados.vendedor,
                  "transportadora": dados.transportadora,
                  "funcionario": dados.funcionario,
                  "segmentoDescricao": dados.segmentoDescricao,
                  "tags": dados.tags,
                  "observacoes": dados.observacoes,
                  "vendedorPadrao": {
                      "id": dados.vendedorPadrao.id,
                      "nome": dados.vendedorPadrao.nome,
                      "apelido": dados.vendedorPadrao.apelido
                  }
                };

                          const query = await axios.put(`${API.contas}/${dados.id}`,putData,{
                            auth:{ username: API.conexao.user,password: API.conexao.password},
                            timeout: 150000
                        },
                        {
                            withCredentials: true,
                            headers: {
                                    'Access-Control-Allow-Origin': 'http://localhost:3000'       ,Origin: 'http://localhost:3000'
                            }
                        },
                        
                        )
                        .then((result) => {
                              return result.data;
                        })
                        .catch(function(error) {
                            return id;
                        });

                        return query;
                                
                  

};

*/
exports.deletaItemDoCarrinho = async (id) => {
  const query = db.write('*').from('CARRINHO_ITEM').where('id', '=', id).del()
  return query
}
exports.deletaCarrinho = async (id) => {
  try {
    const query = db
      .write('*')
      .from('CARRINHO')
      .where('CARRINHO_ID', '=', id)
      .del()
    return query
  } catch (error) {
    return ''
  }
}
