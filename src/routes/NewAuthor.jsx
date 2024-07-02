import "./NewPost.css";
import blogFetch from "../axios/config.js";
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

function NewAuthor() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [authors, setAuthors] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editAuthorId, setEditAuthorId] = useState(null);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await blogFetch.get('/authors');
        setAuthors(response.data);
      } catch (error) {
        console.error('Error fetching authors', error);
      }
    };

    fetchAuthors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editMode) {
      await saveEditAuthor();
    } else {
      await createAuthor();
    }
  };

  const createAuthor = async () => {
    const newAuthor = { name };

    try {
      const response = await blogFetch.post('/authors', newAuthor);
      setAuthors([...authors, response.data]);
      setName('');
    } catch (error) {
      console.error('Error creating author', error);
    }
  };

  const deleteAuthor = async (id) => {
    const confirmed = window.confirm("Tem certeza de que deseja apagar este autor?");
    if (!confirmed) {
      return;
    }

    try {
      await blogFetch.delete(`/authors/${id}`);
      setAuthors(authors.filter((author) => author.id !== id));
    } catch (error) {
      console.error('Error deleting author', error);
    }
  };

  const startEditAuthor = (author) => {
    setEditMode(true);
    setEditAuthorId(author.id);
    setName(author.name);
  };

  const saveEditAuthor = async () => {
    try {
      await blogFetch.put(`/authors/${editAuthorId}`, { name });
      setAuthors(
        authors.map((author) =>
          author.id === editAuthorId ? { ...author, name } : author
        )
      );
      setEditMode(false);
      setEditAuthorId(null);
      setName('');
    } catch (error) {
      console.error('Error updating author', error);
    }
  };

  return (
    <div className="new-post">
      <h2>{editMode ? "Editar Autor" : "Cadastrar Autor"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-control">
          <label htmlFor="name" style={{ color: 'white' }}>Nome:</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Digite o nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input type="submit" value={editMode ? "Salvar" : "Cadastrar"} className="btn" />
        </div>
      </form>
      <h2>Autores Cadastrados:</h2>
      <ul>
        {authors.map((author) => (
          <li key={author.id}>
            {author.name}
            <div className="btn-container">
              <button onClick={() => startEditAuthor(author)} className="btn-edit">Editar</button>
              <button onClick={() => deleteAuthor(author.id)} className="btn-delete">Apagar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NewAuthor;
