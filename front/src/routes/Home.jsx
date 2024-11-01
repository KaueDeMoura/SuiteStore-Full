import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [produtos, setProdutos] = useState([]);
  const [carrinhos, setCarrinhos] = useState([]);
  const [novoCarrinho, setNovoCarrinho] = useState({
    quantidade: "",
    selectProduto: "",
    taxa: "",
    precound: "",
    categoria: "",
    imglink: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost/pages/produtos.php")
      .then((response) => setProdutos(response.data))
      .catch((error) => console.error("Erro ao buscar produtos:", error));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost/pages/home/home.php")
      .then((response) => setCarrinhos(response.data))
      .catch((error) => console.error("Erro ao buscar carrinhos:", error));
  }, []);

  const handleChange = (e) => {
    setNovoCarrinho({
      ...novoCarrinho,
      [e.target.name]: e.target.value,
    });
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const handleSubmit = (e, produto) => {
    e.preventDefault();
    const carrinhoAtualizado = {
      ...novoCarrinho,
      selectProduto: produto.nomeprod,
      taxa: produto.taxa,
      precound: produto.preco,
      categoria: produto.categoria_nomecat,
    };
    axios
      .post("http://localhost/pages/home/home.php", carrinhoAtualizado)
      .then((response) => {
        if (response.status==200) {
        setCarrinhos([...carrinhos, carrinhoAtualizado]);
        } else {
          console.log(response.data);
        }
      })
      .catch((error) => alert("Erro ao adicionar produto:", error));
  };

  return (
    <div className="mb-4 grid gap-4 p-10 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
      {Object.values(produtos).map((produto) => (
        
        <form onSubmit={(e) => handleSubmit(e, produto)}  key={produto.id}>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800" >
            <div className="h-56 w-full">
                <img
                  className="mx-auto h-full"
                  src={produto.imglink}
                  alt={produto.nomeprod}
                  width={200}
                />
            </div>
            <div className="pt-6">
              <a
                href="#"
                className="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white"
                name="selectProduto"
                value={produto.nomeprod}
              >
                {produto.nomeprod}
              </a>

              <ul className="mt-2 flex items-center gap-4">
                <li className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400"
                  name="categoria"
                  value={produto.categoria_nomecat}>
                    {produto.categoria_nomecat}
                  </p>
                </li>
              </ul>

              <table className="mt-5 ">
                <thead className="">
                  <tr className="text-left">
                  <th scope="col" className="pr-15">Valor</th>
                    <th scope="col" className="pr-7">Taxa</th>
                    <th scope="col" className="">Quantidade</th>
                  </tr>
                </thead>
                <tbody id="listaHomeBody">
                  <tr>
                    <th
                  scope="row"
                  className="pr-6  font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                      <p
                        className="text-2xl font-extrabold leading-tight text-gray-900 dark:text-white"
                        name="precound"
                        value={produto.preco}
                      >
                        {formatCurrency(produto.preco)}
                      </p>
                    </th>
                    <th
                  scope="row"
                  className="pr-6  font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                      <ul className="mt-2 flex items-center gap-4">
                        <li className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {produto.taxa}
                          </p>
                        </li>
                      </ul>
                    </th>
                    <th
                  scope="row"
                  className="pr-6  font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                      
                      <ul className="mt-2 flex items-center gap-4">
                        <li className="flex items-center gap-2">
                          <input
                            type="number"
                            placeholder="1599"
                            name="quantidade"
                            id="quantidade"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block max-w-[47%] p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            onChange={handleChange}
                          />
                        </li>
                      </ul>
                    </th>
                  </tr>
                </tbody>
              </table>

              <button
                type="submit"
                className="mt-[10px] inline-flex items-center rounded-lg bg-indigo-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4  focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                <svg
                  className="-ms-2 me-2 h-5 w-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    
                    d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"
                  />
                </svg>
                Adicionar no Carrinho
              </button>
            </div>
          </div>
        </form>
      ))}
    </div>
  );
};

export default Home;
