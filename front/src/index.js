import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import{ createBrowserRouter, RouterProvider} from 'react-router-dom'

import Home from "./routes/Home.jsx"
import Categorias from './routes/Categorias.jsx';
import Produtos from './routes/Produtos.jsx';
import Historico from './routes/Historico.jsx';
import Carrinho from './routes/Carrinho.jsx';

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Home/>
//   },
//   {
//     path: "Categorias",
//     element: <Categorias/>
//   },
//   {
//     path: "Produtos",
//     element: <Produtos/>
//   },
//   {
//     path: "Historico",
//     element: <Historico/>
//   },
// ])

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children:[
      {
        path: "/",
        element: <Home/>
      },
      {
        path: "Categorias",
        element: <Categorias/>
      },
      {
        path: "Produtos",
        element: <Produtos/>
      },
      {
        path: "Historico",
        element: <Historico/>
      },
      {
        path: "Carrinho",
        element: <Carrinho/>
      },
    ]
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
