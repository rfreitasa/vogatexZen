
const db = require('../models/db');
const moment = require('moment');

exports.updateEmpresa = async (data) => {
  try {
    var id_empresa = data.id
 

    data.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')
    const toBeUpdated = {}
    const canBeUpdated = [
      'EMPRESA_PERFIL_VENDA',
      'EMPRESA_PERFIL_VENDA_PRG',
      'EMPRESA_PERFIL_FISCAL',
      'EMPRESA_USER_SMTP',
      'EMPRESA_PASSWD_SMTP',
      'EMPRESA_DOMINIO_SMTP',
      'EMPRESA_ATIVO',
      'EMPRESA_CLUSTER',
      'EMPRESA_NOME'
    ]
    for (let i in data) {
      if (canBeUpdated.indexOf(i) > -1 && data[i] !== '') {
        toBeUpdated[i] = data[i]    
      }
    }

    var query = db.write('EMPRESA')
      .where('EMPRESA_ID', id_empresa)
      .update(toBeUpdated)
      .finally((id) => {
     
      })
      return 'ok';   
  } catch (error) {
    console.log(error);
    return 'nok'
  }
}

//metodos do primeiro banco 
exports.getEmpresaById = async (id) => {
  try{
  const query = db.read.select('*')
  .from('EMPRESA')
  .where('EMPRESA_ID', '=', id);
  return query;

} catch (error) {
  return "";
}
};
exports.getEmpresaById_ERP = async (id) => {
  try{
    console.log(id)
  const query = db.read.select('*')
  .from('EMPRESA')
  .where('EMPRESA_ID_ERP', '=', id);
  return query;

} catch (error) {
  return "";
}
};

exports.getEmpresas = async () => {
 try{
  const query = db.read.select('*')
    .from('EMPRESA');
    return query;

   } catch (error) {
    return "";
  }
  };
  
  exports.getEmpresaByName = async (input) => {
  try{
    const query = db.read.select('*')
    .from('EMPRESA')
    .where('EMPRESA_NOME', '=', input);
    return query;

   } catch (error) {
    return "";
  }
};


exports.createEmpresa = async (data) => {
  try{
  const createdAt = moment().format('YYYY-MM-DD hh:mm:ss');
  const query = db.write('EMPRESA').insert({
    EMPRESA_NOME: data.nome || null,
    EMPRESA_ID_ERP: data.id_erp || null,
    EMPRESA_CONTRATO_INI: data.contrato_ini || null,
    EMPRESA_CONTRATO_FIM: data.contrato_fim || null,
    EMPRESA_VALOR_MENSAL: data.valor_mensal || 0,
    EMPRESA_OBS: data.obs || null,
    EMPRESA_CEP: data.cep || null,
    EMPRESA_ENDERECO: data.endereco || null,
    EMPRESA_NUMERO: data.numero || 0,
    EMPRESA_COMPLEMENTO: data.complemento || null,
    EMPRESA_BAIRRO: data.bairro || null,
    EMPRESA_CIDADE: data.cidade || null,
    EMPRESA_EMAIL: data.email || null,
    EMPRESA_CONTATO: data.contato || null,
    EMPRESA_LOGO: data.logo || null,
    EMPRESA_ORGANIZACAO_ID: data.organizacao_id || 3,
    EMPRESA_CNPJ: data.cnpj || null,
    EMPRESA_ESTADO: data.estado || null,
    EMPRESA_TELEFONE: data.telefone || null,
    EMPRESA_ATIVO: data.ativo || 0,
    EMPRESA_ID_ERP: '1005',
    EMPRESA_PONTO_ACESSO_ID:  data.ponto_acesso_id || 0, //se nao passar o perfil setamos como 1- vendedor
    
    CREATED_AT: createdAt,
    UPDATED_AT: createdAt
  });
  console.info("query -->", query.toQuery())
  return query;

} catch (error) {
  return "";
}
};



exports.getEmpresaERP = async () =>{
try{
    const myPromise = new Promise((resolve,reject) => {
      

      db.bancoexterno.get(function (err, db) {              
                  db.query(`select * from emp1`, 
                    function (err, result) {

                        try {
                                if (err) {
                                  return err;
                                }
                                if (result != undefined) {
                                    resolve(result);
                                }
                                else {
                                    reject(err);
                                }
                                setTimeout(function() {
                                  reject(err);
                                }, 100);
                                db.detach();

                              }
                        catch (err){
                              reject(err);
                              db.detach();

                        }
                    });
                    // return query;
      });
      db.bancoexterno.destroy();
    });

      const query = myPromise.then((resultado)=>{ return resultado;})      
                            .catch((err) => { return err;} );                   
      return query;
    
  //se não for passado parametro , gerar msg de erro
  
} catch (error) {
  return "";
}
}



exports.getEmpresaERPById = async (id) =>{
try{
  const myPromise = new Promise((resolve,reject) => {
    

    db.bancoexterno.get(function (err, db) {              
                db.query(`select * from emp1  where numemp1 = ${id}`, 
                  function (err, result) {

                      try {
                              if (err) {
                                return err;
                              }
                              if (result != undefined) {
                                  resolve(result);
                              }
                              else {
                                  reject(err);
                              }
                              setTimeout(function() {
                                reject(err);
                              }, 100);
                              db.detach();

                            }
                      catch (err){
                            reject(err);
                            db.detach();

                      }
                  });
                  // return query;
    });
    db.bancoexterno.destroy();
  });

    const query = myPromise.then((resultado)=>{ return resultado;})      
                          .catch((err) => { return err;} );                   
    return query;
  
//se não for passado parametro , gerar msg de erro

} catch (error) {
  return "";
}
}