const db = require('../models/db')
const moment = require('moment-timezone')
const axios = require('axios')
const { API,ERP_CONF } = require('../configuration/api')

exports.getTokenERPBD = async () => {
  try {
    const agora = moment().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss')


    const query = db.read
      .select('token')
      .from('CONFIG')
      .whereRaw('TIMESTAMPDIFF(MINUTE, EXPIRES,?) < 0', [agora])
    return query
  } catch (error) {
    return ''
  }
}

exports.setTokenERPBD = async (token,new_venc) => {
  try {
    const existe = await db.read.select('*').from('CONFIG')
    
    
    if (existe[0].COD) {
     
      const query = db.write('CONFIG').update({
        TOKEN: token,
        EXPIRES: new_venc,
      })
      return query
    } else {
      console.log('inserindo')
      const query = db.write('CONFIG').insert({
        TOKEN: token,
        EXPIRES: new_venc,
      })
      return query
    }
  } catch (error) {
    return ''
  }
}
exports.getTokenERP = async (reqdata) => {
  try {
    /*const FormData = require("form-data");

    const form = new FormData();
    form.append("grant_type", "password");
    form.append("username", API_TECHFRETE.conexao.user);
    form.append("password", API_TECHFRETE.conexao.password);
*/
    //  axios.post('https://example.com', form, { headers: form.getHeaders() })
    //...

    const query = await axios
      .post(
        `${ERP_CONF.token}`,
        {
            email: ERP_CONF.conexao.user,
            password: ERP_CONF.conexao.password,
        },
        {
          headers: {
            tenant: `${API.tenant}`,
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            Origin: 'http://localhost:3000',
            accept: "text/plain",

          },
        },
      )

      .then((result) => {
        //console.log(result.data)
        return result.data
      })
      .catch(function (error) {
       console.log(error);
        return error
      })

    return query
  } catch (error) {
    return ''
  }
}

exports.solicitaTMS = async (token, json) => {
  try {
    const query = await axios
      .post(
        `${API_TECHFRETE.solicita_indicacao}`,
        json,

        {
          withCredentials: true,
          headers: {
            tenant: `${API.tenant}`,
            Authorization: `Bearer ${token}`,
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            Origin: 'http://localhost:3000',
          },
        },
      )
      .then((result) => {
        return result.status
      })
      .catch(function (error) {
        return error.status
      })

    return query
  } catch (error) {
    console.log(error)
    return ''
  }
}

exports.consultaTMS = async (token, registro) => {
  try {
    const query = await axios
      .get(`${API_TECHFRETE.consulta_indicacao}?idReg=${registro}`, {
        withCredentials: true,
        headers: {
          tenant: `${API.tenant}`,
          Authorization: `Bearer ${token}`,
          'Access-Control-Allow-Origin': 'http://localhost:3000',
          Origin: 'http://localhost:3000',
        },
      })
      .then((result) => {
        return result.data
      })
      .catch(function (error) {
        return error.status
      })

    return query
  } catch (error) {
    console.log(error)
    return ''
  }
}

exports.getidReg = async () => {
  try {
    const myPromise = new Promise((resolve, reject) => {
      db.bancoexterno.get(function (err, db) {
        db &&
          db.query(
            `select gen_id(tms_pedido_numero, 1) as pedido_numero from ancora`,
            function (err, result) {
              try {
                if (err) {
                  console.log(err)
                  return err
                }
                if (result != undefined) {
                  resolve(result[0].PEDIDO_NUMERO)
                } else {
                  console.log(err)
                  reject(err)
                }
                setTimeout(function () {
                  reject(err)
                }, 1000)
                db.detach()
              } catch (err) {
                reject(err)
                db.detach()
              }
            },
          )
      })
      db.bancoexterno.destroy()
    })

    const query = myPromise
      .then((resultado) => {
        return resultado
      })
      .catch((err) => {
        return err
      })
    return query
  } catch (error) {
    return ''
  }
}
