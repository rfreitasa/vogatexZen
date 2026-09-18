const carrinhoModel = require("../models/carrinho");
const produtosModel = require("../models/produtos");
const listaprecosModel = require("../models/regras");
const empresaModel = require("../models/empresa");
const organizacaoModel = require("../models/organizacao");

const { REGRAS, API } = require("../configuration/api");

const { successResponse, errorResponse } = require("../libs/response");
const {
  validateCarrinho,
  validaRemocaoCarrinho,
  validaEmail,
  validaRemocao,
} = require("../validators/carrinho");
const cache = require("../libs/cache");

require("dotenv-safe").config();

const logStruct = (func, error) => {
  return { func: func, file: "carrinhoController", error };
};

const CriaeAdicionaAoCarrinho = async (reqData) => {
  try {
  console.log('acessou-----------------------------------')
    //Checa regra de inserção ao carrinho
    //Regras atribuidas à lista de preço
    //Retorno: ok | Msg de regra aferida
    const lista_preco = await listaprecosModel.getListaPrecosByName(
      reqData.lista_preco_id
    );
    //console.log(lista_preco)
    //checks necessario por lista de preços:
    /*  
     - [  ] exibe valor da lista na tela de produtos
     - [  ] permite produtos que não estão na lista
     - [  ] permite editar valor unitário
     - [  ] permite valor inferior ao sugerido
     - [  0,00 ] percentual de comissão
     */

    if (
      Number(
        lista_preco[0].LISTA_PRECOS_VALOR_PERMITIDO_INFERIOR_AO_UNITARIO
      ) >= 0 &&
      reqData.valor_unitario_padrao > 0 &&
      lista_preco[0].LISTA_PRECOS_EXIBE_VALOR == "sim"
    ) {
      //lê-se : Permite desconto no valor?

      // Converter a porcentagem para um fator multiplicativo
      const fatorDesconto =
        1 -
        lista_preco[0].LISTA_PRECOS_VALOR_PERMITIDO_INFERIOR_AO_UNITARIO / 100;
      // Calcular o valor permitido com desconto
      const valorPermitidoComDesconto =
        Number(reqData.valor_unitario_padrao) * Number(fatorDesconto);
      // Verificar se o valor_unitario digitado está fora do limite permitido
      if (Number(reqData.valor_unitario) < Number(valorPermitidoComDesconto)) {
        return errorResponse(
          401,
          "O valor informado está fora do limite de desconto permitido para a lista de preço."
        );
      }
    }

    const validInput = validaEmail(reqData);

    if (validInput) {
      if (!reqData.quantidade) {
        reqData.quantidade = 0;
      }
      await carrinhoModel.RemovecarrinhosVencidos(); //remove todos os carrinho abertos a mais de 30 minutos
      const DadosDoUsuario = await carrinhoModel.getDataUser(validInput.email);

      if (DadosDoUsuario && DadosDoUsuario.length) {
        validInput.usuario_id = DadosDoUsuario[0].usuario_id;
        validInput.conta_id = DadosDoUsuario[0].usuario_conta_id_erp;
        validInput.nome_conta = DadosDoUsuario[0].usuario_nome;
        validInput.organizacao_id = DadosDoUsuario[0].organizacao_id;
        validInput.usuario_nome = DadosDoUsuario[0].usuario_nome;
        validInput.password_erp = DadosDoUsuario[0].usuario_password_erp;
        reqData.empresa_id = reqData.empresa_id_erp;
        validInput.codigo = reqData.item_id; //codigo do produto
        validInput.programacao_data = reqData.programacao_data!='null'? reqData.programacao_data : null;
        validInput.cod_carrinho;
        //Verifica se há um carrinho em aberto para o usuário ( 30 minutos de tolerancia)
        const HacarrinhoemAberto = await carrinhoModel.HacarrinhoemAberto(
          validInput.usuario_id
        ); //somente
        const DadosEmpresa = await empresaModel.getEmpresaById_ERP(
          reqData.empresa_id
        );


        var lista_produtos_sem_estoque = "nao";
        //  var vende_produtos_sem_estoque = 'nao';
        const responseOrganizacao = await organizacaoModel.getOrganizacoes();
    
        const organizacao = responseOrganizacao?.find(
          (org) =>
            org.ORGANIZACAO_PRODUTO_SESTOQUE != null ||
            org.ORGANIZACAO_VENDE_SESTOQUE != null
        );
    
        if (organizacao?.ORGANIZACAO_PRODUTO_SESTOQUE === 0) {
          // 0 = Permite Listar produtos sem estoque
          lista_produtos_sem_estoque = "sim";
        }
    



        
        reqData.empresa_id_cluster = DadosEmpresa[0].EMPRESA_CLUSTER;

        const produtoDataERP = await produtosModel.getProdutos(
          validInput,
          reqData.token_erp
        );
console.log('0000')

        var resultadoFiltrado = "";
        if (produtoDataERP) {
          console.log('1000')
          reqData.empresa_id_cluster = DadosEmpresa[0].EMPRESA_CLUSTER;
       
          //reqData.empresa_cluster =  DadosEmpresa.find(item => Number(item.EMPRESA_CLUSTER) === Number(response_organized[index].stockCluster_id)).EMPRESA_CLUSTER;

           resultadoFiltrado =
            reqData.empresa_id_cluster != reqData.empresa_id
              ? produtoDataERP.filter((produto) => {
                  return produto.stockCluster_id == reqData.empresa_id_cluster;
                })
              : produtoDataERP;

          // Agrupamento por productPacking_id, schedule_id e company.id
          const purchaseSet = new Set();
          produtoDataERP.forEach((item) => {
            if (item.subtype === "PURCHASE" && item.schedule_id !== null) {
              purchaseSet.add(item.schedule_id);
            }
          });

      /*    groupedResponse = resultadoFiltrado.reduce((grouped, cur) => {
            const scheduleIdKey =
              cur.schedule_id !== null ? cur.schedule_id : "null";

            // Verifica a existência do scheduleId no conjunto de compras
            const isPurchaseActive =
              scheduleIdKey > 0 && purchaseSet.has(scheduleIdKey);

            const companyIdKey =
              cur.stockCluster_id !== null ? cur.stockCluster_id : null;
            const schedulePart =
              cur.schedule_id && isPurchaseActive ? `-${scheduleIdKey}` : "";

       
              const key = `${cur.productPacking_id}${schedulePart}-${companyIdKey}`;
              if (!grouped[key]) {
              grouped[key] = { ...cur, quantity: 0 };
            }

            grouped[key].quantity += cur.quantity;
            return grouped;
          }, {});*/
        }

    
        // Agrupamento por productPacking_id, schedule_id e company.id
        // Filtra os elementos com quantity diferente de 0 //Não pode listar produtos com quantidade 0 ***REGRA***
        const filteredGroupedResponse =
        (reqData.saldo_zero && reqData.saldo_zero == "sim") ||
        lista_produtos_sem_estoque == "sim"
          ? Object.fromEntries(Object.entries(resultadoFiltrado))
          : Object.fromEntries(
              Object.entries(resultadoFiltrado).filter(
                ([key, value]) => value.quantity > 0
              )
            );
        // Convertendo o objeto agrupado de volta para um array
     var   response_organized = Object.values(filteredGroupedResponse);
        console.log('0000000000000000000')
  console.log(response_organized);    
	  /*    if (String(reqData.tipo_venda).trim() != "P.E") {
          response_organized =
            reqData.tipo_venda != ""
              ? response_organized.filter(
                  (item) =>
                    (item.productPacking_id =
                      reqData.item_id &&
                      Number(item?.schedule_key) == Number(reqData.programacao_numero))
                )
              : response_organized.filter(
                  (item) =>
                    (item.productPacking_id =
                      reqData.item_id && item.schedule_id == 0)
                );
        } else {
          response_organized = response_organized.filter((item) => {
            return !item.schedule_id;
          });
        }
*/


 const filteredProducts = response_organized.filter((item) => {
          if (reqData.programacao_numero == "P.E") {
            return !item.schedule_id && item.stockCluster_id==reqData.empresa_id_cluster;
          } 
          
          else if (
            !isNaN(reqData.programacao_numero) &&
            item.schedule_key == reqData.programacao_numero
          ) {
            return true;
          }
          return false;
        });
        console.log('12311111111111111111111111')
        console.log(filteredProducts)
        //filtro pelo tipo de venda(pronta entrega ou programação), e devolvo o saldo do produto do erp
        const saldoERP = filteredProducts[0].quantity.toFixed(2);
        
     

        //console.log(response_organized)
        // reqData.empresa_id_erp = response_organized[0].schedule_id

        //filtro pelo tipo de venda(pronta entrega ou programação), e devolvo o saldo do produto do erp
       // const saldoERP = response_organized[0].quantity;
        
        if (isNaN(saldoERP)) {
          // Se não houver saldo ou o produto nao for  encontrado
          saldoERP = 0;
        }
        //Se não houver carrinho em aberto
        if (HacarrinhoemAberto === undefined || !HacarrinhoemAberto.length) {
      
          //Cria um carrinho e adiciona o item a ele.
          let criaCarrinho = await carrinhoModel.criaCarrinho(validInput);

          if (criaCarrinho) {
            const saldoreservado = await carrinhoModel.ConsultaSaldoProdutoBD(
              criaCarrinho,
              reqData
            );
            if (isNaN(saldoreservado[0].QUANTIDADE)) {
              saldoreservado[0].QUANTIDADE = "0";
            }

            const saldoTotal = Number(
              saldoERP - saldoreservado[0].QUANTIDADE
            ).toFixed(2);
        console.log(saldoTotal)  
            //regra (caso nao permita pedido sem ter saldo disponivel)
            console.log(reqData)
            if (saldoERP === 0 && (reqData.tipo_venda.includes("ESP") || reqData.tipo_venda.includes("ESPERA_PRG") )) {
              //consulta se existe item igual no carrinho
              const existeItemNoCarrinho =
                await carrinhoModel.ConsultaItemNoCarrinho(
                  criaCarrinho,
                  reqData,
                  reqData.programacao_numero,
                  reqData.programacao_data,
                
                );

              if (existeItemNoCarrinho && existeItemNoCarrinho.length) {
                //Ja existe o item no carrinho, necessario dar o update.
                const atualiza = await carrinhoModel.AtualizaItemDoCarrinho(
                  existeItemNoCarrinho[0].ID,
                  reqData
                );

                return successResponse(200, {
                  mensagem: "Item alterado",
                  id: existeItemNoCarrinho[0].ID,
                });
              } else {
                //consulta saldo do produto
                await carrinhoModel.AdicionaItemAoCarrinho(
                  criaCarrinho,
                  reqData
                );
                return successResponse(200, "Item adicionado");
              }
            } else {
              if (Number(saldoTotal) >= Number(reqData.quantidade)) {
                await carrinhoModel.AdicionaItemAoCarrinho(
                  criaCarrinho,
                  reqData
                );
                return successResponse(200, "Item adicionado");
              } else {
                return errorResponse(
                  400,
                  "Saldo:" + saldoTotal + " ,insuficiente para inclusão do item"
                );
              }
            }
          } else {
            return errorResponse(400, "Erro ao criar o carrinho");
          }
        } else {
          // consulta saldo reservado em todo o sistema , exceto no carrinho do usuario,
          // pois caso encontre produto ja reservado no carrinho atual, atualizará a quantidade e valores
          //reqData.tipo_venda = reqData.programacao_numero; NAO USAR ISSO

          const saldoreservado = await carrinhoModel.ConsultaSaldoProdutoBD(
            HacarrinhoemAberto[0].CARRINHO_ID,
            reqData
          );
console.log('999999999999999');
          if (isNaN(saldoreservado[0].QUANTIDADE)) {
            saldoreservado[0].QUANTIDADE = "0";
          }
          const saldoTotal = Number(saldoERP - saldoreservado[0].QUANTIDADE);
          //regra (caso nao permita pedido sem ter saldo disponivel)
          if (saldoTotal >= reqData.quantidade || reqData.tipo=='ESPERA_PE' || reqData.tipo=='ESPERA_PRG') {
            //consulta se existe item igual no carrinho


            console.log('iniciando consulta de item no carrinho');
            console.log(reqData)
            const existeItemNoCarrinho =
              await carrinhoModel.ConsultaItemNoCarrinho(
                HacarrinhoemAberto[0].CARRINHO_ID,
                reqData,
                reqData.programacao_numero,
                reqData.programacao_data
                
              );
console.log(existeItemNoCarrinho)
            if (existeItemNoCarrinho && existeItemNoCarrinho.length) {
              //Ja existe o item no carrinho, necessario dar o update.
              const atualiza = await carrinhoModel.AtualizaItemDoCarrinho(
                existeItemNoCarrinho[0].ID,
                reqData
              );
              return successResponse(200, {
                mensagem: "Item alterado",
                id: existeItemNoCarrinho[0].ID,
              });
            } else {
              //consulta saldo do produto
              await carrinhoModel.AdicionaItemAoCarrinho(
                HacarrinhoemAberto[0].CARRINHO_ID,
                reqData
              );
              return successResponse(200, "Item adicionado");
            }
          } else {
            return errorResponse(
              400,
              "Saldo:" + saldoTotal + " ,insuficiente para inclusão do item"
            );
          }
        }
      } else {
        return errorResponse(400, "Erro ao coletar os dados do usuário");
      }
    } else {
      return errorResponse(400, "Dados faltantes");
    }
  } catch (error) {
    return errorResponse(400, "Erro ao incluir item ao carrinho");
  }
};

const ObtemCarrinho = async (reqData) => {
  try {
    const validInput = validaEmail(reqData);

    if (validInput) {
      //remove todos os carrinho abertos a mais de 30 minutos
      //depois habilitar esse
      await carrinhoModel.RemovecarrinhosVencidos();

      const DadosDoUsuario = await carrinhoModel.getDataUser(validInput.email);

      if (DadosDoUsuario && DadosDoUsuario.length) {
        validInput.usuario_id = DadosDoUsuario[0].usuario_id;
        validInput.conta_id = DadosDoUsuario[0].usuario_conta_id_erp;
        validInput.nome_conta = DadosDoUsuario[0].usuario_nome;
        validInput.organizacao_id = DadosDoUsuario[0].organizacao_id;
        validInput.usuario_nome = DadosDoUsuario[0].usuario_nome;
        validInput.password_erp = DadosDoUsuario[0].usuario_password_erp;

        validInput.cod_carrinho = "";

        //Verifica se há um carrinho em aberto para o usuário ( 30 minutos de tolerancia)
        const carrinhoExiste = await carrinhoModel.HacarrinhoemAberto(
          validInput.usuario_id
        ); //somente

        // SE CARRINHO FOR VÁLIDO, SEGUE.
        if (carrinhoExiste && carrinhoExiste.length) {
          let dados_carrinho = await carrinhoModel.getCarrinhoItens(
            carrinhoExiste[0].CARRINHO_ID
          );
          //         console.log(dados_carrinho);

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

          const empresas = dados_carrinho
            .map((item) => item.EMPRESA_APELIDO)
            .filter((value, index, self) => self.indexOf(value) === index); // Coleta TODOS os EMPRESA_ID (DISTINCT). Ex: [0,1,1,1,2,3,3], só trará [0,1,2,3]

          var CarrinhoSeparado = [];
          empresas.map((empresa, index) => {
            var filtrado = dados_carrinho.filter(function (obj) {
              return obj.EMPRESA_APELIDO == empresa;
            }); // Percorre o array dados_carrinho coletando somente  os que tiverem EMPRESA_ID da variavel "eempresa"
            //                             filtrado.push({numero_pedido: numeroDePedidos});
            var tipos_venda = filtrado
              .map((item) => item.TIPO_VENDA + item.PEDIDO_NUM)
              .filter((value, index, self) => self.indexOf(value) === index); //Percorre o array filtrado , filtrando os tipos de vendas distintos( mesmo que distinct(TIPO_VENDA))

            tipos_venda.map((item) => {
              // comentado até fabiano enviar o SQL correto
              //const get_numero_pedidoERP= await carrinhoModel.geraCodVenda();//obtem numero do pedido no ERP

              const agrupar = groupBy(
                filtrado,
                (item) => item.TIPO_VENDA + item.PEDIDO_NUM
              );

              CarrinhoSeparado.push(agrupar.get(item));
            });
          });

          var array = [];

          return successResponse(200, CarrinhoSeparado);

          //}
        } else {
          return errorResponse(403, "Impossivel obter número do carrinho");
        }
      } else {
        return errorResponse(403, "Impossivel obter os dados do usuário.");
      }
    } else {
      return errorResponse(403, "Usuário não passado");
    }
  } catch (error) {
    console.error("error -> ", logStruct("geraPedido", error));
    return errorResponse(error.status, error.message);
  }
};

const removeDoCarrinho = async (reqData) => {
  try {
    const validInput = validaRemocao(reqData);

    response = await carrinhoModel.deletaItemDoCarrinho(reqData.id);

    if (response) {
      return successResponse(204);
    } else {
      return errorResponse(403, "Erro ao excluir");
    }
  } catch (error) {
    console.error("error -> ", logStruct("removeFromCart", error));
    return errorResponse(error.status, error.message);
  }
};

const removeCarrinho = async (reqData) => {
  try {
    const validInput = validaRemocaoCarrinho(reqData);

    const DadosDoUsuario = await carrinhoModel.getDataUser(validInput.email);

    if (DadosDoUsuario && DadosDoUsuario.length) {
      validInput.usuario_id = DadosDoUsuario[0].usuario_id;
      //Verifica se há um carrinho em aberto para o usuário ( 30 minutos de tolerancia)
      const carrinhoExiste = await carrinhoModel.HacarrinhoemAberto(
        validInput.usuario_id
      ); //somente

      // SE CARRINHO FOR VÁLIDO, SEGUE.
      if (carrinhoExiste && carrinhoExiste.length) {
        response = await carrinhoModel.deletaCarrinho(
          carrinhoExiste[0].CARRINHO_ID
        );

        if (response) {
          return successResponse(204);
        } else {
          return errorResponse(403, "Erro ao excluir");
        }
      } else {
        return errorResponse(403, "Carrinho não localizado.");
      }
    } else {
      return errorResponse(403, "Erro na remoção do carrinho.");
    }
  } catch (error) {
    console.error("error -> ", logStruct("removeFromCart", error));
    return errorResponse(error.status, error.message);
  }
};

module.exports = {
  CriaeAdicionaAoCarrinho,
  ObtemCarrinho,
  removeDoCarrinho,
  removeCarrinho,
};
