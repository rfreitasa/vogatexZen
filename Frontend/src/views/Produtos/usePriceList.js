import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API } from '../../config/api';

const usePriceList = (user_id, email, token, sort_default) => {
  const [priceList, setPriceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPriceList, setSelectedPriceList] = useState('');

  useEffect(() => {
    const sortList = (list, defaultOrder) => {
      let sortedList = [...list];

      if (defaultOrder === 'CRESCENTE') {
        sortedList = sortedList.sort((a, b) => a.label.localeCompare(b.label));
      } else if (defaultOrder === 'DECRESCENTE') {
        sortedList = sortedList.sort((a, b) => b.label.localeCompare(a.label));
      }
      return sortedList;
    };

    const getListPrice = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API.regras}/atribuidas?email=${email}&usuario=${user_id}`,
          {
            headers: {
              'x-access-token': token,
            },
          },
        );

        const lista = response.data.data.map(item => ({
          value: item.LISTA_PRECOS_ID,
          label: `${item.LISTA_PRECOS_NOME}-${item.LISTA_PRECOS_DESCRICAO}`,
          selected: item.SELECIONADO,
          default: item.LISTA_PRECOS_DEFAULT === 'sim',
        }));
        const sortedList = sortList(lista, sort_default);
        const selectedItems = sortedList.filter(
          item => item.selected === 'selected',
        );

        // Lógica para definir o selectedPriceList
        if (sortedList.length === 1) {
          setSelectedPriceList(sortedList[0].value);
        } else if (selectedItems.length > 0) {
          setSelectedPriceList(selectedItems[0].value);
        } else {
          // Se nenhum item for default, define o primeiro como default
          setSelectedPriceList(sortedList[0]?.value || '');
        }

        setPriceList(selectedItems);
      } catch (err) {
        toast.error('Erro ao carregar lista de preços de venda.');
      } finally {
        setLoading(false);
      }
    };

    getListPrice();
  }, [user_id, email, token]);
  return { priceList, loading, selectedPriceList };
};

export default usePriceList;
