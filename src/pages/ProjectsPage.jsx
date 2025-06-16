import React, { useState } from "react";
import "../App.css";
import Card from "../components/Card";
import axios from "axios";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
	const [students, setStudents] = useState([]);
  const [newProject, setNewProject] = useState(
		{ 
			name: "", 
			description: "", 
			studentId: null
		}
	);
  const isAdmin = localStorage.getItem("isAdmin") || "false";

	React.useEffect(() => {
		fetchProjects();
		fetchStudents();
	}, []);

	const fetchProjects = () => {
		axios.get("https://monosortcoffee.ru/scsp/projects", {
			headers: {
				"Authorization": `Bearer ${localStorage.getItem("token")}`
			}
		})
		.then((res) => {
			console.log(res.data);
			setProjects(res.data)
		})
		.catch((err) => {
			
		});
	};

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newProject.name || !newProject.description) return;
		axios.post("https://monosortcoffee.ru/scsp/projects",
			newProject,
			{
			headers: {
				"Authorization": `Bearer ${localStorage.getItem("token")}`
			}
		})
		.then((res) => {
			console.log(res);
			fetchProjects();
			setNewProject({ name: "", description: "" });
		})
		.catch((err) => {

		});
  };

	const fetchStudents = () => {
		axios.get("https://monosortcoffee.ru/scsp/user/students", {
			headers: {
				"Authorization": `Bearer ${localStorage.getItem("token")}`
			}
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
      {isAdmin === "true" && (
        <>
        	<form className="add-project-form" onSubmit={handleAddProject}>
	          <input
	            type="text"
	            placeholder="Название проекта"
	            value={newProject.name}
	            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
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
					<div className="student-select">
						<select
							value={newProject.studentId}
							onChange={(e) => setNewProject({ ...newProject, studentId: e.target.value })}
						>
							<option
								disabled
								defaultChecked 
								value=""
								onChange={(e) => setNewProject({ ...newProject, studentId: e.target.value })}
							>Выберите студента</option>
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