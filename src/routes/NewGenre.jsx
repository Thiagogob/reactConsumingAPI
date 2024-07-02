import "./NewPost.css";
import blogFetch from "../axios/config.js";
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

function NewGenre() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [genres, setGenres] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editGenreId, setEditGenreId] = useState(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await blogFetch.get('/genre');
        setGenres(response.data);
      } catch (error) {
        console.error('Error fetching genres', error);
      }
    };

    fetchGenres();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editMode) {
      await saveEditGenre();
    } else {
      await createGenre();
    }
  };

  const createGenre = async () => {
    const newGenre = { name };

    try {
      const response = await blogFetch.post('/genre', newGenre);
      setGenres([...genres, response.data]);
      setName('');
    } catch (error) {
      console.error('Error creating genre', error);
    }
  };

  const deleteGenre = async (id) => {
    const confirmed = window.confirm("Tem certeza de que deseja apagar este gênero?");
    if (!confirmed) {
      return;
    }

    try {
      await blogFetch.delete(`/genre/${id}`);
      setGenres(genres.filter((genre) => genre.id !== id));
    } catch (error) {
      if (error.response && error.response.status === 406) {
        alert('Não é possível deletar este gênero, pois ele está sendo usado por um livro.');
      } else {
        console.error('Error deleting genre', error);
      }
    }
  };

  const startEditGenre = (genre) => {
    setEditMode(true);
    setEditGenreId(genre.id);
    setName(genre.name);
  };

  const saveEditGenre = async () => {
    try {
      await blogFetch.put(`/genre/${editGenreId}`, { name });
      setGenres(
        genres.map((genre) =>
          genre.id === editGenreId ? { ...genre, name } : genre
        )
      );
      setEditMode(false);
      setEditGenreId(null);
      setName('');
    } catch (error) {
      console.error('Error updating genre', error);
    }
  };

  return (
    <div className="new-post">
      <h2>{editMode ? "Editar Gênero" : "Cadastrar Gênero"}</h2>
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
      <h2>Gêneros Cadastrados:</h2>
      <ul>
        {genres.map((genre) => (
          <li key={genre.id}>
            {genre.name}
            <div className="btn-container">
              <button onClick={() => startEditGenre(genre)} className="btn-edit">Editar</button>
              <button onClick={() => deleteGenre(genre.id)} className="btn-delete">Apagar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NewGenre;
