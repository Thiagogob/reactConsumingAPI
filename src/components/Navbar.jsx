import React from 'react'
import {Link} from "react-router-dom";
import "./Navbar.css";
const Navbar = () => {
  return (
   <nav className='navbar'>
    <h2>
        <Link to={`/`}>Biblioteca</Link>

    </h2>
    <ul>
        <li>
            <Link to={`/`}>Home</Link>
        </li>
        <li>
            <Link to={`/new`} className='new-btn'>Cadastrar Livro</Link>
        </li>
        <li>
            <Link to={`/newGenre`} className='new-btn'>Cadastrar Gênero</Link>
        </li>
        <li>
            <Link to={`/newAuthor`} className='new-btn'>Cadastrar Autor</Link>
        </li>
    </ul>
   </nav>
  )
}

export default Navbar