import produce from "immer";

const INITIAL_STATE = {
  cart: []
};

export default function carrinho(state = INITIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case "@carrinho/ADD_TO_CART": {
        draft.cart = [];
        draft.cart = action.payload.data;
        break;
      }
      case "@auth/SIGN_OUT": {
        draft.cart = "";
        break;
      }
      default:
    }
  });
}
