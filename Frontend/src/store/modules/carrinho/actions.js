export function addCart(data) {
  return {
    type: "@carrinho/ADD_TO_CART",
    payload: { data }
  };
}
