import React, { useState } from "react";
import "../App.css";

const initialProjects = [
  {
    id: 1,
    title: "Экологический мониторинг",
    description: "Проект по исследованию состояния окружающей среды.",
    files: [],
    comments: ["Отличная работа!"],
  },
  {
    id: 2,
    title: "История родного края",
    description: "Изучение исторических памятников региона.",
    files: [],
    comments: [],
  },
];

const ProjectsPage = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [newProject, setNewProject] = useState({ title: "", description: "" });
  const [comment, setComment] = useState("");
  const role = localStorage.getItem("role") || "student";

  const handleFileUpload = (e, projectId) => {
    const file = e.target.files[0];
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, files: [...p.files, file.name] }
          : p
      )
    );
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newProject.title || !newProject.description) return;
    setProjects([
      ...projects,
      {
        id: Date.now(),
        title: newProject.title,
        description: newProject.description,
        files: [],
        comments: [],
      },
    ]);
    setNewProject({ title: "", description: "" });
  };

  const handleDeleteProject = (id) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const handleAddComment = (id) => {
    if (!comment) return;
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, comments: [...p.comments, comment] } : p
      )
    );
    setComment("");
  };

  return (
    <div className="projects-container">
      <h2 className="section-title">Проекты</h2>
      {role === "teacher" && (
        <form className="add-project-form" onSubmit={handleAddProject}>
          <input
            type="text"
            placeholder="Название проекта"
            value={newProject.title}
            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Описание проекта"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            required
          />
          <button type="submit" className="main-btn">Создать проект</button>
        </form>
      )}
      <div className="projects-list">
        {projects.map((project) => (
          <div className="project-card" key={project.id}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="project-files">
              <strong>Файлы:</strong>
              <ul>
                {project.files.map((file, idx) => (
                  <li key={idx}>{file}</li>
                ))}
              </ul>
              {role === "student" && (
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, project.id)}
                  className="file-input"
                />
              )}
            </div>
            <div className="project-comments">
              <strong>Комментарии:</strong>
              <ul>
                {project.comments.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
              {role === "teacher" && (
                <div className="comment-form">
                  <input
                    type="text"
                    placeholder="Добавить комментарий"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button onClick={() => handleAddComment(project.id)} className="main-btn">Добавить</button>
                </div>
              )}
            </div>
            {role === "teacher" && (
              <button className="delete-btn" onClick={() => handleDeleteProject(project.id)}>
                Удалить проект
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage; 