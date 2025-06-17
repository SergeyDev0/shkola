import axios from "axios";
import React, { useState, useEffect } from "react";

const Card = ({ data, fetchProjects }) => {
  const [comment, setComment] = useState("");
	const [comments, setComments] = useState([]);
	const [files, setFiles] = useState([]);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadError, setUploadError] = useState("");
	const [selectedFileName, setSelectedFileName] = useState(""); 
  const isAdmin = localStorage.getItem("isAdmin") || "false";

	useEffect(() => {
		if (data.id) {
			fetchComments();
			fetchFiles();
		}
	}, [data.id]);

	React.useEffect(() => {
		console.log(files)
	}, [files]);

	const fetchFiles = () => {
		axios.get(`https://monosortcoffee.ru/scsp/files/list?projectId=${data.id}`,
		{
			headers: {
				"Authorization": `Bearer ${localStorage.getItem("token")}`
			}
		})
		.then((res) => {
			setFiles(res.data);
			setUploadError("");
		})
		.catch((err) => {
			console.error("Ошибка при загрузке файлов:", err);
			setUploadError("Не удалось загрузить список файлов");
		});
	};

	const handleFileDownload = (id) => {
    const file = files.find(f => f.id === id);
		axios.get(`https://monosortcoffee.ru/scsp/files/download/${id}`,
		{
			headers: {
				"Authorization": `Bearer ${localStorage.getItem("token")}`
			},
			responseType: 'blob'
		})
		.then((response) => {
			let fileName = file && file.fileName ? file.fileName : data.name;
			const disposition = response.headers['content-disposition'];
			if (disposition && disposition.indexOf('filename=') !== -1) {
				const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
				if (matches != null && matches[1]) {
					fileName = decodeURIComponent(matches[1].replace(/['"]/g, ''));
				}
			}
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', fileName);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		})
		.catch((error) => {
			console.error("Ошибка при скачивании файла:", error);
			setUploadError("Не удалось скачать файл");
		});
	}

	const handleFileUpload = async (e, projectId) => {
    const file = e.target.files[0];
    if (!file) return;

		axios.post(`https://monosortcoffee.ru/scsp/files/upload?projectId=${data.id}`,
		{ file },
		{
			headers: {
				"Authorization": `Bearer ${localStorage.getItem("token")}`,
				"Content-Type": "multipart/form-data"
			}
		})
		.then((res) => {
			console.log(res)
			fetchFiles();
		})
		.catch((err) => {
			console.error("Ошибка при загрузке файлов:", err);
			setUploadError("Не удалось загрузить список файлов");
		});

    // Проверка размера файла (10MB максимум)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Файл слишком большой. Максимальный размер: 10MB");
      setSelectedFileName("");
      return;
    }

    setIsUploading(true);
    setUploadError("");
  };

	const fetchComments = () => {
		axios.get(`https://monosortcoffee.ru/scsp/comment/${data.id}`,
		{
			headers: {
				"Authorization": `Bearer ${localStorage.getItem("token")}`
			}
		})
		.then((res) => {
			console.log(res);
			setComments(res.data);
		})
		.catch((err) => {

		});
	};

	const handleAddComment = (id) => {
    if (!comment) return;

		axios.post(`https://monosortcoffee.ru/scsp/comment`,
		{
			"projectId": data.id,
			"comment": comment,
		},
		{
			headers: {
				"Authorization": `Bearer ${localStorage.getItem("token")}`
			}
		})
		.then((res) => {
			console.log(res);
			fetchComments();
    	setComment("");
		})
		.catch((err) => {

		});
  };

	const handleDeleteProject = (id) => {
		axios.delete(`https://monosortcoffee.ru/scsp/projects/${id}`,
		{
			headers: {
				"Authorization": `Bearer ${localStorage.getItem("token")}`
			}
		})
		.then((res) => {
			console.log(res);
			fetchProjects();
		})
		.catch((err) => {
			console.error(err);
		});
	};
  return (
    <div className="project-card" key={data.id}>
      <h3>{data.name}</h3>
      <p>{data.description}</p>
      
      {/* Секция с файлами */}
      <div className="files-section">
        <h4>Файлы проекта</h4>
        
        {/* Список файлов */}
        <div className="files-list">          
					{files.map((file, index) => (
            <div key={index} className="file-item">
              <div className="file-info">
                <a
                  onClick={() => handleFileDownload(file.id)}
                  className="file-link"
                >
                  {file.fileName}
                </a>
                {file.uploadDate && (
                  <span className="file-date">
                    {new Date(file.uploadDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Форма загрузки файла */}
        {isAdmin === "false" && (
          <div className="file-upload-form">
            {uploadError && (
              <div className="file-upload-error">{uploadError}</div>
            )}
            
            <div className={`file-input-wrapper ${isUploading ? 'uploading' : ''}`}>
              <input
                type="file"
                onChange={(e) => handleFileUpload(e, data.id)}
                className="file-input"
                id={`file-upload-${data.id}`}
                disabled={isUploading}
              />
              <label htmlFor={`file-upload-${data.id}`} className="file-input-label">
                {isUploading ? 'Загрузка...' : selectedFileName || 'Выберите файл'}
              </label>
              <div className="file-input-info">
                {selectedFileName ? `Выбран файл: ${selectedFileName}` : 'Максимальный размер: 2MB'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Остальной контент */}
      <div className="project-comments">
        <strong>Комментарии:</strong>
        <ul>
          {comments.map((c, idx) => (
            <li key={idx}>
              <strong>{c.name}:</strong> {c.comment}
            </li>
          ))}
        </ul>
        {isAdmin === "true" && (
          <div className="comment-form">
            <input
              type="text"
              placeholder="Добавить комментарий"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              onClick={() => handleAddComment(data.id)}
              className="main-btn"
            >
              Добавить
            </button>
          </div>
        )}
      </div>
      {isAdmin === "true" && (
        <button
          className="delete-btn"
          onClick={() => handleDeleteProject(data.id)}
        >
          Удалить проект
        </button>
      )}
    </div>
  );
};

export default Card;
