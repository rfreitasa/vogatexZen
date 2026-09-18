import produce from "immer";

const INITIAL_STATE = {
  token: null,
  email: null,
  listpedidos: []
};

export default function pedidos(state = INITIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case "@pedidos/REQUESTLIST": {
        draft.email = action.payload.email;
        draft.token = action.payload.token;
        break;
      }
      case "@pedidos/LIST": {
        draft.listpedidos = action.payload.list;
        break;
      }
      case "@pedidos/CREATE": {
        break;
      }
      case "@pedidos/UPDATE": {
        break;
      }
      case "@pedidos/DELETE": {
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
        draft.listpedidos = [];
        break;
      }
      default:
    }
  });
}
