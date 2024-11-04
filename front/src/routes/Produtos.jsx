import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2'

const Produtos = () => {
  const [categorias, setCategorias] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [novoProduto, setNovoProduto] = useState({
    nomeprod: "",
    preco: "",
    quantidade: "",
    categoria_nomecat: "",
    imglink: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  useEffect(() => {
    axios
      .get("http://localhost/pages/categorias.php")
      .then((response) => setCategorias(response.data))
      .catch((error) => console.error("Erro ao buscar categorias:", error));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost/pages/produtos.php")
      .then((response) => setProdutos(response.data))
      .catch((error) => console.error("Erro ao buscar produtos:", error));
  }, []);

  const handleChange = (e) => {
    setNovoProduto({
      ...novoProduto,
      [e.target.name]: e.target.value,
    });
  };

  const alertAdd = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Categoria Adicionada!",
      showConfirmButton: false,
      timer: 1500
    });
  }

  const alertError = () => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Oops...",
      text: "Preencha corretamente os dados!",
      showCloseButton: true,
      showConfirmButton: false,
      timer: 4000
    });
  }

  const alertExc = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Produto excluid!",
      showConfirmButton: false,
      timer: 1500
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost/pages/produtos.php", novoProduto)
      .then((response) => {
        if (response.status==200) {
        setProdutos([...produtos, novoProduto]);
        alertAdd();
        }
      })
      .catch((error) => console.error("Erro ao adicionar produto:", error));
      setIsModalOpen(false)
      alertError();
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost/pages/produtos.php?id=${id}`)
      .then((response) => {

        if (response.status==200) {
          setProdutos(produtos.filter((prod) => prod.id !== id));
          alertExc();
        }
      })
      .catch((error) => console.error("Erro ao deletar categoria_nomecat:", error));
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
      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
            onClick={() => setIsModalOpen(false)}
          ></div>

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
                    Adicionar Novo Produto
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
                <form className="p-4 md:p-5" onSubmit={handleSubmit}>
                  <div className="grid gap-4 mb-4 grid-cols-2">
                    <div className="col-span-2">
                      <label
                        htmlFor="nomeprod"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Nome
                      </label>
                      <input
                        type="text"
                        name="nomeprod"
                        id="nomeprod"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Escreva o nome do Produto"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label
                        htmlFor="preco"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Preço
                      </label>
                      <input
                        type="number"
                        name="preco"
                        min='1'
                        step="any"
                        id="preco"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="R$2999"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label
                        htmlFor="quantidade"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Quantidade
                      </label>
                      <input
                        type="number"
                        name="quantidade"
                        id="quantidade"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="1599"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className=" mb-3 col-span-2">
                      <label
                        htmlFor="imglink"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Link
                      </label>
                      <input
                        type="url"
                        name="imglink"
                        id="imglink"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Insira o Link da imagem"
                        onChange={handleChange}
                      />
                    </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label
                      htmlFor="category"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Categoria
                    </label>
                    <select
                      name="categoria_nomecat"
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      defaultValue="categoria_nomecat"
                    >
                      
                      <option
                        value="categoria_nomecat"
                        disabled
                    >Selecionar Categoria</option>
                      {Object.values(categorias).map((categorias) => (
                        <option>{categorias.nomecat}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="mt-[5%] text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-[60%] ml-[20%]">
        <table className="p-10 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Nome do Produto
              </th>
              <th scope="col" className="px-6 py-3">
                Preço
              </th>
              <th scope="col" className="px-6 py-3">
                Quantidade
              </th>
              <th scope="col" className="px-6 py-3">
                Categoria
              </th>
              <th scope="col" className="px-6 py-3">
                Ação
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.values(produtos).map((produto) => (
              <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">

                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {produto.nomeprod}
                </th>

                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {formatCurrency(produto.preco)}
                </th>

                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {produto.quantidade}
                </th>

                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {produto.categoria_nomecat}
                </th>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(produto.id)}
                    href="#"
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Produtos;