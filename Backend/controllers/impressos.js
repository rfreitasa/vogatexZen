const impressosModel = require("../models/impressos");
const clientesModel = require("../models/clientes");
const empresaModel = require("../models/empresa");
const produtosModel = require("../models/produtos");
const organizacaoModel = require("../models/organizacao");
const pedidosModel = require("../models/pedidos");
const {
  validaImpressoPedido,
  validaImpressoProduto,
} = require("../validators/impressos");
const { successResponse, errorResponse } = require("../libs/response");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const moment = require("moment-timezone");
const nodemailer = require("nodemailer");
const { PNG } = require("pngjs");
const imageType = require("image-type");
const pngToJpeg = require("png-to-jpeg");
const { EMAIL, API,ERP_CONF } = require("../configuration/api");
const savefile = require("../libs/functions");
const { stringify } = require("querystring");


const path = require('path');
const axios = require('axios');

const logStruct = (func, error) => {
  return { func: func, file: "impressosController", error };
};

const printRomaneio = async (reqData) => {
  try {
   
    reqData.usuario = reqData.email;
    var get_romaneiopdf = await savefile.gera_romaneio_impresso(reqData);
    return successResponse(200, get_romaneiopdf);


  } catch (err) {
    return errorResponse(404, "RomaneioNotfound");
  }
};
const printPedido = async (reqData) => {
  try {
   
    reqData.usuario = reqData.email;
    var pedidos = [];
    pedidos.push({ numero: reqData.numero_pedido });
    reqData.pedidos = pedidos;
    var get_pedidopdf = await savefile.gera_pedido_impresso(reqData);
    //console.log(JSON.stringify(get_pedidopdf));
    // for (let index = 0; index < get_pedidopdf.length; index++) {
    //loop para gerar e enviar os pedidos

    // var i = get_pedidopdf[index];
    //   if (i.status === "ok") {
    if (reqData.sendto) {
      
      //  enviar email
      const get_mail = await savefile.sendmail(
        reqData.sendto,
        `Pedido ${reqData.numero_pedido}`,
        reqData.assunto,
        get_pedidopdf,
        reqData.empresa?reqData.empresa:reqData.empresa_id
      ); //(emails,titulo,descricao,caminho_anexo)
      return successResponse(200, get_mail);
    }
    return successResponse(200, get_pedidopdf);


  } catch (err) {
    return errorResponse(404, "PedidoNotfound");
  }
};

/*
const  printPedido = async (reqData) => {
  try {
    var result='';
    var url ='';
    const   agora = moment().tz("America/Sao_Paulo").format('DD-MM-YYYY HH:mm:ss');

      const  validInput = validaImpressoPedido(reqData);
      const dados_usuario = await clientesModel.getUserInformation(reqData.email);
      const dados_conexao = await organizacaoModel.getConnectionData();
    
      if(dados_usuario[0] && dados_conexao){
        //////////////////REGRA PEDIDOS////////////////////////// 
        //VENDEDOR SÓ CONSEGUIRÁ IMPRIMIR OS PEDIDOS DELE, 
          
    //                console.log(reqData);
                    const response = await pedidosModel.getpedido(reqData);
                    console.log('222222');
                          
                    if (response && !response.length) {
                            return errorResponse(404, 'PedidoNotfound');
                    }
                    else{
                               // if(Number(response[0].vendedor.id)!==Number(dados_usuario[0].USUARIO_CONTA_ID_ERP)){
                                  
                                 //     return errorResponse(404, 'Sem permissao para visualizar esse pedido');
                               // } 
                               // else{
      


                                          const empresaERP = await empresaModel.getEmpresaERPById(response[0].empresa.id);
                                          const responseCliente  = await clientesModel.getContaById(response[0].conta.id);                                          
                                          const contatoCliente   = await clientesModel.getContatosByClienteId(response[0].conta.id);
                                          const contatoVendedor   = await clientesModel.getContatosByClienteId(response[0].vendedor.id);

                                          const sleep = (milliseconds) => {
                                            return new Promise(resolve => setTimeout(resolve, milliseconds))
                                          }
                                    
          
                                          const grv_arq = () => {
                                               return new Promise((resolved, rejectd) => { 
                                                                var telefoneCliente = contatoCliente.filter(function(item) {  
                                                                        return  item.tipo== 'TELEFONE';  
                                                                  });
                                                                  var telefoneVendedor = contatoVendedor.filter(function(item) {  
                                                                        return  item.tipo== 'TELEFONE';  
                                                                  });

                                                                  const dados = response[0].itens;
                                                                    console.log(response[0]);
                                                                  //gerando o Pedido //caceçalho    
                                                                  function geraCabecalhoEmpresa(doc) {
                                                                                
                                                                                        geraHR(doc, 15);
                                                                                        doc
                                                                                          //PRIMEIRA LINHA
                                                                                          .fontSize(10)
                                                                                          .text("Empresa:", 30, 20)
                                                                                          
                                                                                          .fontSize(8)
                                                                                          .text(`${response[0].empresa?response[0].empresa.nome:''}`,80,21)
                                                                                  
                                                                                          //2 LINHA
                                                                                          .fontSize(10)
                                                                                          .text("Endereço:", 30,35)
                                                                                          
                                                                                          .fontSize(8)
                                                                                          .text(`${empresaERP[0]?empresaERP[0].ENDERECO:''} , ${empresaERP[0]?empresaERP[0].NUMERO:''} - ${empresaERP[0]?empresaERP[0].BAIRRO:''}`,80,36)
                                                                                          
                                                                                          //3 LINHA
                                                                                          .fontSize(10)
                                                                                          .text("Cep:", 30, 50)
                                                                                          
                                                                                          .fontSize(8)
                                                                                          .text(`${empresaERP[0]?empresaERP[0].CEP:''}`,80,51)
                                          
                                                                                          //4 LINHA
                                                                                          .fontSize(10)
                                                                                          .text("Telefone:", 30, 65)

                                                                                          
                                                                                          .fontSize(8)
                                                                                          .text(`${empresaERP[0]?empresaERP[0].FONE1:''}`,80,66)
                                          
                                                                                          .fontSize(10)
                                                                                          .text("Email:", 160, 65)
                                                                                          
                                                                                          .fontSize(8)
                                                                                          .text(`${empresaERP[0]?empresaERP[0].EMAIL:''}`,190,66)
                                                                                          
                                          
                                                                                          //5 LINHA
                                                                                          .fontSize(10)
                                                                                          .text("CNPJ:", 30, 80)
                                          
                                                                                          .fontSize(8)
                                                                                          .text(`${empresaERP[0]?empresaERP[0].CGC:''}`,80,81)
                                          
                                                                                          .fontSize(10)
                                                                                          .text("Inscrição Estadual:", 160, 80)
                                          
                                                                                          .fontSize(8)
                                                                                          .text(`${empresaERP[0]?empresaERP[0].INSCRICAO:''}`,250,81)
                                                                                          doc.image("./imagens/nouveau.jpeg", 400, 25, { width: 150 , align:"right" })  
                                                                                          .text("Impresso gerado em "+ agora, 200, 80, { align: "right" })
                                                                                          geraHR(doc, 95);
                                          
                                                                      
                                                                    }
                                                              
                                                                    
                      
                       
                                                                    function geraCabecalhoCliente(doc) {
                                                                                                //console.log(responseCliente);
                                                                                                                    
                                                                                          geraHR(doc, 100);
                                                                                          doc
                                                                                            //PRIMEIRA LINHA
                                                                                            .fontSize(10)
                                                                                            .text("Conta:", 30, 110)
                                                                                            
                                                                                            .fontSize(8)
                                                                                            .text(`${response[0]?response[0].conta.id:''} - ${response[0]?response[0].conta.nome:''} `,70,111)
                                          
                                                                                            //PRIMEIRA LINHA LADO DIREITO
                                                                                            .fontSize(10)
                                                                                            .text("Numero do Pedido:", 320, 110)
                                          
                                                                                            .fontSize(8)
                                                                                            .text(`${response[0]?response[0].numeroSistema:''}`,420,111)
                                          
                                          
                                          
                                                                                            //2 LINHA
                                                                                            .fontSize(10)
                                                                                            .text("CNPJ:", 30,125)
                                                                                            
                                                                                            .fontSize(8)
                                                                                            .text(`${responseCliente[0]?responseCliente[0].cnpj:''}`,70,126)
                                                                                        
                                                                                            
                                                                                            //2 LINHA LADO DIREITO
                                                                                            .fontSize(10)
                                                                                            .text("Referência:", 320,125)
                                                                                            
                                                                                            .fontSize(8)
                                                                                            .text(`${response[0]?response[0].referencia:''} `,380,126)
                                                                                            
                                          
                                                                                            //3 LINHA
                                                                                            .fontSize(10)
                                                                                            .text("Inscrição estadual:", 30, 140)
                                                                                            
                                                                                            .fontSize(8)
                                                                                            .text(`${responseCliente[0]?responseCliente[0].inscricaoEstadual:''}`,130,141)
                                          
                                          
                                                                                            //3 LINHA LADO DIREITO
                                                                                            .fontSize(10)
                                                                                            .text("Emissão:", 320,140)
                                                                                            
                                                                                            .fontSize(8)
                                                                                            .text(formatDate(`${response[0]?response[0].emissao:''} `),380,141)
                                                                                            
                                          
                                                                                            //4 LINHA
                                                                                            .fontSize(10)
                                                                                            .text("Endereço:", 30, 155)
                                                                                            
                                                                                            .fontSize(8)
                                                                                            .text(`${responseCliente[0]&&responseCliente[0].enderecoLogradouro?responseCliente[0].enderecoLogradouro:''} , ${responseCliente[0]&&responseCliente[0].enderecoNumero?responseCliente[0].enderecoNumero:''}  ${responseCliente[0]&&responseCliente[0].enderecoBairro?responseCliente[0].enderecoBairro:''}`,80,156)
                                                                                            
                                                                                            //4 LINHA LADO DIREITO
                                                                                            .fontSize(10)
                                                                                            .text("Entrega:", 320,155)
                                                                                            
                                                                                            .fontSize(8)
                                                                                            .text(formatDate(`${response[0]?response[0].previsao:''}`),380,156)
                                          
                                                                                            //5 LINHA
                                                                                            .fontSize(10)
                                                                                            .text("CEP:", 30, 170)
                                          
                                                                                            .fontSize(8)
                                                                                            .text(`${responseCliente[0]?responseCliente[0].enderecoCidade:''} / ${responseCliente[0]?responseCliente[0].enderecoEstado:''} - ${responseCliente[0]?responseCliente[0].enderecoCep:''}`,70,171)
                                          
                                                                                            //5 LINHA LADO DIREITO
                                                                                            .fontSize(10)
                                                                                            .text("Condições de Pagamento:", 320,170)
                                                                                            
                                                                                            .fontSize(8)
                                                                                            .text(`${response[0]?response[0].prazoPagto: ''}`,450,171)
                                          
                                          
                                          
                                                                                            //6 LINHA
                                                                                            .fontSize(10)
                                                                                            .text("Telefone:", 30, 185)
                                          
                                                                                            .fontSize(8)
                                                                                            .text(`${telefoneCliente[0]?telefoneCliente[0].descricao: ''}`,70,186)
                                          
                                          
                                                                                            //6 LINHA LADO DIREITO
                                                                                            .fontSize(10)
                                                                                            .text("Vendedor:", 320,185)
                                                                                            
                                                                                            .fontSize(8)
                                                                                            .text(`${response[0]?response[0].vendedor.nome:''}`,375,186)
                                          
                                          
                                                                                            //7 LINHA
                                                                                            .fontSize(10)
                                                                                            .text("Tipo de frete:", 30, 200)
                                          
                                                                                            .fontSize(8)
                                                                                            .text(`${response[0]?response[0].tipoFrete:''}`,100,201)
                                          
                                          
                                                                                            //7 LINHA LADO DIREITO
                                                                                            .fontSize(10)
                                                                                            .text("Telefone:", 320,210)
                                                                                            
                                                                                            .fontSize(8)
                                                                                            .text(`${telefoneVendedor[0]?telefoneVendedor[0].descricao: ''}`,370,211)
                                          
                                          
                                                                                            //8 LINHA
                                                                                            .fontSize(10)
                                                                                            .text("Transportadora:", 30, 215)
                                          
                                                                                            .fontSize(8)
                                                                                            .text(`${response[0] && response[0].transportadora?response[0].transportadora.nome:''}`,120,216)
                                          
                                                                                            geraHR(doc, 230);
                                                                                            geraHR(doc, 235);
                                          
                                                                                            //1 LINHA
                                                                                            doc
                                                                                            .fontSize(10)
                                                                                            .text("Status do pedido:", 30, 240)
                                          
                                                                                            .fontSize(8)
                                                                                            .text(`${response[0]?response[0].status:''}`,120,241)
                                          
                                                                                            geraHR(doc, 320);
                                          
                                          
                                                                        
                                                                      }
                      
                      
                      
                                                                  function geraTituloimpressos(doc,dados) {
                                                                                            doc
                                                                                              .fillColor("#444444")
                                                                                              .fontSize(10)
                                                                                              .font("Helvetica-Bold")
                                                                                              .text(`Itens do pedido de Venda`, 50, 290,{ align: "center" });
                                                                                          
                                                                                            geraHR(doc, 305);
                                              
                                                                  }
                                                          
                                                                  function geraTabeladeDados(doc,dados) {
                                                                                              var    posicaoInicial = 310;
                                                                                              const  posicaoFinal = 770;
                                                                                              var    position =310;
                                                                                              var    page =0;
                                                                                            
                                                                                              
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
                                                                                                                "Valor total"
                                                                                                            );
                                                                                              geraHR(doc,posicaoInicial + 10);
                                                                                              doc.font("Helvetica");
                                                                                              var VTotal=0;
                                                                                              var TotQuant =0;
                                                                                              
                                                                                              //loop nos dados 
                                                                                              for (i = 0; i < response[0].itens.length; i++) {
                                                                                                
                                                                                                            doc.switchToPage(page); 
                                                                                                            const    item = response[0].itens[i];
                                                                                                            position = position + 15;
                                                                                                            VTotal = VTotal + (item.valorUnitario * item.quantidade);
                                                                                                            TotQuant = TotQuant + item.quantidade;
                                                                                                            
                                                                                                            if(position>='770'){
                                                                                                
                                                                                                              doc.addPage({ size: "A4", margin: 50,bufferPages:true});
                                                                                                              page = page +1;
                                                                                                              doc.image("./imagens/nouveau.jpeg", 400, 25, { width: 150 , align:"right" })  
                                                                                                              .fontSize(8)
                                                                                                              
                                                                                                              position=70;
                                                                                                              
                                                                                                            }
                                                                              
                                                                                                              generateTableRow(
                                                                                                                          doc,
                                                                                                                          position,
                                                                                                                          item.item.id,
                                                                                                                          item.item.nome,
                                                                                                                          item.item.grade,
                                                                                                                          formatDecimal(item.quantidade),
                                                                                                                          item.unidadeCodigo,
                                                                                                                          formatCurrency(item.valorUnitario),
                                                                                                                          formatCurrency(item.valorUnitario*item.quantidade)
                                                                                                              );
                                                                                                          
                                                                                                                        geraHR(doc, position + 8);
                                                                                                }
                                                                                              
                                                                                            
                                                                                                const   TotalPosition = position + 25;
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
                                                                                                  formatCurrency(VTotal)
                                                                                                );
                                                                                                doc.font("Helvetica");
                                                                  }
                                                                  
                                                                  function generateFooter(doc) {
                                                                          doc
                                                                            .fontSize(10)
                                                                            .text(
                                                                              "_______________________________",
                                                                              50,
                                                                              760,
                                                                              { align: "center", width: 500 }
                                                                            ).text(
                                                                              `${response[0]?response[0].conta.nome:''}`,
                                                                              50,
                                                                              780,
                                                                              { align: "center", width: 500 }
                                                                            );
                                                                            const range = doc.bufferedPageRange(); 
                                                                          
                                                                            var j=0;
                                                                            
                                                                            for( let j = 0; j <  (0 + range.count); j++) {
                            
                                                                              doc.switchToPage(j);
                                                                              geraHR(doc,doc.page.height - 17);
                            
                                                                              doc  
                                                                                .fontSize(8)
                                                                                .text(`Powered by SalesBreath - breathitsolutions@gmail.com       Página ${j + 1} of ${range.count}`, 
                                                                                        200, 
                                                                                        doc.page.height - 15, 
                                                                                        { height : 15});
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
                                                                    valor_total
                                                                  ) { 
                                                                    doc
                                                                      .fontSize(6)
                                                                      .text(codigo, 30, y)
                                                                      .text(descricao, 80, y)
                                                                      .text(grade, 180, y, { width: 90, align: "left" })
                                                                      .text(quantidade, 300, y, { width: 90, align: "center" })
                                                                      .text(un, 350, y, { width: 90, align: "center" })
                                                                      .text(valor_un, 410, y, { width: 90, align: "center" })
                                                                      .text(valor_total, 510, y, { width: 90, align: "left" })
                                                                        
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
                                                                    return "R$ " + numero.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
                                                                  }
                                                                  function formatDecimal(numero) {
                                                                    return numero.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
                                                                  }
                                                                  
                                                                  
                                                                  function formatDate(data){
                                                                    return (data.substr(0, 10).split('-').reverse().join('/'));
                      
                                                                }
                                                                
                                                                let doc = new PDFDocument({ size: "A4", margin: 50,bufferPages:true});
                                                                                                          
                                                                geraCabecalhoEmpresa(doc);
                                                                geraCabecalhoCliente(doc);
                                                                geraTituloimpressos(doc,dados);
                                                                geraTabeladeDados(doc,dados);
                                                                generateFooter(doc);
                                                                        
                                                                doc.flushPages();
                                                                 url=`./pdf/${dados_usuario[0]?dados_usuario[0].USUARIO_ID:'user'}.pdf`;
                                                                 const writeStream = doc.pipe(fs.createWriteStream(`./pdf/${dados_usuario[0]?dados_usuario[0].USUARIO_ID:'user'}.pdf`));                
                                                                doc.end();
                                                                const promise = new Promise((resolve, reject) => {
                                                                                                               console.log('5');
                                                                                                                writeStream.on('finish', () => {
                                                                                                               console.log('4');
                                                                                                               writeStream.end()
                                                                                                                  resolve(url);
                                                                                                                  
                                                                  
                                                                  
                                                                                                                });
                                                                });
                                                             
                                                                                                                /*
                                                                const doSomething = async () => {
                                                                  await sleep(5000)
                                                                console.log('esperou 5 segundos');
                                                                }
                                                                
                                                                doSomething();
*/
/*
                                                                if(reqData.sendto){

                                                                  const envia_email = async () => {
                                                                    await sleep(3000);
                                                                
                                                                  
                                                                    var  transporte =nodemailer.createTransport({
                                                                      host: `${EMAIL.conexao.host}`,
                                                                      port: `${EMAIL.conexao.port}`,
                                                                      secure: false,
                                                                      auth: {
                                                                          user: `${EMAIL.conexao.user}`,
                                                                          pass: `${EMAIL.conexao.pass}`
                                                                      }
                                                              });
                                                                                var email = {
                                                                                from: `${EMAIL.conexao.user_sent}`, // Quem enviou este e-mail
                                                                                to: `${reqData.sendto}`, // Quem receberá
                                                                                subject: `Pedido de venda ${response[0].numeroSistema}`,  // Um assunto bacana :-) 
                                                                                html: `Email enviado pelo sistema SalesBreath.`, // O conteúdo do e-mail
                                                                                attachments: [{ // Basta incluir esta chave e listar os anexos
                                                                                    filename: 'pedido.pdf', // O nome que aparecerá nos anexos
                                                                                    path: `./pdf/${dados_usuario[0].USUARIO_ID}.pdf` // O arquivo será lido neste local ao ser enviado
                                                                                  }]
                                                                                };

                                                                                transporte.sendMail(email, function(err, info){
                                                                                        if(err){
                                                                                          console.log(err);
                                                                                          return errorResponse(err.status, err.message);

                                                                                        }
                                                                                      else{     

                                                                                      }
                                                                                        
                                                                               });
                                                                               return successResponse(200,'email enviado')
                                                                             
                                                                              }
                                                                              envia_email();               
                                                                 }
                                                                 else{
                                          //                            promise.then(function(value){
                                            //                            return url;
                                              //                        })
                                          //                            return url;

                                                                }
                                                                
                          setTimeout(()=>{
                         
                            resolved(url);  
                          }
                          , 3000);    
}); 
};          
const arquivo_gerado = await grv_arq();

return successResponse(200, arquivo_gerado);
                                                 
                                                              }
                 
                                        //return respPromise;
                                          
                              
                  //  }
      
    }
    
  
  }
    catch (error) {
              console.error('error -> ', logStruct('fetchimpressos', error))
              return errorResponse(error.status, error.message);
    }

      



};

*/


const printEspec = async (where,token) => {
  //const url = encodeURIComponent(`${ERP_CONF.printSpec}?id=${where.codigo}&token=${token}&tenant=${API.tenant}`);
 
 const spec = await impressosModel.getSpec(where);
 console.log(spec)
  //var show_pdf = await savefile.get_urlPdf(url.uri);

  //var arquivo_gerado = await savefile.gera_impresso(show_pdf);
    return successResponse(201, spec, 'relatorioCriado');


};

const printEspecOld = async (reqData) => {
  try {
    var url = "";
    const agora = moment()
      .tz("America/Sao_Paulo")
      .format("DD-MM-YYYY HH:mm:ss");
    var response = await produtosModel.getProdutosDetails(
      reqData,
      reqData.token_erp,
    )


    if (response && response[0]) {
      //console.log(response2)
      //const response = await produtosModel.getEspecProduto(reqData.produto_id);

      /*  const nome_imagens_complementar = response[0].ITEM_CODIGO.normalize(
          "NFD"
        ).replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, "");
     */
      
          const saveimage = (urls) => {
            const pastaDestino = './pdf'; // Substitua 'pasta_de_destino' pelo caminho da sua pasta de destino

            // Certifique-se de que a pasta de destino existe
            if (!fs.existsSync(pastaDestino)) {
              fs.mkdirSync(pastaDestino);
            }
    
            const baixarImagem = async (url) => {
              const pastaDestino = './pdf'; // Substitua 'pasta_de_destino' pelo caminho da sua pasta de destino
            
              // Certifique-se de que a pasta de destino existe
              if (!fs.existsSync(pastaDestino)) {
                fs.mkdirSync(pastaDestino);
              }
            
              const nomeArquivo = path.basename(url);
              const caminhoLocal = path.join(pastaDestino, nomeArquivo);
            
              try {
                // Adiciona um atraso de 3 segundos antes de fazer a solicitação
                await new Promise(resolve => setTimeout(resolve, 2000));
            
                const response = await axios.get(url, { responseType: 'arraybuffer' });
                fs.writeFileSync(caminhoLocal, Buffer.from(response.data));
                return caminhoLocal;
              } catch (error) {
                console.error(`Erro ao baixar imagem: ${url}`, error.message);
                throw error;
              }
            };
    
            // Usando Promise.all para baixar todas as imagens de forma concorrente
            return Promise.all(urls.map(baixarImagem));
          
          
      
          };
      
      function baixarImagens(urls) {
        const pastaDestino = './pdf'; // Substitua 'pasta_de_destino' pelo caminho da sua pasta de destino

        // Certifique-se de que a pasta de destino existe
        if (!fs.existsSync(pastaDestino)) {
          fs.mkdirSync(pastaDestino);
        }

        // Função para baixar uma única imagem
        const baixarImagem = (url) => {
          const nomeArquivo = path.basename(url);
          const caminhoLocal = path.join(pastaDestino, nomeArquivo);

          return axios.get(url, { responseType: 'arraybuffer' })
            .then(response => {
              fs.writeFileSync(caminhoLocal, Buffer.from(response.data));
              return caminhoLocal;
            })
            .catch(error => {
              console.error(`Erro ao baixar imagem: ${url}`, error.message);
              throw error;
            });
        };

        // Usando Promise.all para baixar todas as imagens de forma concorrente
        return Promise.all(urls.map(baixarImagem));
      }

      function obterImagensTextileCare(dados) {
        const prefixoImagem = 'https://zenerp.s3.amazonaws.com/public/material/images/';

        const imagensTextileCare = [];

        dados.forEach(produto => {
          if (produto.properties) {
            // Filtra as propriedades do produto para aquelas que começam com 'textileCare'
            const textileCareProps = Object.keys(produto.properties)
              .filter(prop => prop.startsWith('textileCare'))
              .map(prop => produto.properties[prop]);

            // Adiciona os caminhos das imagens à lista
            imagensTextileCare.push(
              ...textileCareProps.filter(img => img).map(img => `${prefixoImagem}${img}`)
            );
          }



        });

        return imagensTextileCare;
      }



      const geradoc = () => {
        return new Promise((resolvetd, rejecttd) => {
          //gerando o Pedido //caceçalho
          function geraCabecalhoEmpresa(doc) {
            doc
              //PRIMEIRA LINHA
              .fontSize(10)
              .text("Ficha técnica do produto", 30, 20);
            geraHR(doc, 30);

            doc
              .fontSize(8)
              .text("Impresso gerado em " + agora, 230, 50, { align: "right" });
            //  geraHR(doc, 95);
          }

          function geraCabecalhoProduto(doc) {
            //console.log(responseCliente);

            doc

              .fontSize(14)
              .text(
                `${response[0]
                  ? response[0].code + "  -  " + response[0].description
                  : null
                }`,
                30,
                50
              );
            geraHR(doc, 65);
            doc


              //PRIMEIRA LINHA LADO DIREITO
              .fontSize(8)
              .text("Composição:", 30, 80)

              .fontSize(6)
              .text(`${response[0].properties ? response[0].properties.textileComposition : ''}`, 120, 81)

              //2 LINHA
              .fontSize(8)
              .text("Largura (m):", 30, 90)

              .fontSize(6)
              .text(`${response[0].properties ? response[0].properties.textileWidth : ''}`, 120, 91)

              //3 LINHA
              .fontSize(8)
              .text("Rendimento:", 30, 100)

              .fontSize(6)
              .text('', 120, 101)

              //4 LINHA
              .fontSize(8)
              .text("Gramatura (kg/m linear):", 30, 110)

              .fontSize(6)
              .text(`${response[0].properties ? response[0].properties.textileGramWeight : ''}`,
                120,
                111
              )

              //5 LINHA

              .fontSize(8)
              .text("País Origem:", 30, 120)

              .fontSize(6)
              .text(`${response[0].properties ? response[0].properties.textileCountry : null}`, 120, 121)

              //7 LINHA
              .fontSize(8)
              .text("Classificação fiscal:", 30, 130)

              .fontSize(6)
              .text(
                `${response[0].properties ? response[0].properties.fiscal_br_NCM : null}`,
                120,
                131
              );

            //1 LINHA
            doc.fontSize(8).text("Processo de lavagem", 30, 150);

           // const imagensTextileCare = obterImagensTextileCare(response);
            //        const caminhosLocaisImagens = await baixarImagens(imagensTextileCare);

            // Chama a função baixarImagens e manipula o resultado usando .then()
            imagem.forEach((caminhoLocal, index) => {
         

              doc.image(caminhoLocal, 30 + index * 50, 165, {
                width: 35,
                height: 35,
                align: 'left',
              });
            });
          
            // Baixar e salvar localmente cada imagem
            // Baixar e salvar localmente cada imagem

            geraHR(doc, 160);
            //Aqui ficará as imagens

          

            /*
          response[0].IMAGEM02
            ? doc.image(`./pdf/${nome_imagens_complementar}02.png`, 80, 165, {
                width: 35,
                height: 35,
                align: "left",
              })
            : "";
          response[0].IMAGEM03
            ? doc.image(`./pdf/${nome_imagens_complementar}03.png`, 130, 165, {
                width: 35,
                height: 35,
                align: "left",
              })
            : "";
          response[0].IMAGEM04
            ? doc.image(`./pdf/${nome_imagens_complementar}04.png`, 180, 165, {
                width: 35,
                height: 35,
                align: "left",
              })
            : "";
          response[0].IMAGEM05
            ? doc.image(`./pdf/${nome_imagens_complementar}05.png`, 230, 165, {
                width: 35,
                height: 35,
                align: "left",
              })
            : "";
          response[0].IMAGEM06
            ? doc.image(`./pdf/${nome_imagens_complementar}06.png`, 270, 165, {
                width: 35,
                height: 35,
                align: "left",
              })
            : "";
          response[0].IMAGEM07
            ? doc.image(`./pdf/${nome_imagens_complementar}07.png`, 320, 165, {
                width: 35,
                height: 35,
                align: "left",
              })
            : "";
          response[0].IMAGEM08
            ? doc.image(`./pdf/${nome_imagens_complementar}08.png`, 370, 165, {
                width: 35,
                height: 35,
                align: "left",
              })
            : "";
          response[0].IMAGEM09
            ? doc.image(`./pdf/${nome_imagens_complementar}09.png`, 320, 165, {
                width: 35,
                height: 35,
                align: "left",
              })
            : "";
          response[0].IMAGEM10
            ? doc.image(`./pdf/${nome_imagens_complementar}10.png`, 370, 165, {
                width: 35,
                height: 35,
                align: "left",
              })
            : "";
 
       */


            // var buf =  Buffer.from(response[0].IMAGEM01, 'base64');
            var fs = require("fs");
          }

          function generateFooter(doc) {
            const range = doc.bufferedPageRange();

            var j = 0;

            for (let j = 0; j < 0 + range.count; j++) {
              doc.switchToPage(j);
              geraHR(doc, doc.page.height - 17);

              doc
                .fontSize(8)
                .text(
                  `Powered by SalesBreath - contato@breathitsolutions.com.br       Página ${j + 1
                  } of ${range.count}`,
                  200,
                  doc.page.height - 15,
                  { height: 15 }
                );
            }
          }

          function geraHR(doc, y) {
            doc
              .strokeColor("#aaaaaa")
              .lineWidth(1)
              .moveTo(20, y)
              .lineTo(580, y)
              .stroke();
          }

          let doc = new PDFDocument({
            size: "A4",
            margin: 50,
            bufferPages: true,
          });

          geraCabecalhoEmpresa(doc);
          geraCabecalhoProduto(doc);
          generateFooter(doc);

          /*
                                                doc.pipe(fs.createWriteStream(`./pdf/espec.pdf`));                
                                                    
  
                                              doc.end();
                                                  */

          // Wait for the promise to get resolved...

          doc.pipe(fs.createWriteStream(`./pdf/espec.pdf`));
          doc.end();

          setTimeout(() => {
            resolvetd();
          }, 3000);

          //  return successResponse(200, url);
        });
      };
      const imagensTextileCare = obterImagensTextileCare(response);
      const imagem = await saveimage(imagensTextileCare);
      const documento = await geradoc();
      for (var i = 1; i < 10; i++) {
        x = String(i).padStart(2, "0");
        try {
          fs.unlinkSync(`./pdf/${nome_imagens_complementar}${x}.png`, function (
            err
          ) {
            if (err) {
              console.info("File doesn't exist, won't remove it.");
            }
          });
        } catch (error) { }
      }

      return successResponse(200, "./pdf/espec.pdf");
    }
    else {
      return errorResponse('520', 'no files');

    }
  } catch (error) {
    console.error("error -> ", logStruct("fetchprodutos", error));
    return errorResponse(error.status, error.message);
  }
};

module.exports = {
  printPedido,
  printEspec,
  printRomaneio
};
