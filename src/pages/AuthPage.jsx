import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({ email: "", password: "", name: "", surname: "", patronymic: "", roleId: 1 });
  const navigate = useNavigate();

	React.useEffect(() => {
		console.log(form)
	}, [form.roleId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
		console.log({ ...form, [e.target.name]: e.target.value })
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(isRegister) {
      axios.post("https://monosortcoffee.ru/scsp/user/create",
        {
          "name": form.name,
          "surname": form.surname,
          "patronymic": form.patronymic,
          "email": form.email,
          "password": form.password,
          "roleId": form.roleId
        }
      )
      .then((res) => {
				console.log(res)
        if (res.status === 200) {
					setIsRegister(false);
        }
      })
      .catch((err) => console.error(err));
    } else {
      axios.post("https://monosortcoffee.ru/scsp/user/login",
        {
          "email": form.email,
          "password": form.password
        }
      )
      .then((res) => {
				console.log(res);
        if (res.data.accessToken) {
          localStorage.setItem('token', res.data.accessToken);
					localStorage.setItem('isAdmin', res.data.isAdmin);
          navigate('/projects');
        }
      })
      .catch((err) => console.error(err));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isRegister ? "Регистрация" : "Вход"}</h2>
        <div className="role-switch">
          <button
            className={form.roleId === 1 ? "active" : ""}
            onClick={() => setForm({ ...form, ["roleId"]: 1 })}
          >
            Ученик
          </button>
          <button
            className={form.roleId === 2 ? "active" : ""}
            onClick={() => setForm({ ...form, ["roleId"]: 2 })}
          >
            Преподаватель
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
            	<input
	              type="text"
	              name="name"
	              placeholder="Имя"
	              value={form.name}
	              onChange={handleChange}
	              required
	            />
							<input
	              type="text"
	              name="surname"
	              placeholder="Фамилия"
	              value={form.surname}
	              onChange={handleChange}
	              required
	            />
							<input
	              type="text"
	              name="patronymic"
	              placeholder="Отчество"
	              value={form.patronymic}
	              onChange={handleChange}
	              required
	            />
            </>
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