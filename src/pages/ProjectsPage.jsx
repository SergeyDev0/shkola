import React, { useState } from "react";
import "../App.css";
import Card from "../components/Card";
import axios from "axios";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    studentId: null,
  });
	const [search, setSearch] = useState("");
	const [sortByName, setSortByName] = useState(0);
	const [sortByTime, setSortByTime] = useState(0);

  const isAdmin = localStorage.getItem("isAdmin") || "false";

  React.useEffect(() => {
    fetchProjects();
    fetchStudents();
  }, []);

  const handleSearch = (e) => {
		e.preventDefault();

		// 0 - по убыванию имени, 1 - по возрастанию имени
		// 0 - по убыванию времени, 1 - по возрастанию времени
		axios
			.get(`https://monosortcoffee.ru/scsp/projects?${search && `Search=${search}&`}SortingOnName=${sortByName}&SortingOnDate=${sortByTime}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			})
			.then((res) => {
				console.log(res.data);
				setProjects(res.data);
			})
			.catch((err) => {
				console.error(err);
			});
		}

  const fetchProjects = () => {
    axios
      .get("https://monosortcoffee.ru/scsp/projects", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setProjects(res.data);
      })
      .catch((err) => {});
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newProject.name || !newProject.description) return;
    axios
      .post("https://monosortcoffee.ru/scsp/projects", newProject, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res);
        fetchProjects();
        setNewProject({ name: "", description: "" });
      })
      .catch((err) => {});
  };

  const fetchStudents = () => {
    axios
      .get("https://monosortcoffee.ru/scsp/user/students", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res);
        setStudents(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="projects-container">
      <h2 className="section-title">Проекты</h2>
      {/* Search form, mobile-friendly */}
      <form
        className="search-form"
        onSubmit={e => {
          handleSearch(e);
        }}
        style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}
      >
        <input
          type="text"
          placeholder="Поиск проектов..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
          style={{ flex: '1 1 50px', minWidth: 0, padding: '0.7rem', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '1rem' }}
        />
        <select
          className="search-select"
          value={sortByName}
          onChange={e => setSortByName(Number(e.target.value))}
        >
          <option value={0}>Имя: по убыванию</option>
          <option value={1}>Имя: по возрастанию</option>
        </select>
        <select
          className="search-select"
          value={sortByTime}
          onChange={e => setSortByTime(Number(e.target.value))}
        >
          <option value={0}>Время: по убыванию</option>
          <option value={1}>Время: по возрастанию</option>
        </select>
        <button
          type="submit"
          className="main-btn"
        >
          Найти
        </button>
      </form>
      {isAdmin === "true" && (
        <>
          <form className="add-project-form" onSubmit={handleAddProject}>
            <input
              type="text"
              placeholder="Название проекта"
              value={newProject.name}
              onChange={(e) =>
                setNewProject({ ...newProject, name: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Описание проекта"
              value={newProject.description}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
              required
            />
            <button type="submit" className="main-btn">
              Создать проект
            </button>
          </form>
          <div className="student-select">
            <select
              value={newProject.studentId}
              onChange={(e) =>
                setNewProject({ ...newProject, studentId: e.target.value })
              }
            >
              <option
                disabled
                defaultChecked
                value=""
                onChange={(e) =>
                  setNewProject({ ...newProject, studentId: e.target.value })
                }
              >
                Выберите студента
              </option>
              {students.map((student) => (
                <option value={student.id} key={student.id}>
                  {student.name} {student.surname} ({student.patronymic})
                </option>
              ))}
            </select>
          </div>
        </>
      )}
      <div className="projects-list">
        {projects.map((project) => (
          <Card data={project} key={project.id} fetchProjects={fetchProjects} />
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
