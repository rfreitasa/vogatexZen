export default function formatDecimal(numero) {
  // Verifica se numero é uma string e tenta converter para número
  if (typeof numero === 'string') {
    numero = parseFloat(numero);
  } else if (typeof numero !== 'number') {
    // Se não for uma string ou número, retorna diretamente
    return numero;
  }

  // Verifica se numero agora é um número válido
  if (!isNaN(numero)) {
    return numero.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, '$1.');
  } else {
    return ''; // Ou outra ação adequada em caso de erro
  }
}
