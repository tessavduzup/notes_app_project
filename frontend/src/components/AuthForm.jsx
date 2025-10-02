import { useState } from "react";
import * as util from "../util";

export default function AuthForm({ onLogin, onRegister}) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [localError, setError] = useState("");

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError("");
    setForm({ username: "", email: "", password: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    let errorMsg = util.validateUserName(form.username);
    if (errorMsg) {
      setError(errorMsg);
      return;
    }
    errorMsg = util.validatePassword(form.password);
    if (errorMsg){
      setError(errorMsg);
      return;
    }
    if (mode === "register") {
      errorMsg = util.validateEmail(form.email);
      if (errorMsg) {
      setError(errorMsg);
      return;
      }
    }
    try {
      if (mode === "login") {
        await onLogin(form.username.trim(), form.password);
      } else {
        await onRegister(form.username.trim(), form.email.trim() ? form.email.trim() : null, form.password);
      }
    } catch (err) {
      setError(err.message || "Ошибка при авторизации");
    }
  };

  const error = localError

  return (
    <div style={{ maxWidth: 300, margin: "auto" }}>
      <form onSubmit={handleSubmit} noValidate>
        <h2>{mode === "login" ? "Войти" : "Регистрация"}</h2>
        <input
          placeholder="Имя"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
          autoComplete="username"
        />
        {mode === "register" && (
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            autoComplete="email"
          />
        )}
        <input
          type="password"
          placeholder="Пароль"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          autoComplete={mode === "login" ? "current-password" : "new-password"}
        />
        <button type="submit">{mode === "login" ? "Войти" : "Зарегистрироваться"}</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {mode === "login" ? (
          <p onClick={toggleMode} style={{ cursor: "pointer", color: "blue" }}>
            Создать аккаунт
          </p>
        ) : (
          <p>
            Есть аккаунт?
            <span onClick={toggleMode} style={{ cursor: "pointer", color: "blue" }}>
              &nbsp;Войти
            </span>
          </p>
        )}
      </form>
    </div>
  );
}
