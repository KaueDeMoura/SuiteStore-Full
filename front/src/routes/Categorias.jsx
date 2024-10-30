import React, { useState, useEffect } from "react";
import axios from "axios";
import Produtos from "./Produtos";

const Categorias = () => {
  
  const [categorias, setCategorias] = useState([]);
  const [novaCategoria, setNovaCategoria] = useState({
    nomecat: "",
    taxa: "",
  });
  console.log(novaCategoria)
  const [erro, setErro] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost/pages/categorias.php")
      .then((response) => setCategorias(response.data))
      .catch((error) => console.error("Erro ao buscar categorias:", error));
  }, []);

  const handleChange = (e) => {
    setNovaCategoria({
      ...novaCategoria,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost/pages/categorias.php", novaCategoria)
      .then((response) => {
        if (response.data.success) {

          setCategorias([...categorias, novaCategoria]);
          setNovaCategoria({ categoria: "", Taxa: "" });

          setErro("");
          
        } else {
          setErro(response.data.error);
          console.log(response.data);
        }
      })
      .catch((error) => console.error("Erro ao adicionar categoria:", error));
      setIsModalOpen(false)
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost/pages/categorias.php?id=${id}`)
      .then((response) => {
        console.log(response.data);
        if (response.data.success) {
          setCategorias(categorias.filter((cat) => cat.id !== id));
        } else {
          setErro(response.data.error);
        }
      })
      .catch((error) => console.error("Erro ao deletar categoria:", error));
  };

  return (
    <>

      

<div className=" ml-[20%]">
<button
        onClick={() => setIsModalOpen(true)}
        data-modal-target="crud-modal"
        data-modal-toggle="crud-modal"
        className=" mt-5 mb-5 block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        Adicionar Produto
      </button>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-[60%] ml-[20%]">
        
        <table className="p-10 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Nome da categoria
              </th>
              <th scope="col" className="px-6 py-3">
                Taxa
              </th>
              <th scope="col" className="px-6 py-3">
                Ação
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.values(categorias).map((categoria) => (
              <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {categoria.nomecat}
                </th>
                <td className="px-6 py-4">{categoria.taxa}</td>

                <td className="px-6 py-4">
                  <a
                    onClick={() => handleDelete(categoria.id)}
                    href="#"
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Deletar
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
            onClick={() => setIsModalOpen(false)}
          >
          </div>

          <div
            id="crud-modal"
            tabIndex="-1"
            aria-hidden="true"
            className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
          >
            <div className="relative p-4 w-full max-w-md max-h-full">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Adicionar Nova Categoria
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    data-modal-toggle="crud-modal"
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        
                        
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                <form className="p-4 md:p-5">
                  <div className="grid gap-4 mb-4 grid-cols-2">
                    <div className="col-span-2">
                      <label
                        htmlFor="nomecat"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Nome
                      </label>
                      <input
                        type="text"
                        name="nomecat"
                        id="nomecat"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Escreva o nome do Produto"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label
                        htmlFor="taxa"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Taxa
                      </label>
                      <input
                        type="number"
                        name="taxa"
                        id="taxa"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-[209%] p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="100%"
                        onChange={handleChange}
                      />
                    </div>

                  </div>
                  <button
                    type="submit"
                    className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={handleSubmit}
                  >
                    <svg
                      className="me-1 -ms-1 w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Adicionar novo produto
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

    </>
  );
};

export default Categorias;
