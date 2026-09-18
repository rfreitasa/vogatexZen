export function listRequest(token, email) {
  return {
    type: "@produtos/REQUESTLIST",
    payload: { token, email }
  };
}

export function list(list) {
  return {
    type: "@produtos/LIST",
    payload: { list }
  };
}

export function create(email, password) {
  return {
    type: "@produtos/CREATE",
    payload: { email, password }
  };
}

export function update(token, data) {
  return {
    type: "@produtos/UPDATE",
    payload: { token, data }
  };
}

export function dell() {
  return {
    type: "@produtos/DELETE"
  };
}
