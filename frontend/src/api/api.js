const API_URL = "http://localhost:8000";

export async function login(username, password) {
  const params = new URLSearchParams();
  params.append("username", username);
  params.append("password", password);

  const res = await fetch(`${API_URL}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });
  if (!res.ok) throw new Error("Ошибка входа");
  return await res.json();
}

export async function register(name, email, password) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Ошибка регистрации");
  }
}

export async function fetchNotes(token) {
  const res = await fetch(`${API_URL}/users/me/notes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Не удалось загрузить заметки");
  return await res.json();
}

export async function createNote(token, note) {
  const res = await fetch(`${API_URL}/users/me/notes/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(note),
  });
  if (!res.ok) throw new Error("Ошибка создания заметки");
  return await res.json();
}

export async function updateNote(token, id, note) {
  const res = await fetch(`${API_URL}/users/me/notes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(note),
  });
  if (!res.ok) throw new Error("Ошибка обновления заметки");
  return await res.json();
}

export async function deleteNote(token, id) {
  const res = await fetch(`${API_URL}/users/me/notes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Ошибка удаления заметки");
  return await res.json();
}

export async function fetchUserProfile(token) {
  const res = await fetch(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Ошибка загрузки профиля");
  return await res.json();
}

export async function updateUserProfile(token, profile) {
  const res = await fetch(`${API_URL}/users/me`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(profile),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Ошибка обновления профиля");
  }
  return await res.json();
}

export async function deleteUserAccount(token) {
  const res = await fetch(`${API_URL}/users/me`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status !== 204) {
    throw new Error("Ошибка удаления аккаунта");
  }
}