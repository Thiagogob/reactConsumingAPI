import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import {createBrowserRouter, RouterProvider, Route} from 'react-router-dom'

// paginas
import Home from "./routes/Home";
import NewPost from "./routes/NewPost";
import NewGenre from './routes/NewGenre.jsx';
import NewAuthor from './routes/NewAuthor.jsx';
import BookDetails from './routes/BookDetails.jsx'; // Adicione esta linha

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: `/`,
        element: <Home />,
      },
      {
        path: `/new`,
        element: <NewPost />,
      },
      {
        path: `/newGenre`,
        element: <NewGenre />,
      },
      {
        path: `/newAuthor`,
        element: <NewAuthor />,
      },
      {
        path: `/book/:id`, 
        element: <BookDetails />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
