import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import blogFetch from '../axios/config';

import './BookDetails.css';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [genre, setGenre] = useState('');
  const [authors, setAuthors] = useState([]);
  const [allAuthors, setAllAuthors] = useState([]);
  const [allGenres, setAllGenres] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    image_url: '',
    genreId: '',
    authorsId: []
  });

  useEffect(() => {
    const getBookDetails = async () => {
      try {
        const response = await blogFetch.get(`/book/${id}`);
        const bookData = response.data;
        setBook(bookData);

        const genreResponse = await blogFetch.get(`/genre/${bookData.genreId}`);
        setGenre(genreResponse.data.name);

        setAuthors(bookData.authors);
        setFormData({
          name: bookData.name,
          image_url: bookData.image_url,
          genreId: bookData.genreId,
          authorsId: bookData.authors.map(author => author.id)
        });
      } catch (error) {
        console.log(error);
      }
    };

    const getAllAuthors = async () => {
      try {
        const response = await blogFetch.get('/authors');
        setAllAuthors(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const getAllGenres = async () => {
      try {
        const response = await blogFetch.get('/genre');
        console.log('Genres:', response.data);
        setAllGenres(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getBookDetails();
    getAllAuthors();
    getAllGenres();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAuthorsChange = (e) => {
    const { options } = e.target;
    const selectedAuthors = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        selectedAuthors.push(options[i].value);
      }
    }
    setFormData({ ...formData, authorsId: selectedAuthors });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      genreId: Number(formData.genreId)
    };
    console.log('Form Data:', updatedFormData);
    try {
      await blogFetch.put(`/book/${id}`, updatedFormData);
      setEditMode(false);
      navigate(0); // Reload the page to see the updates
    } catch (error) {
      console.log(error);
    }
  };

  if (!book) return <p>Carregando...</p>;

  return (
    <div className="book-details">
      <h1>{book.name}</h1>
      <img src={book.image_url} alt={book.name} />
      <p><strong>Gênero:</strong> {genre}</p>
      <p><strong>Autores:</strong> {authors.map(author => author.name).join(', ')}</p>
      
      {editMode ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nome do Livro</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>URL da Imagem</label>
            <input
              type="text"
              name="image_url"
              value={formData.image_url}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Gênero</label>
            <select
              name="genreId"
              value={formData.genreId}
              onChange={handleInputChange}
            >
              <option value="" disabled>Selecione um gênero</option>
              {allGenres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Autores</label>
            <select
              multiple
              value={formData.authorsId}
              onChange={handleAuthorsChange}
            >
              {allAuthors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit">Salvar</button>
        </form>
      ) : (
        <button className='btn-edit' onClick={() => setEditMode(true)}>Editar</button>
      )}
    </div>
  );
};

export default BookDetails;
