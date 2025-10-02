import { useState, useEffect } from "react";
import * as util from "../util";

export default function UserProfile({ profile, onLogout, onUpdateProfile, onDeleteAccount }) {
  const [form, setForm] = useState({ username: "", email: "" });
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (profile) {
      setForm({ username: profile.name || "", email: profile.email || "" });
      setError("");
    }
  }, [profile]);

  const saveProfile = async () => {
    setError("");
    let errorMsg = util.validateUserName(form.username);
    if (errorMsg) {
      setError(errorMsg);
      return;
    }
    errorMsg = util.validateEmail(form.email);
      if (errorMsg) {
      setError(errorMsg);
      return;
    }

    try {
      await onUpdateProfile({ name: form.username.trim(), email: form.email.trim()? form.email.trim() : null});
      setEditMode(false);
    } catch (err) {
      setError(err.message || "Ошибка сохранения профиля");
    }
  };


  if (!profile) {
    return <div>Загрузка профиля...</div>;
  }

  return (
    <div>
      <h2>{editMode ? "Редактировать профиль":"Профиль пользователя"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!editMode ? (
        <>
          <p>
            <b>Имя:</b> {profile.name}
          </p>
          <p>
            <b>Email:</b> {profile.email || "Не указан"}
          </p>
          <p>
            <b>Дата создания:</b> {new Date(profile.created_at).toLocaleString()}
          </p>
          <p>
            <b>Последнее обновление:</b> {new Date(profile.updated_at).toLocaleString()}
          </p>
          <button onClick={() => setEditMode(true)}>Редактировать профиль</button>
          <button onClick={onLogout} style={{ marginLeft: 10 }}>
            Выйти
          </button>
          <button onClick={onDeleteAccount} style={{ marginLeft: 10, color: "red" }}>
            Удалить аккаунт
          </button>
        </>
      ) : (
        <div style={{ maxWidth: 300 }}>
          <label>
            Имя: <br />
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              autoComplete="username"
              required
            />
          </label>
          <br />
          <label>
            Email: <br />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              autoComplete="email"
            />
          </label>
          <br />
          <button onClick={saveProfile}>Сохранить</button>
          <button
            onClick={() => {
              setEditMode(false);
              setError("");
              setForm({ username: profile.name || "", email: profile.email || "" });
            }}
            style={{ marginLeft: 10 }}
          >
            Отменить
          </button>
        </div>
      )}
    </div>
  );
}
