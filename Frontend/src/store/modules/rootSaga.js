import { all } from "redux-saga/effects";

import auth from "./auth/sagas";
import user from "./user/sagas";
import produtos from "./produtos/sagas";
import carrinho from "./carrinho/sagas";

export default function* rootSaga() {
  return yield all([auth, user, produtos, carrinho]);
}
