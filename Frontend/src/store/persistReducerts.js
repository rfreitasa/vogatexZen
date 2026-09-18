import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

export default reducers => {
  const persistedReducers = persistReducer(
    {
      key: "salesbreath",
      storage,
      whiteList: [ "user", "produtos", "carrinho"]
    },
    reducers
  );
  return persistedReducers;
};
