import produce from "immer";

const INITIAL_STATE = {
  token: null,
  email: null,
  listProducts: []
};

export default function produtos(state = INITIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case "@produtos/REQUESTLIST": {
        draft.email = action.payload.email;
        draft.token = action.payload.token;
        break;
      }
      case "@produtos/LIST": {
        draft.listProducts = action.payload.list;
        break;
      }
      case "@produtos/CREATE": {
        break;
      }
      case "@produtos/UPDATE": {
        break;
      }
      case "@produtos/DELETE": {
        break;
      }
      case "@auth/SIGN_IN_SUCCESS": {
        draft.email = action.payload.email;
        draft.token = action.payload.token;
        break;
      }
      case "@auth/SIGN_OUT": {
        draft.token = null;
        draft.email = null;
        draft.listProducts = [];
        break;
      }
      default:
    }
  });
}
