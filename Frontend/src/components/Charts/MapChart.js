import React, { useState, useEffect } from 'react';
import { ResponsiveChoropleth } from '@nivo/geo';

const SalesMap = ({ data }) => {
  const [estadoSelecionado, setEstadoSelecionado] = useState(null);
  const [mapData, setMapData] = useState(null);

  // Função para formatar os dados para o Nivo Choropleth
  const formatDataForChoropleth = (estadoCidadesMap) => {
    const estados = Object.keys(estadoCidadesMap).map(estado => ({
      id: estado,
      value: estadoCidadesMap[estado].quantidadeTotal
    }));

    const cidadesPorEstado = {};
    Object.keys(estadoCidadesMap).forEach(estado => {
      cidadesPorEstado[estado] = Object.keys(estadoCidadesMap[estado].cidades).map(cidade => ({
        id: cidade,
        value: estadoCidadesMap[estado].cidades[cidade].valor
      }));
    });

    return { estados, cidadesPorEstado };
  };

  // Atualizar os dados de mapa quando os dados forem fornecidos
  useEffect(() => {
    if (data) {
      const formattedData = formatDataForChoropleth(data);
      setMapData(formattedData);
    }
  }, [data]);

  const handleEstadoClick = (feature) => {
    const estadoId = feature.id;
    setEstadoSelecionado(estadoId);
  };

  // Verificar se mapData está pronto
  if (!mapData) return null;

  return (
    <div style={{ height: '500px' }}>
      <ResponsiveChoropleth
        data={mapData.estados}
        features={[]}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        colors={['#61cdbb', '#97e3d5', '#e8c1a0', '#f47560']}
        domain={[0, Math.max(...mapData.estados.map(item => item.value))]}
        unknownColor="#666666"
        label="id"
        valueFormat=".2s"
        projectionScale={800}
        projectionTranslation={[0.5, 0.6]}
        projectionRotation={[0, 0, 0]}
        enableGraticule={true}
        graticuleLineColor="#dddddd"
        onClick={handleEstadoClick}
      />
      {estadoSelecionado && (
        <div style={{ marginTop: '20px' }}>
          <h2>{estadoSelecionado}</h2>
          <ul>
            {mapData.cidadesPorEstado[estadoSelecionado].map(cidade => (
              <li key={cidade.id}>
                {cidade.id}: {cidade.value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SalesMap;
