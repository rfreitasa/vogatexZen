export default function formatMoney(money, isFormate) {
  if (isFormate) {
    const a = Number(money);
    return a.toString();
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(money));
}
