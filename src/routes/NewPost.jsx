import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import blogFetch from '../axios/config';
import './NewPost.css';

const NewPost = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [genreId, setGenreId] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGenresAndAuthors = async () => {
      try {
        const genreResponse = await blogFetch.get('/genre');
        const authorResponse = await blogFetch.get('/authors');
        
        // Verifique se os dados estão no formato esperado
        if (genreResponse.data && authorResponse.data) {
          setGenres(genreResponse.data);
          setAuthors(authorResponse.data);
        } else {
          setError('Erro ao carregar gêneros e autores.');
          console.error('Formato de resposta inesperado:', genreResponse, authorResponse);
        }
      } catch (error) {
        console.error('Error fetching genres or authors', error);
        setError('Erro ao carregar gêneros e autores.');
      }
    };

    fetchGenresAndAuthors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Limpar mensagem de erro antes de cada tentativa
    setError('');

    // Validar se todos os campos estão preenchidos
    if (!name || !imageUrl || !genreId || !authorId) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    const post = {
      name,
      image_url: imageUrl,
      genreId: parseInt(genreId, 10),
      authorsId: [parseInt(authorId, 10)],
    };

    console.log('Post Payload:', post);

    try {
      await blogFetch.post('/book', post);
      navigate('/');
    } catch (error) {
      console.error('Error creating post', error);
      setError('Erro ao cadastrar livro. Por favor, tente novamente.');
    }
  };

  return (
    <div className="new-post">
      <h2>Cadastrar livro: </h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-control">
          <label htmlFor="name" style={{ color: 'white' }}>Nome: </label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Digite o nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-control">
          <label htmlFor="imageUrl" style={{ color: 'white' }}>URL da Imagem: </label>
          <input
            type="text"
            name="imageUrl"
            id="imageUrl"
            placeholder="Digite a URL da imagem"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        <div className="form-control">
          <label htmlFor="genreId" style={{ color: 'white' }}>Gênero: </label>
          <select
            name="genreId"
            id="genreId"
            value={genreId}
            onChange={(e) => setGenreId(e.target.value)}
          >
            <option value="">Selecione um gênero</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control">
          <label htmlFor="authorId" style={{ color: 'white' }}>Autor: </label>
          <select
            name="authorId"
            id="authorId"
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
          >
            <option value="">Selecione um autor</option>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
        </div>

        <input type="submit" value="Cadastrar" className="btn" />
      </form>
    </div>
  );
};

export default NewPost;
