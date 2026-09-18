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
import CustomTable from '../../components/Table/CustomTable';

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
  const [globalFilter, setGlobalFilter] = useState('');

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

  const inputRefs = useRef({}); // Usando um objeto para armazenar as referências dinamicamente


  const checkItemBalance = async item => {
    try {
      const response = await axios.get(
        `${API.consultasaldo}?email=${email}&item_id=${item.ITEM_ID}&empresa_id=${item.EMPRESA_ID}&tipo_venda=${item.PROGRAMACAO_ID}`,
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
  const handleQuantityChange = (e, index) => {
    const newQuantity = e.target.value;
    const updatedList = listCart.map((item, idx) =>
      idx === index ? { ...item, QUANTIDADE: newQuantity } : item,
    );
    setListCart(updatedList);

    // Move o foco para o próximo campo (valor unitário) após a atualização
    if (inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleUnitPriceChange = (e, index) => {
    const newUnitPrice = e.target.value;
    const updatedList = listCart.map((item, idx) =>
      idx === index
        ? { ...item, ITEM_VALOR_UNITARIO_ESCOLHIDO: newUnitPrice }
        : item,
    );
    setListCart(updatedList);

    // Move o foco para o próximo campo (quantidade) após a atualização
    if (inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const sendCartDataToBackend = (row, newQuantity, newValue, type,key) => {
    if (hasDifferentListPriceUsed()) {
      toast(
        'Há itens no carrinho com outra lista de preço, para incluir item considerando essa lista de preço, limpe o carrinho.',
        { autoClose: 5000 },
      );
    } else {
      if (newQuantity > 0 && newValue > 0) {
        setLoadingSendCart(true);
        const dataSendCart = {
          email: email,
          item_id: row.ITEM_ID,
          codigo: row.ITEM_CODIGO,
          item_nome: row.ITEM_NOME,
          item_grade: row.ITEM_GRADE,
          item_unidade: row.ITEM_UNIDADE,
          empresa_id_erp: row.EMPRESA_ID,
          empresa_apelido: row.EMPRESA_APELIDO,
          data_programacao: row.ITEM_PREVISAO,
          quantidade: newQuantity,
          lista_preco_id: selectedPriceList,
          valor_unitario: newValue,
          valor_unitario_padrao: row.ITEM_VALOR_UNITARIO,
          tipo_venda: row.PE_OU_PROG,
          programacao_numero: row.PROGRAMACAO_ID,
          programacao_item_id: row.ITEM_ID,
          pedido_num: row.PEDIDO_NUM,
        };
        console.log('0');
        axios
          .post(`${API.adicionaaocarrinho}`, dataSendCart, {
            headers: { 'x-access-token': token },
          })
          .then(async response => {
            console.log(row);
            fetchCart(); // Recarrega o carrinho
            const itemBalance = await checkItemBalance(row);
            console.log('4');
            if (type === 'quantidade') {
              setListCart(prevListCart =>
                prevListCart.map((item, index) =>
                  index === row.realIndex
                    ? {
                        ...item,
                        QUANTIDADE:
                          type === 'quantidade'
                            ? newQuantity
                            : item.QUANTIDADE,
                        ITEM_SALDO: (itemBalance - newQuantity).toFixed(2),
                      }
                    : item,
                ),
              );
              setLoadingSendCart(false);
            } else if (type === 'valor_unitario') {
              setListCart(prevTableData =>
                prevTableData.map((item, index) =>
                  index === row.realIndex
                    ? {
                        ...item,
                        ITEM_SALDO: (itemBalance - newQuantity).toFixed(2),
                        ITEM_VALOR_UNITARIO_ESCOLHIDO: newValue,
                      }
                    : item,
                ),
              );
              setLoadingSendCart(false);
              handleFocus(key)
            }
          })
          .catch(error => {
            toast('Erro ao inserir.', { autoClose: 5000 });
            setLoadingSendCart(false);
          });
      }
    }
  };
  const handleFocus = (index, type) => {
    // Divide o index em linha (row) e coluna (col)
    const [row, col] = index.split('-').map(Number);
  
    let nextIndex;
    // Se a coluna for 0 (quantidade), move para a próxima coluna da mesma linha (valorUnitario)
    if (col === 0) {
      nextIndex = `${row}-${col + 1}`;
    }
    // Se a coluna for 1 (valorUnitario), move para a primeira coluna da próxima linha (quantidade)
    else if (col === 1) {
      nextIndex = `${row + 1}-0`;
    }

   // const nextInput = document.getElementById(nextIndex);
 //   console.log(nextInput)
//nextInput.focus();

  console.log(nextIndex)
    // Acesse o próximo campo através de inputRefs
    if (inputRefs.current[nextIndex]) {
      inputRefs.current[nextIndex].focus();
    }
      
  };
  
  const handleFocusChange = (rowIndex, field) => {
    if (field === 'quantidade' && inputRefs.current[rowIndex + 1]) {
      inputRefs.current[rowIndex + 1].focus();
    } else if (field === 'valorUnitario' && inputRefs.current[rowIndex + 1]) {
      inputRefs.current[rowIndex + 1].focus();
    }
  };


  const handleBlur = (
    value,
    rowIndex,
    listCart,
    setListCart,
    sendCartDataToBackend,
    field,
  ) => {
    const parsedValue = parseFloat(value);
    if (parsedValue > 0) {
      const updatedList = listCart.map((item, index) =>
        index === rowIndex ? { ...item, [field]: parsedValue } : item,
      );
      setListCart(updatedList);
      sendCartDataToBackend(rowIndex, parsedValue, field);
    } else {
      toast(`O ${field} deve ser maior que zero.`, { autoClose: 3000 });
    }
  };
  const formatCurrency = value => {
    return value
      ? parseFloat(value)
          .toFixed(2)
          .replace('.', ',')
      : '0,00';
  };

  const parseCurrency = value => {
    return parseFloat(value.replace(',', '.')) || 0;
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

  const handleGlobalFilterChange = filterValue => {
    setGlobalFilter(filterValue);
  };

  const columns = [
    { Header: 'Código', accessor: 'ITEM_CODIGO', width: '10%', align: 'left' },
    { Header: 'Nome', accessor: 'ITEM_NOME', width: '20%', align: 'left' },
    { Header: 'Variante', accessor: 'ITEM_GRADE', width: '10%', align: 'left' },
    { Header: 'Prog', accessor: 'PE_OU_PROG', width: '10%', align: 'left' },
    {
      Header: 'Empresa',
      accessor: 'EMPRESA_APELIDO',
      width: '10%',
      align: 'left',
    },
    {
      Header: 'Disponível',
      accessor: 'ITEM_SALDO',
      width: '10%',
      align: 'left',
      Cell: ({ value }) => formatDecimal(value > 0 ? value : 0),
    },
    {
      Header: 'Quantidade',
      accessor: 'QUANTIDADE',
      Cell: ({ value, rowIndex, columnIndex }) => {
        const [quantity, setQuantity] = useState(value);
        
        const inputId = `${rowIndex}-0`;

        const handleQuantityBlur = () => {
          const parsedQuantity = parseFloat(quantity);
          if (parsedQuantity > 0) {
            const updatedList = listCart.map((item, index) =>
              index === rowIndex
                ? { ...item, QUANTIDADE: parsedQuantity }
                : item,
            );
            setListCart(updatedList);
            sendCartDataToBackend(
              value,
              parsedQuantity,
              value.ITEM_VALOR_UNITARIO_ESCOLHIDO,
              'quantidade',
              inputId,
            );
          }
       
       //   handleFocus(inputId);
        };

        return (
          <TextField
          {...register('quantidade')}
          id={inputId}
          key={rowIndex}
          inputRef={el => (inputRefs.current[inputId] = el)}
            
            type="number"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            onBlur={handleQuantityBlur}
           
          />
        );
      },
    },
    {
      Header: 'Valor Unitário',
      accessor: 'VALOR_UNITARIO',
      Cell: ({ value, rowIndex, columnIndex }) => {
        const [unitPrice, setUnitPrice] = useState(formatCurrency(value));
        
        const inputIdvl = `${rowIndex}-1`;

        const handleUnitPriceBlur = () => {
          const parsedValue = parseCurrency(unitPrice);
          if (parsedValue > 0) {
            const updatedList = listCart.map((item, index) =>
              index === rowIndex
                ? { ...item, VALOR_UNITARIO: parsedValue }
                : item,
            );
            setListCart(updatedList);
          }

      //    focusNextInput(rowIndex, columnIndex); // Focar no próximo input
        };

        return (
          <TextField
          {...register('vlunitario')}
          id={inputIdvl}
          key={rowIndex}
          inputRef={el => (inputRefs.current[inputIdvl] = el)}
          
            type="text"
            value={unitPrice}
            onChange={e => setUnitPrice(e.target.value)}
            onBlur={handleUnitPriceBlur}
          />
        );
      },
    },
  ];

  console.log('passou');
  // Use o hook useTable e usePagination

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

                  {/* Corpo da tabela usando react-window */}
                  <div style={{ width: '100%', overflowY: 'auto' }}>
                    <CustomTable
                      columns={columns}
                      data={listCart}
                      onRowClick={row => console.log(row)}
                      globalFilter={globalFilter}
                      onGlobalFilterChange={handleGlobalFilterChange}
                    />
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
