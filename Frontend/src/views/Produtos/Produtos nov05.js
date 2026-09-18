import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Grid,
  Select,
  Input,
  MenuItem,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import CarrinhoModal from 'components/CarrinhoModal';
import {
  useTable,
  usePagination,
  useSortBy,
  useGlobalFilter,
} from 'react-table';
import { useHistory } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import { API } from '../../config/api';
import axios from 'axios';
import { toast } from 'react-toastify';
import Carrinho from 'components/CarrinhoModal';
import usePriceList from './usePriceList';
import { getCartEndpoint } from './useCartData';
import Pdf from '../../components/Produtos/PDF';
import PdfColecao from '../../components/Produtos/PDFCOLECAO';
import ImagesProducts from '../../components/Produtos/Carousel';
import FinalizaPedido from './FinalizaPedido';
import { FormAuto } from './stylesFinaliza';
import { TableRow, TableCell, Header } from './styles';
import { TextField, InputAdornment, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search'; // Ícone de lupa
import ReactInputMask from 'react-input-mask';
import formatDecimal from 'utils/formatDecimal';
import { FixedSizeList as List } from 'react-window';

function Products() {
  const { register, handleSubmit } = useForm();
  const [selectedPriceList, setSelectedPriceList] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSendCart, setLoadingSendCart] = useState(false);

  const [listCart, setListCart] = useState([]);
  const [listCartIcluded, setListCartIncluded] = useState([]);

  const [currency, setCurrency] = useState('BRL');
  const [totalStock, setTotalStock] = useState(0);
  const [newGlobalValue, setNewGlobalValue] = useState('');
  const [listRules, setlistRules] = useState('');
  const [confirmOrder, setConfirmOrder] = useState('');

  const token = sessionStorage.getItem('token');
  const email = sessionStorage.getItem('email');
  const user_id = sessionStorage.getItem('id');
  const ordenacao_default = sessionStorage.getItem('ordenacao_lista');
  const [showInput, setShowInput] = useState(false); // Estado para controlar a visibilidade do input

  async function fetchCart() {
    const cartData = await getCartEndpoint(email, token, setCurrency); // Recebe os dados do carrinho
    setListCartIncluded(cartData); // Armazena os dados no estado
  }

  //Obtem os dados do carrinho
  useEffect(() => {
    fetchCart();
  }, [email, token]);

  const handleShowInput = () => {
    setShowInput(prev => !prev); // Alterna a visibilidade
  };

  const {
    priceList,
    loading: loadingPriceList,
    selectedPriceList: initialSelectedPriceList,
  } = usePriceList(user_id, email, token, ordenacao_default);

  useEffect(() => {
    if (!selectedPriceList && initialSelectedPriceList) {
      setSelectedPriceList(initialSelectedPriceList);
    }
  }, [initialSelectedPriceList]);

  const history = useHistory();
  const inputRefs = useRef({
    quantidade: [],
    valorUnitario: [],
  }); // Armazena as referências dos inputs

  const checkItemBalance = async item => {
    try {
      const response = await axios.get(
        `${API.consultasaldo}?email=${email}&item_id=${item.original.ITEM_ID}&empresa_id=${item.original.EMPRESA_ID}&tipo_venda=${item.original.PROGRAMACAO_ID}`,
        {
          headers: {
            'x-access-token': token,
          },
        },
      );
      return response.data ? response.data.data.saldo.toFixed(2) : -1;
    } catch (err) {
      toast.error('Erro ao obter o saldo');
    }
  };
  const hasDifferentListPriceUsed = () => {
    for (const item of listCartIcluded) {
      if (item.LISTA_PRECO_ID !== selectedPriceList) {
        // Se encontrar uma lista diferente, retorna true
        return true;
      }
    }
    // Se percorrer todo o array e não encontrar lista diferente, retorna false
    return false;
  };

  const sendCartDataToBackend = (row, newQuantity, newValue, type, field) => {
    if (hasDifferentListPriceUsed()) {
      toast(
        'Há itens no carrinho com outra lista de preço, para incluir item considerando essa lista de preço, limpe o carrinho.',
        {
          autoClose: 5000,
        },
      );
    } else {
      if (newQuantity > 0 && newValue > 0) {
        setLoadingSendCart(true);
        const dataSendCart = {
          email: email, // ou email da sua aplicação
          item_id: row.original.ITEM_ID,
          codigo: row.original.ITEM_CODIGO,
          item_nome: row.original.ITEM_NOME,
          item_grade: row.original.ITEM_GRADE,
          item_unidade: row.original.ITEM_UNIDADE,
          empresa_id_erp: row.original.EMPRESA_ID,
          empresa_apelido: row.original.EMPRESA_APELIDO,
          data_programacao: row.original.ITEM_PREVISAO,
          quantidade: newQuantity,
          lista_preco_id: selectedPriceList,
          valor_unitario: newValue,
          valor_unitario_padrao: row.original.ITEM_VALOR_UNITARIO,
          tipo_venda: row.original.PE_OU_PROG,
          programacao_numero: row.original.PROGRAMACAO_ID,
          programacao_item_id: row.original.ITEM_ID,
          pedido_num: row.original.PEDIDO_NUM,
        };

        axios
          .post(`${API.adicionaaocarrinho}`, dataSendCart, {
            headers: { 'x-access-token': token },
          })
          .then(async response => {
            setLoadingSendCart(false);
            fetchCart(); // Recarrega o carrinho
            const itemBalance = await checkItemBalance(row);
            // Atualiza a quantidade disponível
            if (type == 'quantidade') {
              setListCart(prevListCart => {
                const updatedData = [...prevListCart];
                updatedData[row.index] = {
                  ...updatedData[row.index],
                  ITEM_SALDO: (itemBalance - newQuantity).toFixed(2),
                  QUANTIDADE: newQuantity,
                };
                return updatedData;
              });
            } else {
              setListCart(prevListCart => {
                const updatedData = [...prevListCart];
                updatedData[row.index] = {
                  ...updatedData[row.index],
                  ITEM_SALDO: (itemBalance - newQuantity).toFixed(2),
                  ITEM_VALOR_UNITARIO_ESCOLHIDO: newValue,
                };
                return updatedData;
              });
            }
            handleFocus(row.index, type);
          })
          .catch(error => {
            toast(
              'Erro ao inserir.',
              {
                autoClose: 5000,
              },
            );            setLoadingSendCart(false);
          });
      }
    }
  };

  const handleGlobalValueChange = () => {
    const valueToUpdate = parseFloat(newGlobalValue);
    if (!newGlobalValue || valueToUpdate <= 0) {
      toast.error('Insira um valor válido');
      return;
    }
    setShowInput(false);
    setListCart(prevListCart =>
      prevListCart.map(item => {
        // Verifica se a quantidade é igual a 0 antes de atualizar o valor unitário
        if (item.QUANTIDADE <= 0) {
          return {
            ...item,
            ITEM_VALOR_UNITARIO_ESCOLHIDO: valueToUpdate.toFixed(2),
          };
        }
        return item; // Retorna o item sem alterações se a quantidade for maior que 0
      }),
    );
  };
  const [nextFocusField, setNextFocusField] = useState(null); // Armazena o próximo campo a ser focado




// Função para validar o valor unitário com base nas regras da lista de preço
const validarValorUnitario = (newValue, row, listRules) => {
  if (
    Number(listRules[0].LISTA_PRECOS_VALOR_PERMITIDO_INFERIOR_AO_UNITARIO) >= 0 &&
    row.original.ITEM_VALOR_UNITARIO > 0
  ) {
    const fatorDesconto =
      1 -
      listRules[0].LISTA_PRECOS_VALOR_PERMITIDO_INFERIOR_AO_UNITARIO / 100;
    const valorPermitidoComDesconto =
      Number(row.original.ITEM_VALOR_UNITARIO) * Number(fatorDesconto);

    // Verificar se o valor unitário digitado está fora do limite permitido
    if (Number(newValue) < Number(valorPermitidoComDesconto)) {
      return {
        isValid: false,
        message: 'O valor informado está fora do limite de desconto permitido para a lista de preço.',
      };
    }
  }
  return { isValid: true, message: '' };
};











// Função para mover o foco entre os campos
const handleFocus = (index, type) => {
  if (type === 'quantidade') {
    const isValorUnitarioEnabled = !inputRefs.current.valorUnitario[index]?.disabled;
    if (isValorUnitarioEnabled) {
      setNextFocusField({ field: 'valorUnitario', index });
    } else {
      setNextFocusField({ field: 'quantidade', index: index + 1 });
    }
  } else if (type === 'valor') {
    setNextFocusField({ field: 'quantidade', index: index + 1 });
  }
};



  const columns = useMemo(
    () => [
      {
        Header: 'Ações',
        accessor: 'actions',
        Cell: ({ row }) => (
          <div className="myTableClass" style={{ display: 'flex', gap: '0px' }}>
            <Pdf num={row.original.MESTRE_ID} />
            <PdfColecao num={row.original.MESTRE_CODIGO} />
            <ImagesProducts
              num={row.original.ITEM_CODIGO}
              mestre_id={row.original.MESTRE_ID}
              mestre_codigo={row.original.MESTRE_CODIGO}
            />
          </div>
        ),
        width: 100,
      },
      {
        Header: 'Código',
        accessor: 'ITEM_CODIGO',
        minWidth: 100,
        sortType: 'basic',
        Cell: ({ value }) => <div style={{ fontSize: '18px' }}>{value}</div>,
        width: 100,
      },
      {
        Header: 'Nome',
        accessor: 'ITEM_NOME',
        minWidth: 300,
        sortType: 'basic',
        Cell: ({ value }) => <div style={{ fontSize: '18px' }}>{value}</div>,
      },
      {
        Header: 'Variante',
        accessor: 'ITEM_GRADE',
        width: 150,
        sortType: 'basic',
        Cell: ({ value }) => <div style={{ fontSize: '18px' }}>{value}</div>,
      },
      {
        Header: 'Prog',
        accessor: 'PE_OU_PROG',
        width: 100,
        sortType: 'basic',
        Cell: ({ row }) => (
          <div style={{ fontSize: '18px' }}>
            {row.original.PEDIDO_NUM
              ? `${row.original.PEDIDO_NUM} - ${row.original.PE_OU_PROG}`
              : row.original.PE_OU_PROG}
          </div>
        ),
      },
      {
        Header: 'Empresa',
        accessor: 'EMPRESA_APELIDO',
        width: 150,
        sortType: 'basic',
        Cell: ({ value }) => <div style={{ fontSize: '18px' }}>{value}</div>,
      },
      {
        Header: 'Disponível',
        accessor: 'ITEM_SALDO',
        Cell: ({ value }) => (
          <span style={{ fontSize: '18px', textAlign: 'right' }}>
            {formatDecimal(value > 0 ? value : 0)}
          </span>
        ),
        width: 150,
      },
      {
        Header: 'Quantidade',
        accessor: 'QUANTIDADE',
        Cell: ({ row }) => {
          const [quantidade, setQuantidade] = useState(row.original.QUANTIDADE);
          const inputQuantidadeRef = useRef(quantidade); // Referência para manter o valor atual

          const handleBlur = useCallback(
            e => {
              const newQuantity = parseFloat(e.target.value);
              console.log(newQuantity+'-'+quantidade)
              if (parseFloat(newQuantity) != parseFloat(quantidade)) {
                inputQuantidadeRef.current = newQuantity;
                setQuantidade(newQuantity);
                // Atualize o estado do listCart
                setListCart(prevListCart => {
                  const updatedList = [...prevListCart];
                  updatedList[row.index] = {
                    ...updatedList[row.index],
                    QUANTIDADE: newQuantity, // Atualiza a quantidade
                  };
                  return updatedList; // Retorna a nova lista
                });

                sendCartDataToBackend(
                  row,
                  newQuantity,
                  row.original.ITEM_VALOR_UNITARIO_ESCOLHIDO,
                  'quantidade',
                );
              }
            },
            [row],
          );

          return (
            <TextField
              inputRef={inputQuantidadeRef}
              value={quantidade}
              onChange={e => setQuantidade(e.target.value)}
              onBlur={handleBlur}
              type="number"
              inputProps={{ min: 0 }} // Adiciona uma validação mínima
            />
          );
        },
      },

      {
        Header: 'Valor Unitário',
        accessor: 'ITEM_VALOR_UNITARIO_ESCOLHIDO',
        Cell: ({ row }) => {
          const [valorUnitario, setValorUnitario] = useState(
            row.original.ITEM_VALOR_UNITARIO_ESCOLHIDO,
          );
      
          // Referência para manter o valor atual
          const inputValorUnitarioRef = useRef(valorUnitario);
      
          // Atualiza a referência sempre que valorUnitario mudar
          useEffect(() => {
            inputValorUnitarioRef.current = valorUnitario;
          }, [valorUnitario]);
      
          const handleBlurValorUnitario = useCallback(
            (e) => {
              const newValue = parseFloat(e.target.value);
          console.log(newValue);
          console.log(inputValorUnitarioRef.current)
              if (parseFloat(newValue) != parseFloat(inputValorUnitarioRef.current)) {
                const validationResult = validarValorUnitario(newValue, row, listRules);
          
                if (!validationResult.isValid) {
                  toast.error(validationResult.message);
                  setValorUnitario(inputValorUnitarioRef.current); // Restaura o valor anterior
                } else {
                  setValorUnitario(newValue); // Atualiza o valor unitário
                  setListCart(prevListCart => {
                    const updatedList = [...prevListCart];
                    updatedList[row.index] = {
                      ...updatedList[row.index],
                      ITEM_VALOR_UNITARIO_ESCOLHIDO: newValue, // Atualiza o valor unitário
                    };
                    return updatedList; // Retorna a nova lista
                  });
          
                  sendCartDataToBackend(
                    row,
                    row.original.QUANTIDADE,
                    newValue,
                    'valorUnitario',
                  );
                }
              }
            },
            [row]
          );
      
          return (
            <TextField
              inputRef={(el) => (inputRefs.current.valorUnitario[row.index] = el)}
              value={valorUnitario}
              onChange={(e) => setValorUnitario(e.target.value)}
              onBlur={handleBlurValorUnitario}
              type="number"
              InputProps={{
                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
              }}
            />
          );
        },
      }
      
    ],
    [listCart], // Adicione dependências que você deseja observar
  );
console.log('passou')
  // Use o hook useTable e usePagination
  const {
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data: listCart,
    },
    useSortBy,
    usePagination,
  );
  const Row = ({ index, style }) => {
    const row = rows[index];
    prepareRow(row);

    return (
      <TableRow {...row.getRowProps({ style })}>
        {row.cells.map(cell => (
          <TableCell {...cell.getCellProps()} key={cell.getCellProps().key}>
            {cell.render('Cell')}
          </TableCell>
        ))}
      </TableRow>
    );
  };
  const handlePriceListChange = event => {
    setSelectedPriceList(event.target.value);
  };

  const handleSearch = async data => {
    const productName = data.product;

    if (!selectedPriceList) {
      toast('Por favor selecione uma lista de preço', { autoClose: 5000 });
      return;
    }
    if (!productName) {
      toast('Por favor insira um produto para a pesquisa', { autoClose: 5000 });
      return;
    }

    try {
      setIsLoading(true);
      const priceListResponse = await axios.get(
        `${API.listaprecos}/${selectedPriceList}`,
        { headers: { 'x-access-token': token } },
      );
      const priceList = priceListResponse.data.data;
      setlistRules(priceList);

      const productsResponse = await axios.get(
        `${API.produtos}?email=${email}&nome=${productName}&lista_preco=${selectedPriceList}`,
        { headers: { 'x-access-token': token } },
      );

      const productsList = productsResponse.data.data.map(item => {
        if (priceList[0].LISTA_PRECOS_EXIBE_VALOR === 'nao') {
          item.ITEM_VALOR_UNITARIO = 0;
        }
        return item;
      });

      setListCart(productsList);
      const totalStock = productsList.reduce(
        (total, item) => total + Number(item.ITEM_SALDO),
        0,
      );

      setTotalStock(totalStock);
    } catch (error) {
      if (error.response && error.response.status === 402) {
        toast.error('Sua sessão expirou, efetue o login novamente.');
        sessionStorage.clear();
      } else if (error.response && error.response.status === 404) {
        toast.error('Produto não encontrado.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalizeOrder = () => {
    setConfirmOrder(true);
  };

  return (
    <>
      {confirmOrder ? (
        <div className="lineForm">
          <FormAuto>
            <FinalizaPedido
              itemCart={listCart}
              Transp={[]}
              Clients={[]}
              Vendedores={[]}
            />
          </FormAuto>
        </div>
      ) : (
        <Grid container spacing={3}>
          {(isLoading || loadingSendCart || loadingPriceList) && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
              }}
            >
              <CircularProgress size={50} />
              <Typography
                variant="h6"
                style={{ marginLeft: '20px', color: '#fff' }}
              >
                {isLoading
                  ? 'Pesquisando produtos...'
                  : loadingSendCart
                  ? 'Enviando ao carrinho'
                  : 'Obtendo listas de preço...'}
              </Typography>
            </div>
          )}

          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="Estoque"
                style={{ marginBottom: '-25px', textAlign: 'left' }}
              />
              <CardContent>
                <form onSubmit={handleSubmit(handleSearch)}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} md={3}>
                      <Input
                        name="product"
                        type="text"
                        inputRef={register}
                        placeholder="Insira um produto"
                        style={{
                          width: '100%',
                          height: '40px',
                          padding: '10px',
                          fontSize: '16px',
                          borderRadius: '5px',
                          border: '1px solid #ccc',
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Select
                        style={{
                          width: '100%',
                          padding: '10px',
                          height: '40px',
                          fontSize: '16px',
                          borderRadius: '5px',
                          border: '1px solid #ccc',
                        }}
                        fullWidth
                        value={selectedPriceList}
                        onChange={handlePriceListChange}
                        disabled={loadingPriceList}
                        displayEmpty
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200,
                              overflowY: 'auto',
                            },
                          },
                          anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'left',
                          },
                          transformOrigin: {
                            vertical: 'top',
                            horizontal: 'left',
                          },
                        }}
                      >
                        {loadingPriceList ? (
                          <MenuItem disabled>
                            <CircularProgress size={20} />
                            <Typography
                              variant="body2"
                              style={{ marginLeft: '10px' }}
                            >
                              Carregando...
                            </Typography>
                          </MenuItem>
                        ) : (
                          priceList.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))
                        )}
                      </Select>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        fullWidth
                        disabled={isLoading}
                        style={{
                          width: '100%',
                          padding: '7px',
                          borderRadius: '5px',
                          border: '1px solid #ccc',
                        }}
                      >
                        {isLoading ? 'Pesquisando...' : 'Pesquisar'}
                      </Button>
                    </Grid>

                    {listCartIcluded.length > 0 && (
                      <>
                        {' '}
                        <Grid item xs={12} md={2}>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleFinalizeOrder}
                            fullWidth
                            style={{
                              width: '100%',
                              padding: '7px',
                              borderRadius: '5px',
                              border: '1px solid #ccc',
                            }}
                          >
                            Finalizar Venda
                          </Button>
                        </Grid>
                      </>
                    )}
                    <Grid item xs={12} md={2}>
                      <Carrinho itemCart={listCartIcluded} moeda={currency} />
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Grid
                  container
                  spacing={3}
                  style={{ justifyContent: 'flex-end', width: '100%' }}
                >
                  <Grid
                    className="index"
                    item
                    sm={4}
                    lg={4}
                    md={4}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',

                      textAlign: 'end',
                    }}
                  ></Grid>
                  <Grid item sm={1} lg={1} md={1}>
                    <Button
                      onClick={handleShowInput}
                      variant="contained"
                      color="primary"
                      style={{ width: '100%' }}
                    >
                      <MenuIcon />
                    </Button>
                  </Grid>

                  {showInput && (
                    <>
                      <Grid item sm={2} lg={2} md={2}>
                        <Input
                          type="number"
                          value={newGlobalValue}
                          onChange={e => setNewGlobalValue(e.target.value)}
                          placeholder="Alterar todos os valores"
                          fullWidth
                        />
                      </Grid>

                      <Grid item sm={3} lg={3} md={3}>
                        <Button
                          fullWidth
                          variant="contained"
                          color="secondary"
                          onClick={handleGlobalValueChange}
                        >
                          Alterar valores
                        </Button>
                      </Grid>
                    </>
                  )}
                </Grid>

                <div style={{ overflowX: 'auto' }}>
                  {/* Cabeçalhos da tabela */}
                  <Header>
                    {headerGroups.map(headerGroup => (
                      <div
                        {...headerGroup.getHeaderGroupProps()}
                        className="header-row"
                      >
                        {headerGroup.headers.map(column => (
                          <div
                            {...column.getHeaderProps(
                              column.getSortByToggleProps(),
                            )}
                            className="header-cell"
                          >
                            {column.render('Header')}
                          </div>
                        ))}
                      </div>
                    ))}
                  </Header>

                  {/* Corpo da tabela usando react-window */}
                  <div style={{ width: '100%', overflowY: 'auto' }}>
  <List
      height={400} // Altura visível da tabela (ajuste conforme necessário)
      itemCount={rows.length} // Número total de itens
      itemSize={50} // Altura de cada linha
      
    width={window.innerWidth > 768 ? '100%' : 600} // largura no mobile
  >
    {Row}
  </List>
</div>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default connect()(Products);
