export function listRequest(token, email) {
  return {
    type: "@pedidos/REQUESTLIST",
    payload: { token, email }
  };
}

export function list(list) {
  return {
    type: "@pedidos/LIST",
    payload: { list }
  };
}

export function create(email, password) {
  return {
    type: "@pedidos/CREATE",
    payload: { email, password }
  };
}

export function update(token, data) {
  return {
    type: "@pedidos/UPDATE",
    payload: { token, data }
  };
}

export function dell() {
  return {
    type: "@pedidos/DELETE"
  };
}
