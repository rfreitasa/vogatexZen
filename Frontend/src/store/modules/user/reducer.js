import produce from "immer";

const INITIAL_STATE = {
  profile: null,
  email: null,
  id: null,
  id_erp: null,
  ordenacao_lista: null,
  frete: null,
  frete_redesp: null,
  exibe_obs: null,
  restricoes: [],
};

export default function user(state = INITIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case "@auth/SIGN_IN_SUCCESS": {
        draft.profile = action.payload.perfil;
        draft.email = action.payload.email;
        draft.id = action.payload.id;
        draft.id_erp = action.payload.id_erp;
        draft.ordenacao_lista = action.payload.ordenacao_lista;
        draft.frete = action.payload.frete;
        draft.frete_redesp = action.payload.frete_redesp;
        draft.exibe_obs = action.payload.exibe_obs;
        draft.restricoes = action.payload.restricoes || [];

        break;
      }

      case "@auth/SIGN_OUT": {
        draft.profile = null;
        draft.email = null;
        draft.id = null;
        draft.id_erp = null;
        draft.ordenacao_lista = null;
        draft.frete = null;
        draft.frete_redesp = null;
        draft.exibe_obs = null;
        draft.restricoes = [];

        break;
      }

      default:
    }
  });
}