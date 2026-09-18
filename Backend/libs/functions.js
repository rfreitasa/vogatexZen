const clientesModel = require("../models/clientes");
const empresaModel = require("../models/empresa");
const organizacaoModel = require("../models/organizacao");
const pedidosModel = require("../models/pedidos");

const { successResponse, errorResponse } = require("./response");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const moment = require("moment-timezone");
const nodemailer = require("nodemailer");
const { EMAIL } = require("../configuration/api");
const axios = require("axios");

const { API, ERP_CONF } = require("../configuration/api");

const {
  S3Client,
  ListObjectsCommand,
  GetObjectCommand,
  ListBucketsCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const logStruct = (func, error) => {
  return { func: func, file: "utilitiesController", error };
};
const path = require("path");
const { Blob } = require("buffer");
const { URL } = require("url");

exports.getVendedores = async (email) => {
  const dados_usuario = await clientesModel.getUserInformation(email);
  //  if(!reqData.vendedor && dados_usuario[0].USUARIO_PERFIL==='supervisor'){reqData.supervisor=dados_usuario[0].USUARIO_CONTA_ID_ERP}
  const perfil = dados_usuario[0].USUARIO_PERFIL;
  var filtros = "";
  if (perfil == "supervisor" || perfil == "vendedor") {
    ArrayVendedores = await clientesModel.getArrayVendedores(
      Number(dados_usuario[0].USUARIO_ID),
    );
    ArrayVendedores = ArrayVendedores.filter(
      (li, idx, self) =>
        self
          .map((itm) => itm.USUARIO_CONTA_ID_ERP)
          .indexOf(li.USUARIO_CONTA_ID_ERP) === idx,
    );
    filtros = ArrayVendedores.map((item) => item.USUARIO_CONTA_ID_ERP);
  }

  if (perfil == "operador" || perfil == "ti" || perfil == "admin_global") {
    /*
    ArrayVendedores = await clientesModel.getArrayVendedoresOperador(
    )
    ArrayVendedores = ArrayVendedores.filter(
      (li, idx, self) =>
        self
          .map((itm) => itm.USUARIO_CONTA_ID_ERP)
          .indexOf(li.USUARIO_CONTA_ID_ERP) === idx,
    )
    filtros = ArrayVendedores.map(item => item.USUARIO_CONTA_ID_ERP)
  */
    filtros = [];
  }
  return filtros;
};

exports.getEmpresasAtivas = async () => {
  try {
    const response = await empresaModel.getEmpresas();

    // Filtrar apenas as empresas ativas
    const empresasAtivas = response.filter((item) => item.EMPRESA_ATIVO === 0);

    // Mapear os IDs das empresas ativas e criar a string no formato desejado
    const queryString = empresasAtivas.map((item) => item.EMPRESA_ID_ERP);
    return queryString; // Retorna a string no formato "&empresa_id=1002&empresa_id=1003"
  } catch (error) {
    console.error("Erro ao obter empresas ativas:", error);
    return "";
  }
};

exports.getEmpresasClusterAtivas = async () => {
  try {
    const response = await empresaModel.getEmpresas();

    // Filtrar apenas as empresas ativas
    const empresasAtivas = response.filter((item) => item.EMPRESA_ATIVO === 0);

    // Mapear os IDs das empresas ativas e criar a string no formato desejado
    const queryString = empresasAtivas.map((item) => item.EMPRESA_CLUSTER);
    return queryString; // Retorna a string no formato "&empresa_id=1002&empresa_id=1003"
  } catch (error) {
    console.error("Erro ao obter empresas ativas:", error);
    return "";
  }
};

// Função para obter todas as URLs do bucket
exports.reads3files = async (directoryPaths) => {
  try {
    const directories = directoryPaths
      .split(",")
      .map((directory) => directory.trim());
    let files = [];
    let bucketName = process.env.AWS_BUCKET_NAME;
    let s3Client = new S3Client({
      region: "sa-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    for (const directoryPath of directories) {
      const listParams = {
        Bucket: bucketName,
        Prefix: directoryPath,
      };

      try {
        const data = await s3Client.send(new ListObjectsCommand(listParams));

        for (const obj of data.Contents) {
          const getParams = {
            Bucket: bucketName,
            Key: obj.Key,
          };
          const signedUrl = await getSignedUrl(
            s3Client,
            new GetObjectCommand(getParams),
            { expiresIn: 3600 },
          );
          if (obj.Size > 0) {
            files.push({ url: signedUrl, name: obj.Key });
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    return files;
  } catch (error) {
    console.log(error);
  }
};
exports.sendmail = async (emails, titulo, descricao, anexo, empresa) => {
  try {
    let empresa_data = null;

    // Se a empresa não for fornecida, usar dados de EMAIL.* diretamente
    if (!empresa) {
      //  console.log("Empresa não fornecida. Usando dados padrão de EMAIL.*");

      empresa_data = [
        {
          EMPRESA_DOMINIO_SMTP: EMAIL.conexao.host,
          EMPRESA_USER_SMTP: EMAIL.conexao.user,
          EMPRESA_PASSWD_SMTP: EMAIL.conexao.pass,
        },
      ];
    } else {
      // Obtém os dados da empresa
      empresa_data = await empresaModel.getEmpresaById_ERP(empresa);

      // Verifica se empresa_data é undefined ou null
      if (!empresa_data || empresa_data.length === 0) {
        console.error("Nenhuma empresa encontrada com o nome fornecido");
        return "nok";
      }
    }

    //console.log(empresa_data[0]);

    // Define o título padrão se não estiver definido
    if (!titulo) {
      titulo = EMAIL.assunto_default;
    }

    const descricao_default = EMAIL.descricao_default;

    // Configura o transporte do nodemailer
    var transporte = nodemailer.createTransport({
      host: empresa_data[0].EMPRESA_DOMINIO_SMTP,
      port: EMAIL.conexao.port,
      secure: false,
      auth: {
        user: empresa_data[0].EMPRESA_USER_SMTP,
        pass: empresa_data[0].EMPRESA_PASSWD_SMTP,
      },
    });

    var email = {
      from: empresa_data[0].EMPRESA_USER_SMTP, // Quem enviou este e-mail
      to: empresa_data[0].EMPRESA_USER_SMTP,
      bcc: emails, // Quem receberá
      subject: titulo, // Um assunto ou o default do salesbreath
      html: descricao + descricao_default, // O conteúdo do e-mail
      attachments: [
        {
          filename: "pedido.pdf",
          contentType: "application/pdf", // <- You also can specify type of the document
          content: anexo.data,
        },
      ],
    };

    // Envia o e-mail
    const myPromise = new Promise((resolve, reject) => {
      transporte.sendMail(email, function (err, info) {
        if (err) {
          console.log(err);
          reject("nok"); // Oops, algo de errado aconteceu.
        } else {
          resolve("ok");
        }
      });
    });

    const query = await myPromise
      .then((resultado) => {
        return resultado;
      })
      .catch((err) => {
        console.log(err);
        return "nok";
      });

    return query;
  } catch (error) {
    console.error("error -> ", logStruct("sendmail", error));
    return "nok";
  }
};

exports.getFirstFile = async (caminho) => {
  try {
    const myPromise = new Promise((resolve, reject) => {
      //passsing directoryPath and callback function
      fs.readdir(caminho, (err, files) => {
        if (err) {
          resolve("no_image");
        } else {
          resolve(files[0]); //primeiro arquivo
        }
      });
    });
    const query = await myPromise
      .then((resultado) => {
        return resultado;
      })
      .catch((err) => {
        return err;
      });
    return query;
  } catch (error) {
    console.error("error -> ", logStruct("sendmail", error));
    return "nok";
  }
};
exports.getFirstFileUrl = async (reqData) => {
  try {
    const getScript = (url) => {
      return new Promise((resolve, reject) => {
        const http = require("http"),
          https = require("https");

        let client = http;

        if (url.toString().indexOf("https") === 0) {
          client = https;
        }

        client
          .get(url, (resp) => {
            let data = "";
            // coleta item por item
            resp.on("data", (chunk) => {
              data += chunk;
            });
            //  Quando todos os itens forem coletados resolve passando o data.
            resp.on("end", () => {
              resolve(data);
            });
          })
          .on("error", (err) => {
            reject(err);
          });
      });
    };

    if (/[/]+/g.test(reqData.ITEM_CODIGO)) {
      //Tratamento para verificar se o id possui / na string , se sim pegaremos a posição 1 do split
      reqData.ITEM_CODIGO = reqData.ITEM_CODIGO.split("/")[1];
    }

    const response = await getScript(
      `${API.imagens_galeria}/${reqData.MESTRE_CODIGO}/${reqData.ITEM_CODIGO}/`,
    );

    const convertString = response.match(/\.(.*?)\.jp\w*/g);
    var response_conv = convertString.map((item) => {
      return {
        url:
          `${API.imagens_galeria}/${reqData.MESTRE_CODIGO}/${reqData.ITEM_CODIGO}/` +
          item.split(" ")[1],
        nome: item.split(" ")[1],
      };
    });

    const myPromise = new Promise((resolve, reject) => {
      var request = require("request").defaults({ encoding: null });

      request.get(response_conv[0].url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          //  doc.pipe(fs.createWriteStream('out.pdf'));

          var img = new Buffer.from(body, "base64");

          resolve(img ? img : "no_image");
        } else {
          resolve("no_image");
        }
      });
    });
    const query = await myPromise
      .then((resultado) => {
        return resultado;
      })
      .catch((err) => {
        return err;
      });
    return query;
  } catch (error) {
    return "no_image";
  }
};

exports.gera_impresso2 = async (reqData, code, where) => {
  try {
    //    const url = encodeURIComponent(`${ERP_CONF.salePrint}?ids=${reqData.numero_pedido}&token=${reqData.token_erp}&format=a4&margin=1cm&tenant=${API.tenant}`);

    console.log("gerando pdf" + reqData.ids);
    data = `{
        "code":"${code}",
        "parameters":{ "ids":"${reqData.ids}"
        },
      "format":"PDF"
    }`;

    const query = await axios
      .post(`${ERP_CONF.printSale}${where}`, data, {
        responseType: "arraybuffer",
        responseEncoding: "binary",
        headers: {
          "Content-Type": "application/json",
          tenant: `${API.tenant}`,
          Authorization: `Bearer ${reqData.token_erp}`,
          "Access-Control-Allow-Origin": "http://localhost:3000",
          Origin: "http://localhost:3000",
        },
      })
      .then((result) => {
        //  fs.writeFileSync(`pdf/${reqData.numero_pedido}`.pdf, result.data);

        return result;
      })
      .catch(function (error) {
        console.log("ERRO");
        console.log(error);
        //          console.log('Erro na obtenção dos dados' + id.USUARIO_CONTA_ID_ERP)
        return error;
      });
    return query;
  } catch (error) {
    console.log(error);
    return "";
  }
};

exports.gera_impresso = async (url, orientation) => {
  try {
    if (orientation) {
      modo = orientation;
    } else {
      modo = "landscape";
    }

    const query = await axios
      .get(`${url}`, {
        responseType: "arraybuffer",
        responseEncoding: "binary",
        headers: {
          tenant: `${API.tenant}`,
          "Content-Type": "application/json",
        },
      })
      .then((result) => {
        console.log(result.data);
        return result.data;
      })
      .catch(function (error) {
        console.log(error);
        return error;
      });

    return query;
  } catch (error) {
    return "erro";
  }
};

exports.get_urlPdf = async (url, orientation) => {
  try {
    if (orientation) {
      modo = orientation;
    } else {
      modo = "landscape";
    }

    /*

    const query = await axios
      .get(`${ERP_CONF.convertUrltoPdf}?url=${url}`, {
        responseType: "arraybuffer",
        responseEncoding: "binary",
        headers: {
          tenant: `${API.tenant}`,
          'Content-Type': 'application/json',
        },
      })
        */

    const query = await axios
      .get(`${ERP_CONF.convertUrltoPdf}?url=${url}&width=297mm&height=210mm`, {
        headers: {
          tenant: API.tenant,
        },
        timeout: 30000,
      })
      .then((result) => {
        console.log(result.data.url);
        return result.data.url;
      })
      .catch(function (error) {
        console.log(error);
        return error;
      });

    return query;
  } catch (error) {
    return "erro";
  }
};
//usando lambda
/*funcionando exports.gera_pedido_impresso = async (reqData) => {
  try {

    const url = encodeURIComponent(`${ERP_CONF.salePrint}?ids=${reqData.numero_pedido}&token=${reqData.token_erp}&format=a4&margin=1cm&tenant=${API.tenant}`);

    const query = await axios
      .get(`${ERP_CONF.lambda_htmltopdf}?orientation=landscape&url=${url}`, {
        responseType: "arraybuffer",
        responseEncoding: "binary",
        headers: {
          tenant: `${API.tenant}`,
          'Content-Type': 'application/json',
        },
      })
      .then((result) => {
        return result
      })
      .catch(function (error) {
        return error
      })

    return query
  } catch (error) {
    return 'erro'
  }

}

*/
/*exports.gera_pedido_impresso = async (reqData) => {
  console.log(reqData);
  try {

//    const url = encodeURIComponent(`${ERP_CONF.salePrint}?ids=${reqData.numero_pedido}&token=${reqData.token_erp}&format=a4&margin=1cm&tenant=${API.tenant}`);

    console.log('gerando pdf' + reqData.numero_pedido)
    data = `{
      "code":"/sale/report/saleForm",
        "code":"/sale/report/saleForm",
        "parameters":{
          "IDS":"{${reqData.numero_pedido}}"
        }
      "format":"PDF"
    }`
    
    //console.log(data);
    const query = await axios
      .post(`${ERP_CONF.printSale}`, data, {
        responseType: "arraybuffer",
        responseEncoding: "binary",
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${reqData.token_erp}`,
          'Access-Control-Allow-Origin': 'http://localhost:3000',
          Origin: 'http://localhost:3000',
        },
      })
      .then((result) => {
        //  fs.writeFileSync(`pdf/${reqData.numero_pedido}`.pdf, result.data);

        return result
      })
      .catch(function (error) {
        console.log('ERRO')
        console.log(error)
        //          console.log('Erro na obtenção dos dados' + id.USUARIO_CONTA_ID_ERP)
        return error
      })
    return query;
  } catch (error) {
    console.log(error)
    return ''
  }


}*/

exports.gera_pedido_impresso = async (reqData) => {
  try {
    //    const url = encodeURIComponent(`${ERP_CONF.salePrint}?ids=${reqData.numero_pedido}&token=${reqData.token_erp}&format=a4&margin=1cm&tenant=${API.tenant}`);

    console.log("gerando pdf" + reqData.numero_pedido);
    data = `{
        "code":"/sale/report/saleForm",
        "parameters":{ "ids":"${reqData.numero_pedido}"
        },
      "format":"PDF"
    }`;

    const query = await axios
      .post(`${ERP_CONF.printSale}`, data, {
        responseType: "arraybuffer",
        responseEncoding: "binary",
        headers: {
          "Content-Type": "application/json",
          tenant: `${API.tenant}`,
          Authorization: `Bearer ${reqData.token_erp}`,
          "Access-Control-Allow-Origin": "http://localhost:3000",
          Origin: "http://localhost:3000",
        },
      })
      .then((result) => {
        //  fs.writeFileSync(`pdf/${reqData.numero_pedido}`.pdf, result.data);

        return result;
      })
      .catch(function (error) {
        console.log("ERRO");
        console.log(error);
        //          console.log('Erro na obtenção dos dados' + id.USUARIO_CONTA_ID_ERP)
        return error;
      });
    return query;
  } catch (error) {
    console.log(error);
    return "";
  }
};

exports.gera_romaneio_impresso = async (reqData) => {
  try {
    console.log("gerando romaneiro em pdf" + reqData.romaneio);
    data = `{
      "code":"/material/report/outgoingListForm",
      "parameters":{ "ids":${reqData.romaneio}
      },
    "format":"PDF"
  }`;
    console.log(data);
    const query = await axios
      .post(`${ERP_CONF.printSale}`, data, {
        responseType: "arraybuffer",
        responseEncoding: "binary",
        headers: {
          "Content-Type": "application/json",
          tenant: `${API.tenant}`,
          Authorization: `Bearer ${reqData.token_erp}`,
          "Access-Control-Allow-Origin": "http://localhost:3000",
          Origin: "http://localhost:3000",
        },
      })
      .then((result) => {
        //  fs.writeFileSync(`pdf/${reqData.numero_pedido}`.pdf, result.data);

        return result;
      })
      .catch(function (error) {
        console.log("ERRO");
        console.log(error);
        //          console.log('Erro na obtenção dos dados' + id.USUARIO_CONTA_ID_ERP)
        return error;
      });
    return query;
  } catch (error) {
    console.log(error);
    return "";
  }
};
exports.gera_pedido_impresso2 = async (reqData) => {
  try {
    var url = "";
    const agora = moment()
      .tz("America/Sao_Paulo")
      .format("DD-MM-YYYY HH:mm:ss");

    const dados_usuario = await clientesModel.getUserInformation(
      reqData.usuario,
    );
    const dados_conexao = await organizacaoModel.getConnectionData();

    if (dados_usuario[0] && dados_conexao) {
      const sleep = (milliseconds) => {
        return new Promise((resolve) => setTimeout(resolve, milliseconds));
      };

      const grv_arq = async (index) => {
        //GRAVA O ARQUIVO EM DISCO PARA SER ANEXADO POSTERIORMENTE

        reqData.numero_pedido = reqData.pedidos[index].numero;

        url = `./pdf/${reqData.numero_pedido}.pdf`;
        const response = await pedidosModel.getpedido(reqData);

        if (response && !response.length) {
          return errorResponse(404, "PedidoNotfound");
        } else {
          const empresaERP = await empresaModel.getEmpresaERPById(
            response[0].empresa.id,
          );
          const responseCliente = await clientesModel.getContaById(
            response[0].conta.id,
          );
          const contatoCliente = await clientesModel.getContatosByClienteId(
            response[0].conta.id,
          );
          const contatoVendedor = await clientesModel.getContatosByClienteId(
            response[0].vendedor.id,
          );

          return new Promise((resolved, rejectd) => {
            var telefoneCliente = contatoCliente
              ? contatoCliente.filter(function (item) {
                  return item.tipo == "TELEFONE";
                })
              : "";
            var telefoneVendedor = contatoVendedor
              ? contatoVendedor.filter(function (item) {
                  return item.tipo == "TELEFONE";
                })
              : "";

            const dados = response[0].itens;

            //gerando o Pedido //caceçalho
            function geraCabecalhoEmpresa(doc) {
              geraHR(doc, 15);
              doc
                //PRIMEIRA LINHA
                .fontSize(10)
                .text("Empresa:", 30, 20)

                .fontSize(8)
                .text(
                  `${response[0].empresa ? response[0].empresa.nome : ""}`,
                  80,
                  21,
                )

                //2 LINHA
                .fontSize(10)
                .text("Endereço:", 30, 35)

                .fontSize(8)
                .text(
                  `${empresaERP[0] ? empresaERP[0].ENDERECO : ""} , ${
                    empresaERP[0] ? empresaERP[0].NUMERO : ""
                  } - ${empresaERP[0] ? empresaERP[0].BAIRRO : ""}`,
                  80,
                  36,
                )

                //3 LINHA
                .fontSize(10)
                .text("Cep:", 30, 50)

                .fontSize(8)
                .text(`${empresaERP[0] ? empresaERP[0].CEP : ""}`, 80, 51)

                //4 LINHA
                .fontSize(10)
                .text("Telefone:", 30, 65)

                .fontSize(8)
                .text(`${empresaERP[0] ? empresaERP[0].FONE1 : ""}`, 80, 66)

                .fontSize(10)
                .text("Email:", 160, 65)

                .fontSize(8)
                .text(`${empresaERP[0] ? empresaERP[0].EMAIL : ""}`, 190, 66)

                //5 LINHA
                .fontSize(10)
                .text("CNPJ:", 30, 80)

                .fontSize(8)
                .text(`${empresaERP[0] ? empresaERP[0].CGC : ""}`, 80, 81)

                .fontSize(10)
                .text("Inscrição Estadual:", 160, 80)

                .fontSize(8)
                .text(
                  `${empresaERP[0] ? empresaERP[0].INSCRICAO : ""}`,
                  250,
                  81,
                );
              /*  doc
                  .image("./imagens/nouveau.jpeg", 400, 25, {
                    width: 150,
                    align: "right",
                  })
                */
              doc.text("Impresso gerado em " + agora, 200, 80, {
                align: "right",
              });
              geraHR(doc, 95);
            }

            function geraCabecalhoCliente(doc) {
              //console.log(responseCliente);

              geraHR(doc, 100);
              doc
                //PRIMEIRA LINHA
                .fontSize(10)
                .text("Conta:", 30, 110)

                .fontSize(7)
                .text(
                  `${response[0] ? response[0].conta.id : ""} - ${
                    response[0] ? response[0].conta.nome : ""
                  } `,
                  70,
                  111,
                  { width: 220, align: "left" },
                )

                //PRIMEIRA LINHA LADO DIREITO
                .fontSize(10)
                .text("Numero do Pedido:", 320, 110)

                .fontSize(7)
                .text(
                  `${response[0] ? response[0].numeroSistema : ""}`,
                  420,
                  111,
                )

                //2 LINHA
                .fontSize(10)
                .text("CNPJ:", 30, 130)

                .fontSize(7)
                .text(
                  `${responseCliente[0] ? responseCliente[0].cnpj : ""}`,
                  70,
                  131,
                )

                //2 LINHA LADO DIREITO
                .fontSize(10)
                .text("Referência:", 320, 130)

                .fontSize(7)
                .text(`${response[0] ? response[0].referencia : ""} `, 380, 131)

                //3 LINHA
                .fontSize(10)
                .text("Inscrição estadual:", 30, 145)

                .fontSize(7)
                .text(
                  `${
                    responseCliente[0]
                      ? responseCliente[0].inscricaoEstadual
                      : ""
                  }`,
                  120,
                  146,
                )

                //3 LINHA LADO DIREITO
                .fontSize(10)
                .text("Emissão:", 320, 145)

                .fontSize(7)
                .text(
                  formatDate(`${response[0] ? response[0].emissao : ""} `),
                  370,
                  146,
                )

                //4 LINHA
                .fontSize(10)
                .text("Endereço:", 30, 160)

                .fontSize(7)
                .text(
                  `${
                    responseCliente[0] && responseCliente[0].enderecoLogradouro
                      ? responseCliente[0].enderecoLogradouro
                      : ""
                  } , ${
                    responseCliente[0] && responseCliente[0].enderecoNumero
                      ? responseCliente[0].enderecoNumero
                      : ""
                  }  ${
                    responseCliente[0] && responseCliente[0].enderecoBairro
                      ? responseCliente[0].enderecoBairro
                      : ""
                  }`,
                  80,
                  161,
                  { width: 250, align: "left" },
                )

                //4 LINHA LADO DIREITO
                .fontSize(10)
                .text("Entrega:", 320, 160)

                .fontSize(7)
                .text(
                  formatDate(`${response[0] ? response[0].previsao : ""}`),
                  370,
                  161,
                )

                //5 LINHA
                .fontSize(10)
                .text("CEP:", 30, 175)

                .fontSize(7)
                .text(
                  `${
                    responseCliente[0] ? responseCliente[0].enderecoCidade : ""
                  } / ${
                    responseCliente[0] ? responseCliente[0].enderecoEstado : ""
                  } - ${
                    responseCliente[0] ? responseCliente[0].enderecoCep : ""
                  }`,
                  65,
                  177,
                )

                //5 LINHA LADO DIREITO
                .fontSize(10)
                .text("Condições de Pagamento:", 320, 175)

                .fontSize(7)
                .text(`${response[0] ? response[0].prazoPagto : ""}`, 450, 176)

                //6 LINHA
                .fontSize(10)
                .text("Telefone:", 30, 190)

                .fontSize(7)
                .text(
                  `${telefoneCliente[0] ? telefoneCliente[0].descricao : ""}`,
                  75,
                  191,
                )

                //6 LINHA LADO DIREITO
                .fontSize(10)
                .text("Vendedor:", 320, 190)

                .fontSize(7)
                .text(
                  `${response[0] ? response[0].vendedor.nome : ""}`,
                  375,
                  191,
                )

                //7 LINHA
                .fontSize(10)
                .text("Tipo de frete:", 30, 205)

                .fontSize(7)
                .text(`${response[0] ? response[0].tipoFrete : ""}`, 100, 206)

                //7 LINHA LADO DIREITO
                .fontSize(10)
                .text("Telefone:", 320, 206)

                .fontSize(7)
                .text(
                  `${telefoneVendedor[0] ? telefoneVendedor[0].descricao : ""}`,
                  370,
                  208,
                )

                //8 LINHA
                .fontSize(10)
                .text("Transportadora:", 30, 220)

                .fontSize(7)
                .text(
                  `${
                    response[0] && response[0].transportadora
                      ? response[0].transportadora.nome
                      : ""
                  }`,
                  120,
                  221,
                )

                //8 LINHA
                .fontSize(10)
                .text("Status:", 320, 220)

                .fontSize(7)
                .text(`${response[0] ? response[0].status : ""}`, 370, 221);

              geraHR(doc, 233);
              geraHR(doc, 238);
            }

            function geraTituloimpressos(doc, dados) {
              doc
                .fillColor("#444444")
                .fontSize(10)
                .font("Helvetica-Bold")
                .text(`Itens do pedido de Venda`, 50, 255, { align: "center" });
            }

            function geraTabeladeDados(doc, dados) {
              var posicaoInicial = 275;
              const posicaoFinal = 690;
              var position = 275;
              var page = 0;

              let i;

              doc.font("Helvetica-Bold");

              generateTableRow(
                doc,
                posicaoInicial,
                "Código",
                "Descrição",
                "Grade",
                "Quantidade",
                "Unidade",
                "Valor Un",
                "Valor total",
              );
              geraHR(doc, posicaoInicial + 10);
              doc.font("Helvetica");
              var VTotal = 0;
              var TotQuant = 0;

              //loop nos dados
              for (i = 0; i < response[0].itens.length; i++) {
                doc.switchToPage(page);
                const item = response[0].itens[i];
                position = position + 15;
                VTotal = VTotal + item.valorUnitario * item.quantidade;
                TotQuant = TotQuant + item.quantidade;

                if (position >= "690") {
                  doc.addPage({ size: "A4", margin: 50, bufferPages: true });
                  page = page + 1;
                  /*  doc
                      .image("./imagens/nouveau.jpeg", 400, 25, {
                        width: 150,
                        align: "right",
                      })
                      .fontSize(8);
  */
                  position = 90;
                }

                generateTableRow(
                  doc,
                  position,
                  item.item.codigo,
                  item.item.nome,
                  item.item.grade,
                  formatDecimal(item.quantidade),
                  item.unidadeCodigo,
                  formatCurrency(item.valorUnitario),
                  formatCurrency(item.valorUnitario * item.quantidade),
                );

                var espaco = item.item.nome.length > 45 ? 17 : 12;
                geraHR(doc, position + espaco);
              }
              const TotalPosition = position + 25;
              doc.font("Helvetica-Bold");
              generateTableRow(
                doc,
                TotalPosition,
                "",
                "",
                "Total Quantidade",
                formatDecimal(TotQuant),
                "",
                "Valor Total",
                formatCurrency(VTotal),
              );
              doc.font("Helvetica");
              position = position + 65;
              if (position >= "650") {
                doc.addPage({ size: "A4", margin: 50, bufferPages: true });
                page = page + 1;
                /*  doc
                    .image("./imagens/nouveau.jpeg", 400, 25, {
                      width: 150,
                      align: "right",
                    })
                    .fontSize(8);
  */
                position = 90;
              }

              doc.fontSize(10).text("Observações:", 30, position);
              geraHR(doc, position + 10);

              doc
                .fontSize(7)

                .text(
                  `${response[0] ? response[0].observacoes.replace(/\r\n+/g, "\n") : ""}`,
                  30,
                  position + 20,
                  { align: "justify" },
                );
            }

            function generateFooter(doc) {
              doc
                .fontSize(10)
                .text("_______________________________", 50, 760, {
                  align: "center",
                  width: 500,
                })
                .text(`${response[0] ? response[0].conta.nome : ""}`, 50, 780, {
                  align: "center",
                  width: 500,
                });
              const range = doc.bufferedPageRange();

              var j = 0;

              for (let j = 0; j < 0 + range.count; j++) {
                doc.switchToPage(j);
                geraHR(doc, doc.page.height - 17);

                doc
                  .fontSize(8)
                  .text(
                    `Powered by SalesBreath - contato@breathitsolutions.com.br      Página ${
                      j + 1
                    } of ${range.count}`,
                    200,
                    doc.page.height - 15,
                    { height: 15 },
                  );
              }
            }

            function generateTableRow(
              doc,
              y,
              codigo,
              descricao,
              grade,
              quantidade,
              un,
              valor_un,
              valor_total,
            ) {
              doc
                .fontSize(6)
                .text(codigo, 30, y)
                .text(descricao, 100, y, { width: 100, align: "left" })
                .text(grade, 250, y, { width: 90, align: "left" })
                .text(quantidade, 320, y, { width: 90, align: "center" })
                .text(un, 370, y, { width: 90, align: "center" })
                .text(valor_un, 410, y, { width: 90, align: "center" })
                .text(valor_total, 510, y, { width: 90, align: "left" });
            }

            function geraHR(doc, y) {
              doc
                .strokeColor("#aaaaaa")
                .lineWidth(1)
                .moveTo(20, y)
                .lineTo(580, y)
                .stroke();
            }

            function formatCurrency(numero) {
              return (
                "R$ " +
                numero
                  .toFixed(2)
                  .replace(".", ",")
                  .replace(/(\d)(?=(\d{3})+\,)/g, "$1.")
              );
            }
            function formatDecimal(numero) {
              return numero
                .toFixed(2)
                .replace(".", ",")
                .replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
            }

            function formatDate(data) {
              return data.substr(0, 10).split("-").reverse().join("/");
            }

            let doc = new PDFDocument({
              size: "A4",
              margin: 50,
              bufferPages: true,
            });

            geraCabecalhoEmpresa(doc);
            geraCabecalhoCliente(doc);
            geraTituloimpressos(doc, dados);
            geraTabeladeDados(doc, dados);
            generateFooter(doc);

            doc.flushPages();
            const writeStream = doc.pipe(fs.createWriteStream(`${url}`));
            doc.end();
            const promise = new Promise((resolve, reject) => {
              writeStream.on("finish", () => {
                writeStream.end();
                resolve(url);
              });
            });

            setTimeout(() => {
              resolved(url);
            }, 4000);
          });
        }
      };

      const pedidos_gerados = [];
      for (let index = 0; index < reqData.pedidos.length; index++) {
        //loop para gerar e enviar os pedidos

        const arquivo_gerado = await grv_arq(index);
        try {
          if (fs.existsSync(arquivo_gerado)) {
            pedidos_gerados.push({
              pedido: reqData.pedidos[index].numero,
              url: arquivo_gerado,
              status: "ok",
            });
          } else {
            pedidos_gerados.push({ url: arquivo_gerado, status: "nok" });
          }
        } catch (err) {
          console.error(err);
        }
      }
      //     console.log(pedidos_gerados);
      return pedidos_gerados;
    }
  } catch (error) {
    console.error("error -> ", logStruct("fetchimpressos", error));
    return errorResponse(error.status, error.message);
  }
};

exports.geraHR = async (doc, y) => {
  return doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(20, y)
    .lineTo(580, y)
    .stroke();
};

exports.field = async (
  doc,
  font,
  size,
  field,
  fieldx,
  fieldy,
  width,
  height,
  align,
  color,
) => {
  return doc
    .font(`${font}`)
    .fontSize(size)
    .fillColor(color ? color : "black")
    .text(`${field}`, fieldx, fieldy, {
      width: width,
      height: height,
      align: `${align}`,
    });
};

exports.fieldImage = async (
  doc,
  field,
  fieldx,
  fieldy,
  width,
  height,
  align,
) => {
  return doc.image(`${field}`, fieldx, fieldy, {
    width: width,
    height: height,
    align: `${align}`,
  });
};
