import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь должна быть интеграция с сервером/хранилищем
    localStorage.setItem("role", role);
    navigate("/projects");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isRegister ? "Регистрация" : "Вход"}</h2>
        <div className="role-switch">
          <button
            className={role === "student" ? "active" : ""}
            onClick={() => setRole("student")}
          >
            Ученик
          </button>
          <button
            className={role === "teacher" ? "active" : ""}
            onClick={() => setRole("teacher")}
          >
            Преподаватель
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <input
              type="text"
              name="name"
              placeholder="Имя"
              value={form.name}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="main-btn">
            {isRegister ? "Зарегистрироваться" : "Войти"}
          </button>
        </form>
        <p className="switch-link">
          {isRegister ? (
            <>
              Уже есть аккаунт?{' '}
              <span onClick={() => setIsRegister(false)}>Войти</span>
            </>
          ) : (
            <>
              Нет аккаунта?{' '}
              <span onClick={() => setIsRegister(true)}>Зарегистрироваться</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthPage; 