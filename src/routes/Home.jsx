import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import blogFetch from '../axios/config';
import './Home.css';

const Home = () => {
  const [books, setBooks] = useState([]);

  const getBooks = async () => {
    try {
      const response = await blogFetch.get('/book');
      const data = response.data;
      setBooks(data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteBook = async (id) => {
    const confirmed = window.confirm("Tem certeza de que deseja apagar este livro?");
    if (!confirmed) {
      return;
    }

    try {
      await blogFetch.delete(`/book/${id}`);
      setBooks(books.filter(book => book.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBooks();
  }, []);

  return (
    <div className="home">
      <h1>Livros Disponíveis</h1>
      {books.length === 0 ? (
        <p>Carregando</p>
      ) : (
        books.map((book) => (
          <div className="post" key={book.id}>
            <h2>{book.name}</h2>
            <img src={book.image_url} alt="" />
            <Link to={`/book/${book.id}`} className="btn">Saiba mais</Link>
            <button onClick={() => deleteBook(book.id)} className="btn btn-delete">Deletar</button>
          </div>
        ))
      )}
    </div>
  );
};

export default Home;
