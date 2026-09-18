const pedidosModel = require("../models/pedidos");
const clientesModel = require("../models/clientes");
const organizacaoModel = require("../models/organizacao");
const empresaModel = require("../models/empresa");
const utilitiesModel = require("../models/utilities");
const regrasModel = require("../models/regras");
const campaignModel = require("../models/campaigns");

const { successResponse, errorResponse } = require("../libs/response");
const {
  validatePedidos,
  validaPedidodeVenda,
  validatePedidosSql,
} = require("../validators/pedidos");
const { urlencoded } = require("express");

const logStruct = (func, error) => {
  return { func: func, file: "pedidosController", error };
};

function clientePossuiCampanha(campanhas, cliente) {
  const tagsCliente = cliente[0].tags ? cliente[0].tags.split(",") : [];

  const campanhaEncontrada = campanhas.find((campanha) => {
    const nomeCampanhaFormatado =
      "campaign" +
      campanha.CAMPANHA_NOME.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "_");
    return tagsCliente.includes(nomeCampanhaFormatado);
  });

  if (campanhaEncontrada) {
    // Retorna o nome no formato da tag (campaignVendas_ano)
    return {
      ...campanhaEncontrada,
      CAMPANHA_NOME_TAG:
        "campaign" +
        campanhaEncontrada.CAMPANHA_NOME.normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/\s+/g, "_"),
    };
  }

  return null;
}

function groupBy(arrayDados, keyGetter) {
  //função para agrupar itens pelo tipo de venda, identico ao groupBY do MYSQL
  const map = new Map();
  arrayDados.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

const gerarPedido = async (reqData) => {
  //valida se os dados foram enviados no post. (campos preenchidos)
  //const validInput = validaPedidodeVenda(reqData)

  console.log(reqData)

  var registro = "1";
  var dados_cliente = {};
  var dados_vendedor = {};
  try {
    if (reqData.items && reqData.items.length > 0) {
      //Verifica se há itens para inclusão
      reqData.id = reqData.vendedor_id;

      //Obtem a comissão baseada no vendedor

      var comissao = null;
      var comissao_list = null;
      //Regra Obtem primeiramente a comissao do cliente , caso nao exista do vendedor , caso nao exista da  lista

      const lista_preco = await regrasModel.getListaPrecosByName(
        reqData.items[0].LISTA_PRECO
      );

      //const saleprofile = reqData.items[0].SALEPROFILE?reqData.items[0].SALEPROFILE:null; //obtem o saleprofile_id se existir
      dados_cliente.id = reqData.cliente_id;
      dados_cliente.token_erp = reqData.token_erp;

      dados_vendedor.id = reqData.vendedor_id;
      dados_vendedor.token_erp = reqData.token_erp;

      const comissao_cliente = await clientesModel.getContaById(dados_cliente);
      const comissao_vendedor = await clientesModel.getContaById(
        dados_vendedor
      );
      const comissao_lista = await pedidosModel.getcomissionlist(
        reqData.items[0].LISTA_PRECO
      );

      var campanhas = await campaignModel.getCampaignsActive(reqData);

      if (campanhas && campanhas[0]) {
        const possuiCampanha = clientePossuiCampanha(
          campanhas,
          comissao_cliente
        );

        if (possuiCampanha) {
          reqData.CAMPANHA_NOME_TAG = possuiCampanha.CAMPANHA_NOME_TAG;
        }
      } else {
        console.log("nao ha camanhas pra esse cliente ");
      }

      if (
        comissao_lista[0] &&
        comissao_lista[0].LISTA_PRECOS_PERCENTUAL_COMISSAO_DEFAULT > 0
      ) {
        comissao_list =
          comissao_lista[0].LISTA_PRECOS_PERCENTUAL_COMISSAO_DEFAULT;
      }
       comissao =
      comissao_cliente?.[0]?.properties?.salesCommission > 0
        ? comissao_cliente[0].properties.salesCommission
        : comissao_vendedor?.[0]?.properties?.salesCommission > 0
        ? comissao_vendedor[0].properties.salesCommission
        : comissao_list ?? 0;


      //obtendo perfil fiscal e de venda
      var perfil_fiscal = "";
      const response = await empresaModel.getEmpresaById_ERP(
        reqData.empresa_id
      );

      if (reqData.items[0].PROGRAMACAO_NUMERO != "P.E") {
        if (response && response[0]) {
          if (
            response[0].EMPRESA_PERFIL_FISCAL != "" &&
            response[0].EMPRESA_PERFIL_FISCAL != null
          ) {
            perfil_fiscal = response[0].EMPRESA_PERFIL_FISCAL;
          } else {
            const responsef = await utilitiesModel.getperfilFiscal(reqData);
            perfil_fiscal = responsef[0]
              ? responsef.filter((item) => item.code == "Venda")[0].id
              : "";
          }
          
          if (
            response[0].EMPRESA_PERFIL_VENDA_PRG != "" &&
            response[0].EMPRESA_PERFIL_VENDA_PRG != null
          ) {
            reqData.perfil_vendas = response[0].EMPRESA_PERFIL_VENDA_PRG;
          }
        }
      } else {
        if (response && response[0]) {
          if (
            response[0].EMPRESA_PERFIL_FISCAL != "" &&
            response[0].EMPRESA_PERFIL_FISCAL != null
          ) {
            perfil_fiscal = response[0].EMPRESA_PERFIL_FISCAL;
          } else {
            const response = await utilitiesModel.getperfilFiscal(reqData);
            perfil_fiscal = response[0]
              ? response.filter((item) => item.code == "Venda")[0].id
              : "";
          }
        }
      }
      if (reqData.cliente_id_entrega != "") {
        const response = await utilitiesModel.getperfilFiscal(reqData);
        perfil_fiscal = response[0]
          ? response.filter((item) => item.code == "VendaOrdem")[0].id
          : "";
      }

      //acima ele verifica se foi escolhido um perfil de vendas  e no caso de programacao ele obtem do cadastro do SB
      //Porem ha uma nova regra: caso exista um perfil de vendas vindo da API de estoque e gravada em SALEPROFILE em CARRINHO_ITEM, usar ela.
      
      if(reqData.items[0].SALEPROFILE!=null){
        reqData.perfil_vendas= reqData.items[0].SALEPROFILE
      }
      const geraPedido = await pedidosModel.geraPedidoNew(
        reqData,
        comissao,
        perfil_fiscal,
        Number(lista_preco[0].LISTA_PRECOS_NOME),
        Number(lista_preco[0].LISTA_PRECOS_MOEDA)
      );

      return successResponse(200, geraPedido);
    }
  } catch (error) {
    console.error("error -> ", logStruct("gerapedido", error));
    return errorResponse(error.status, error.message);
  }
};

//INSIRO CABEÇALHO
//INSIRO ITENS DO PEDIDO
//GERO OS PDFs
//NOTIFICO POR EMAIL

/*
                              let dados_carrinho = await pedidosModel.getCarrinhoItens(validInput.carrinho_id);
                             
                              function groupBy(arrayDados, keyGetter) {  //função para agrupar itens pelo tipo de venda, identico ao groupBY do MYSQL
                                            const map = new Map();
                                            arrayDados.forEach( (item) => {
                                                                      const key = keyGetter(item);
                                                                      const collection = map.get(key);
                                                                      if (!collection) {
                                                                          map.set(key, [item]);
                                                                      } else {
                                                                          collection.push(item);
                                                                      }
                                });
                                return map;
                              }
                            
                              const empresas = dados_carrinho.map(item => item.EMPRESA_ID).filter((value, index, self) => self.indexOf(value) === index);// Coleta TODOS os EMPRESA_ID (DISTINCT). Ex: [0,1,1,1,2,3,3], só trará [0,1,2,3]
                                                   
                              var numeroDePedidos = 0;

                              empresas.map((empresa,index)=>{                        
                                    var filtrado    = dados_carrinho.filter(function(obj) { return obj.EMPRESA_ID == empresa; }); // Percorre o array dados_carrinho coletando somente  os que tiverem EMPRESA_ID da variavel "eempresa"
                                    var tipos_venda = filtrado.map(item => item.TIPO_VENDA).filter((value, index, self) => self.indexOf(value) === index); //Percorre o array filtrado , filtrando os tipos de vendas distintos( mesmo que distinct(TIPO_VENDA))
                                    tipos_venda.map((item)=>{
                                    
                                              const agrupar = groupBy(filtrado, item => item.TIPO_VENDA);
                                              //console.log('gerando pedido '+numeroDePedidos);
                                              var PedidoSeparado = agrupar.get(item);
                                             if(PedidoSeparado && PedidoSeparado.length){
                                          //   let criaPedido = await pedidosModel.SalvaPedidoBD(validInput,PedidoSeparado); 
                                              console.log('entrou');
                                             }
                                             */
/*                            PedidoSeparado.map((item)=>{

                                                                console.log(item);
                                                                console.log(numeroDePedidos);
                                                              })      
                                                              numeroDePedidos++;
                                    */
/*                                                                              //console.log(JSON.stringify(teste));
                                             
                                      })
                              })
*/

const fetchPedidoByVendedor = async (reqData) => {
  try {
    const validInput = validatePedidos(reqData);

    const dados_usuario = await clientesModel.getUserInformation(reqData.email);
    const dados_conexao = await organizacaoModel.getConnectionData();

    if (dados_usuario[0] && dados_conexao) {
      //LISTARA PEDIDOS SOMENTE DO VENDEDOR
      const response = await pedidosModel.getpedidosByVendedor(
        reqData.vendedor_id,
        reqData.where
      );
      if (response && !response.length) {
        return errorResponse(404, "PedidosNotfound");
      } else {
        //desmontando os arrays  em um só.
        var newarray = [];
        response.map((item) => {
          newarray.push(item);
        });

        return successResponse(200, newarray);
      }
    }
  } catch (error) {
    console.error("error -> ", logStruct("fetchpedidos", error));
    return errorResponse(error.status, error.message);
  }
};

//GET
const fetchPedidos = async (reqData) => {
  try {
    const validInput = validatePedidos(reqData);

    const dados_usuario = await clientesModel.getUserInformation(reqData.email);

    const dados_conexao = await organizacaoModel.getConnectionData();

    if (dados_usuario[0] && dados_conexao) {
      //////////////////REGRA PEDIDOS//////////////////////////
      //VENDEDOR SÓ LISTARÁ PEDIDOS DELE,
      //OPERADOR LISTARÁ TODOS OS PEDIDOS,
      //SUPERVISOR LISTARÁ TODOS OS PEDIDOS DOS VENDEDORES DA CARTEIRA DELE

      if (dados_usuario[0].USUARIO_PERFIL === "vendedor") {
        const ArrayVendedores = await clientesModel.getArrayVendedores(
          Number(dados_usuario[0].USUARIO_ID)
        );

        reqData.where.SALESPERSON_IDS = ArrayVendedores.map((vendedor) =>
          encodeURIComponent(vendedor.USUARIO_CONTA_ID_ERP)
        );
        const response = await pedidosModel.getpedidos(reqData);
        //  console.log(response);
        var PedidoSeparado = [];

        for (const item of response) {
          var workflow = "";
          if (item.sale_status == "PREPARED" || item.status == "PREPARED") {
            if (item.workpiece && item.workpiece.workflowNode.description) {
              workflow = item.workpiece.workflowNode.description;
            } else {
              workflow = item.workflowNode_description;
            }
          } else {
            workflow = item.sale_status ? item.sale_status : item.status;
          }
          const pedido = {
            NUMERO_SISTEMA: item.sale_id ? item.sale_id : item.id,
            REFERENCIA: item.sale_code ? item.sale_code : item?.code,
            STATUS: item.sale_status ? item.sale_status : item.status,
            EMPRESA: item.company_code ? item.company_code : item.company.code,
            EMPRESA_ID: item.company_id ? item.company_id : "",

          
         
            APELIDO: item.person_name
            ? item.person_name
            : item.person.name
            ? item.person.name
            : item.person.fantasyName,

            PEDIDO_EMISSAO: item.sale_date ? item.sale_date : item.date,
            PEDIDO_DISPONIBILIDADE: item.sale_availabilityDate
              ? item.sale_availabilityDate
              : item.availabilityDate
              ? item.availabilityDate
              : "",
            TAGS: item.sale_tags ? item.sale_tags : item.tags ? item.tags : "",

            CLIENTE_CGC: "",
            CLIENTE_COD: item.person_id ? item.person_id : item.person.id,
            PEDIDO_REFERENCIA: "",
            PEDIDO_VALOR: item.saleItem_totalValue
              ? item.saleItem_totalValue
              : item.totalValue,
            NOTA_FISCAL_NUMERO: "",
            NOTA_FISCAL_EMISSAO: "",
            NOTA_FISCAL_VALOR: "",
            ROMANEIO_NUMERO: "",
            TRANSPORTADORA_NOME: item.shipping_fantasyName
              ? item.shipping_fantasyName
              : item?.personShipping?.name,
            VENDEDOR_APELIDO: item.salesperson_fantasyName
              ? item.salesperson_fantasyName
              : item?.personSalesperson?.fantasyName
              ? item?.personSalesperson?.fantasyName
              : item?.personSalesperson?.name,
            VENDEDOR_ID: item.salesperson_id
              ? item.salesperson_id
              : item.personSalesperson?.id,
            WORKFLOW: workflow,
            PEDIDO_OBSERVACAO: item.properties
              ? item.properties.comments
              : item.sale_properties
              ? item.sale_properties.comments
              : "",
            itens: "", // Adiciona o item atual ao array de itens
          };
          // Verifica se já existe um pedido com o mesmo ID
          const existingPedido = PedidoSeparado.find(
            (p) => p.NUMERO_SISTEMA === item.sale_id
          );

          if (existingPedido) {
            // Se existir, apenas adicione o item aos itens existentes
            existingPedido.itens.push(item);
          } else {
            // Se não existir, adicione o novo pedido ao array
            PedidoSeparado.push(pedido);
          }
        }

        if (
          Number(
            response[0].salesperson_id
              ? response[0].salesperson_id
              : response[0]?.sale?.personSalesperson?.id
              ? response[0]?.sale?.personSalesperson?.id
              : response[0]?.personSalesperson?.id
          ) !== Number(dados_usuario[0].USUARIO_CONTA_ID_ERP)
        ) {
          return errorResponse(
            404,
            "Sem permissao para visualizar esse pedido"
          );
        }
        if (response && !response.length) {
          return errorResponse(404, "PedidoNotfound");
        } else {
          return successResponse(200, PedidoSeparado);
        }
      } else if (
        dados_usuario[0].USUARIO_PERFIL === "supervisor" ||
        dados_usuario[0].USUARIO_PERFIL === "assistente"
      ) {
        //pega todos os IDs de seus subordinados e insere dentro de um array
        var ArrayVendedores = "";
        if (dados_usuario[0].USUARIO_PERFIL === "assistente") {
          const dados_usuario = await clientesModel.getUserInformation(
            reqData.email
          );
          ArrayVendedores = await clientesModel.getArrayVendedores(
            Number(dados_usuario[0].USUARIO_CONTA_SUPERVISOR_ID)
          );
        } else {
          ArrayVendedores = await clientesModel.getArrayVendedores(
            Number(dados_usuario[0].USUARIO_ID)
          );
        }

        //Elimina vendedores com o mesmo codigo ID ERP, senao duplicaremos o retorno dos clientes.
        ArrayVendedores = ArrayVendedores.filter(
          (li, idx, self) =>
            self
              .map((itm) => itm.USUARIO_CONTA_ID_ERP)
              .indexOf(li.USUARIO_CONTA_ID_ERP) === idx
        );
        //console.log(ArrayVendedores)

        if (!reqData.where.SALESPERSON_IDS) {
          reqData.where.SALESPERSON_IDS = ArrayVendedores.map((vendedor) =>
            encodeURIComponent(vendedor.USUARIO_CONTA_ID_ERP)
          );
        }

        const response = await pedidosModel.getpedidos(reqData);
        //  console.log(response);
        var PedidoSeparado = [];

        for (const item of response) {
          var workflow = "";
          if (item.sale_status == "PREPARED" || item.status == "PREPARED") {
            if (item.workpiece && item.workpiece.workflowNode.description) {
              workflow = item.workpiece.workflowNode.description;
            } else {
              workflow = item.workflowNode_description;
            }
          } else {
            workflow = item.sale_status ? item.sale_status : item.status;
          }
          const pedido = {
            NUMERO_SISTEMA: item.sale_id ? item.sale_id : item.id,
            REFERENCIA: item.sale_code ? item.sale_code : item?.code,
            STATUS: item.sale_status ? item.sale_status : item.status,
            EMPRESA: item.company_code ? item.company_code : item.company.code,
            EMPRESA_ID: item.company_id ? item.company_id : "",

         
            APELIDO: item.person_name
            ? item.person_name
            : item.person.name
            ? item.person.name
            : item.person.fantasyName,

            PEDIDO_EMISSAO: item.sale_date ? item.sale_date : item.date,
            PEDIDO_DISPONIBILIDADE: item.sale_availabilityDate
              ? item.sale_availabilityDate
              : item.availabilityDate
              ? item.availabilityDate
              : "",
            TAGS: item.sale_tags ? item.sale_tags : item.tags ? item.tags : "",

            CLIENTE_CGC: "",
            CLIENTE_COD: item.person_id ? item.person_id : item.person.id,
            PEDIDO_REFERENCIA: "",
            PEDIDO_VALOR: item.saleItem_totalValue
              ? item.saleItem_totalValue
              : item.totalValue,
            NOTA_FISCAL_NUMERO: "",
            NOTA_FISCAL_EMISSAO: "",
            NOTA_FISCAL_VALOR: "",
            ROMANEIO_NUMERO: "",
            PEDIDO_OBSERVACAO: item.properties
              ? item.properties.comments
              : item.sale_properties
              ? item.sale_properties.comments
              : "",
            TRANSPORTADORA_NOME: item.shipping_fantasyName
              ? item.shipping_fantasyName
              : item?.personShipping?.name,
            VENDEDOR_APELIDO: item.salesperson_fantasyName
              ? item.salesperson_fantasyName
              : item?.personSalesperson?.fantasyName
              ? item?.personSalesperson?.fantasyName
              : item?.personSalesperson?.name,
            VENDEDOR_ID: item.salesperson_id
              ? item.salesperson_id
              : item.personSalesperson?.id,
            WORKFLOW: workflow,
            itens: "", // Adiciona o item atual ao array de itens
          };

          // Verifica se já existe um pedido com o mesmo ID
          const existingPedido = PedidoSeparado.find(
            (p) => p.NUMERO_SISTEMA === item.sale_id
          );

          if (existingPedido) {
            // Se existir, apenas adicione o item aos itens existentes
            existingPedido.itens.push(item);
          } else {
            // Se não existir, adicione o novo pedido ao array
            PedidoSeparado.push(pedido);
          }
        }

        if (response && !response.length) {
          return errorResponse(404, "PedidoNotfound");
        } else {
          return successResponse(200, PedidoSeparado);
        }
      } else if (
        dados_usuario[0].USUARIO_PERFIL === "operador" ||
        dados_usuario[0].USUARIO_PERFIL === "funcionario" ||
        dados_usuario[0].USUARIO_PERFIL === "ti" ||
        dados_usuario[0].USUARIO_PERFIL === "admin_global"
      ) {
        //   console.log('000000000000000000000000000000')
        //const dados_usuario = await clientesModel.getUserInformation(reqData.email);
        var ArrayVendedores = "";
        //pega todos os IDs de seus subordinados e insere dentro de um array
        ArrayVendedores = await clientesModel.getArrayVendedoresOperador(
          Number(dados_usuario[0].USUARIO_ID)
        );

        //Elimina vendedores com o mesmo codigo ID ERP, senao duplicaremos o retorno dos clientes.
        ArrayVendedores = ArrayVendedores.filter(
          (li, idx, self) =>
            self
              .map((itm) => itm.USUARIO_CONTA_ID_ERP)
              .indexOf(li.USUARIO_CONTA_ID_ERP) === idx
        );

        const response = await pedidosModel.getpedidos(reqData);
                 console.log(response);
        var PedidoSeparado = [];

        for (const item of response) {
          var workflow = "";
          if (item.sale_status == "PREPARED" || item.status == "PREPARED") {
            if (item.workpiece && item.workpiece.workflowNode.description) {
              workflow = item.workpiece.workflowNode.description;
            } else {
              workflow = item.workflowNode_description;
            }
          } else {
            workflow = item.sale_status ? item.sale_status : item.status;
          }

          const pedido = {
            NUMERO_SISTEMA: item.sale_id ? item.sale_id : item.id,
            REFERENCIA: item.sale_code ? item.sale_code : item?.code,
            STATUS: item.sale_status ? item.sale_status : item.status,
            EMPRESA: item.company_code ? item.company_code : item.company.code,
            EMPRESA_ID: item.company_id ? item.company_id : "",

          
            APELIDO: item.person_name
            ? item.person_name
            : item.person.name
            ? item.person.name
            : item.person.fantasyName,

            PEDIDO_EMISSAO: item.sale_date ? item.sale_date : item.date,
            PEDIDO_DISPONIBILIDADE: item.sale_availabilityDate
              ? item.sale_availabilityDate
              : item.availabilityDate
              ? item.availabilityDate
              : "",
            TAGS: item.sale_tags ? item.sale_tags : item.tags ? item.tags : "",

            CLIENTE_CGC: "",
            CLIENTE_COD: item.person_id ? item.person_id : item.person.id,
            PEDIDO_REFERENCIA: "",
            PEDIDO_VALOR: item.saleItem_totalValue
              ? item.saleItem_totalValue
              : item.totalValue,
            NOTA_FISCAL_NUMERO: "",
            NOTA_FISCAL_EMISSAO: "",
            NOTA_FISCAL_VALOR: "",
            ROMANEIO_NUMERO: "",
            PEDIDO_OBSERVACAO: item.properties
              ? item.properties.comments
              : item.sale_properties
              ? item.sale_properties.comments
              : "",
            TRANSPORTADORA_NOME: item.shipping_fantasyName
              ? item.shipping_fantasyName
              : item?.personShipping?.name,
            VENDEDOR_APELIDO: item.salesperson_fantasyName
              ? item.salesperson_fantasyName
              : item?.personSalesperson?.fantasyName
              ? item?.personSalesperson?.fantasyName
              : item?.personSalesperson?.name,
            VENDEDOR_ID: item.salesperson_id
              ? item.salesperson_id
              : item.personSalesperson?.id,
            WORKFLOW: workflow,
            itens: "", // Adiciona o item atual ao array de itens
          };
          // Verifica se já existe um pedido com o mesmo ID
          const existingPedido = PedidoSeparado.find(
            (p) => p.NUMERO_SISTEMA === item.sale_id
          );

          if (existingPedido) {
            // Se existir, apenas adicione o item aos itens existentes
            existingPedido.itens.push(item);
          } else {
            // Se não existir, adicione o novo pedido ao array
            PedidoSeparado.push(pedido);
          }
        }

        if (response && !response.length) {
          return errorResponse(404, "PedidoNotfound");
        } else {
          return successResponse(200, PedidoSeparado);
        }
      }
    }
  } catch (error) {
    console.error("error -> ", logStruct("fetchpedidos", error));
    return errorResponse(error.status, error.message);
  }
};

const fetchPedidosSql = async (reqData) => {
  try {
    validatePedidosSql(reqData); //valida dados de entreda
    const dados_usuario = await clientesModel.getUserInformation(reqData.email);
    reqData.id_user = dados_usuario[0].USUARIO_CONTA_ID_ERP;
    if (reqData) {
      const response = await pedidosModel.getpedidosSql(reqData);
      //       console.log(response)

      if (response && !response.length) {
        return errorResponse(404, "PedidoNotfound");
      } else {
        return successResponse(200, response);
      }
    }
  } catch (error) {
    console.error("error -> ", logStruct("fetchpedidos", error));
    return errorResponse(error.status, error.message);
  }
};

const fetchPedido = async (reqData) => {
  try {
    const dados_usuario = await clientesModel.getUserInformation(reqData.email);
    const dados_conexao = await organizacaoModel.getConnectionData();

    if (dados_usuario[0] && dados_conexao) {
      //////////////////REGRA PEDIDOS//////////////////////////
      //VENDEDOR SÓ LISTARÁ PEDIDOS DELE,
      //OPERADOR LISTARÁ TODOS OS PEDIDOS,
      //SUPERVISOR LISTARÁ TODOS OS PEDIDOS DOS VENDEDORES DA CARTEIRA DELE

      if (dados_usuario[0].USUARIO_PERFIL === "vendedor") {
        // const ArrayVendedores = await clientesModel.getArrayVendedores(Number(dados_usuario[0].USUARIO_ID));
        const response = await pedidosModel.getpedido(reqData);

        //obtem a url do xml e pdf da DANFE
        if (response[0] && response[0]?.sale?.invoice?.id) {
          const response_DANFE = await pedidosModel.getDanfe(
            reqData,
            response[0].sale.invoice.id
          );
          response[0].danfe = response_DANFE.data.filter(
            (item) => item.statusCode == "PROCESSED"
          )[0];
        }
        //console.log(dados_usuario[0]);
        if (response && !response.length) {
          return errorResponse(404, "PedidoNotfound");
        } else {
          if (
            Number(
              response[0].salesperson_id
                ? response[0].salesperson_id
                : response[0].sale.personSalesperson.id
            ) !== Number(dados_usuario[0].USUARIO_CONTA_ID_ERP)
          ) {
            return errorResponse(
              404,
              "Sem permissao para visualizar esse pedido"
            );
          } else {
            return successResponse(200, response);
          }
        }
      } else if (
        dados_usuario[0].USUARIO_PERFIL === "supervisor" ||
        dados_usuario[0].USUARIO_PERFIL === "operador" ||
        dados_usuario[0].USUARIO_PERFIL === "funcionario" ||
        dados_usuario[0].USUARIO_PERFIL === "ti" ||
        dados_usuario[0].USUARIO_PERFIL === "admin_global"
      ) {
        //pega todos os IDs de seus subordinados e insere dentro de um array
        let response = await pedidosModel.getpedido(reqData);

        //obtem a url do xml e pdf da DANFE
        if (response[0] && response[0]?.sale?.invoice?.id) {
          const response_DANFE = await pedidosModel.getDanfe(
            reqData,
            response[0].sale.invoice.id
          );
          response[0].danfe = response_DANFE.data.filter(
            (item) => item.statusCode == "PROCESSED"
          )[0];
        }
        if (response && !response.length) {
          return errorResponse(404, "PedidoNotfound");
        } else {
          return successResponse(200, response);
        }
      }
    }

    const validInput = validatePedido(reqData);
    const response = await pedidosModel.getpedido(validInput);
    //  console.log(validInput)
    // console.log(response)
    /*
        response.map((item,index)=>{
            var responseProgramacao = await pedidosModel.getProgramacao(item.id);
            response[index].push = responseProgramacao;
            

        })
        */
    //const responseProgramacao = await pedidosModel.getProgramacao(validInput);

    // response.push({novoele2: 'valor'});

    if (response && !response.length) {
      return errorResponse(404, "pedidosNotfound");
    }

    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("fetchpedidos", error));
    return errorResponse(error.status, error.message);
  }
};

const fetchOperatorNotes = async (reqData) => {
  try {
    const response = await pedidosModel.getOperatorNotes(reqData);
    if (response && !response.length) {
      return errorResponse(404, "OperatorNotesNotfound");
    } else {
      return successResponse(200, response);
    }
  } catch (error) {
    console.error("error -> ", logStruct("operatornotes", error));
    return errorResponse(error.status, error.message);
  }
};

module.exports = {
  fetchPedidos,
  fetchPedido,
  gerarPedido,
  fetchPedidoByVendedor,
  fetchPedidosSql,
  fetchOperatorNotes,
};
