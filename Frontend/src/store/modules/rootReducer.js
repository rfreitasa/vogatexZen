import { combineReducers } from "redux";

import auth from "./auth/reducer";
import user from "./user/reducer";
import produtos from "./produtos/reducer";
import carrinho from "./carrinho/reducer";

export default combineReducers({
  auth,
  user,
  produtos,
  carrinho
});
