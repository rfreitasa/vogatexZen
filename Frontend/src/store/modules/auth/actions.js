export function signInRequest(email, password) {
  return {
    type: '@auth/SIGN_IN_REQUEST',

    payload: {
      email,
      password,
    },
  };
}

export function refreshToken(tokenA) {
  return {
    type: '@auth/REFRESH_TOKEN',

    payload: {
      tokenA,
    },
  };
}

export function signInSuccess(
  token,
  perfil,
  email,
  id,
  id_erp,
  ordenacao_lista,
  frete,
  frete_redesp,
  exibe_obs,
  restricoes,
) {
  return {
    type: '@auth/SIGN_IN_SUCCESS',

    payload: {
      token,
      perfil,
      email,
      id,
      id_erp,
      ordenacao_lista,
      frete,
      frete_redesp,
      exibe_obs,
      restricoes: restricoes || [],
    },
  };
}

export function signInFailure() {
  return {
    type: '@auth/SIGN_FAILURE',
  };
}

export function signOut() {
  return {
    type: '@auth/SIGN_OUT',
  };
}
