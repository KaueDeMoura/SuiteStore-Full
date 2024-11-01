import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2'

const Home = () => {

  const [carrinho, setCarrinho] = useState([]);
  const [historicos, setHistoricos] = useState([]);
  const [novoHistorico, setNovoHistorico] = useState({
    quantidade: "",
    selectProduto: "",
    taxa: "",
    precound: "",
    categoria: "",
    imglink: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost/pages/carrinho/pedido.php")
      .then((response) => setCarrinho(response.data))
      .catch((error) => console.error("Erro ao buscar carrinho:", error));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost/pages/carrinho/carrinho.php")
      .then((response) => setHistoricos(response.data))
      .catch((error) => console.error("Erro ao buscar historicos:", error));
  }, []);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

    const alertAdd = () => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Ação Realizada com Sucesso!",
        showConfirmButton: false,
        timer: 1500
      });
    }

  const handleSubmit = () => {
    axios
      .post(`http://localhost/pages/carrinho/pedido.php`)
      .then((response) => {
        console.log('Responde Status: - '+response.status)
        if (response.status==200) {
          alertAdd();
          setTimeout(() => { window.location.reload() }, 1510)
        }
      })
      .catch((error) => console.error("Erro ao enviar ao historico:", error));
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost/pages/home/home.php?id=${id}`)
      .then((response) => {
        if (response.status==200) {
          setHistoricos(historicos.filter((cat) => cat.id !== id));
          
        } else {
          console.log(response.data.error);
        }
      })
      .catch((error) => console.error("Erro ao deletar categoria:", error));
  };

  const handleDeleteTudo = () => {
    axios
      .delete(`http://localhost/pages/carrinho/pedido.php`)
      .then((response) => {

        if (response.status==200) {
          alertAdd();
          setTimeout(() => { window.location.reload() }, 1510)
        } else {
          console.log(response.data);
        }
      })
      
      .catch((error) => console.error("Erro ao deletar categoria:", error));

  };

  return (
    <>
      <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
            Carrinho de Compras
          </h2>

          <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
            <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
              <div className="space-y-6">
                {historicos.length === 0 ? "O seu carrinho esta vazio" : Object.values(historicos).map((historicos) => (
                  <form>
                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
                      <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                        <a href="#" className="shrink-0 md:order-1">
                          <img
                            className="h-20 w-20 dark:hidden"
                            src={historicos.imglink}
                            alt="imac image"
                          />
                          <img
                            className="hidden h-20 w-20 dark:block"
                            src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg"
                            alt="imac image"
                          />
                        </a>

                        <div className="flex items-center justify-between md:order-3 md:justify-end">
                          <div className="text-end md:order-4 md:w-45">
                            <p className="text-base font-bold text-gray-900 dark:text-white">
                              Unidade: {formatCurrency(historicos.precound)}
                            </p>
                            <p className="text-base font-bold text-gray-900 dark:text-white">
                              Total: {formatCurrency(historicos.total)}
                            </p>
                          </div>
                        </div>

                        <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                          <a
                            href="#"
                            className="text-base font-medium text-gray-900 hover:underline dark:text-white"
                          >
                            {historicos.produto_nomeprod}
                          </a>

                          <div className="flex items-center gap-4">
                            <p
                              type="button"
                              className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
                            >
                              Quantidade: {historicos.quantidade}
                            </p>

                            <button
                              type="button"
                              className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
                              onClick={() => handleDelete(historicos.id)}
                            >
                              <svg
                                className="me-1.5 h-5 w-5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke="currentColor"
                              
                                  
                                  d="M6 18 17.94 6M18 18 6.06 6"
                                />
                              </svg>
                              Remover
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                ))}
              </div>
            </div>
            {historicos.length === 0 ? "" : 
            <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
              <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  Resumo do Pedido
                </p>

                <div className="space-y-4">
                  {Object.values(carrinho).map((carrinho) => (
                    <form onSubmit={(e) => handleSubmit(e, carrinho)}>
                      <div className="space-y-2 mb-[10px]">
                        <dl className="flex items-center justify-between gap-4">
                          <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                            Preço Original
                          </dt>
                          <dd className="text-base font-medium text-gray-900 dark:text-white">
                            {formatCurrency(carrinho.totals)}
                          </dd>
                        </dl>

                        <dl className="flex items-center justify-between gap-4 ">
                          <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                            Imposto
                          </dt>
                          <dd className="text-base font-medium text-gray-900 dark:text-white">
                            {formatCurrency(carrinho.amount)}
                          </dd>
                        </dl>
                      </div>

                      <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                        <dt className="text-base font-bold text-gray-900 dark:text-white">
                          Total
                        </dt>
                        <dd className="text-base font-bold text-gray-900 dark:text-white">
                          {formatCurrency(carrinho.totalfinal)}
                        </dd>
                      </dl>
                      
                      <dl className="flex items-center justify-between gap-4 pt-2 dark:border-gray-700">
                        <button
                          type="button"
                          className="inline-flex items-center text-sm font-medium text-green-600 hover:underline dark:text-green-500"
                          onClick={() => handleSubmit(carrinho)}
                        >
                          <svg
                            className="me-1.5 h-5 w-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                            >
                            <path
                              stroke="currentColor"
                              
                              
                              d="M7 18 20.94 6M6 18 1 11"
                              />
                          </svg>
                          Confirmar
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
                          onClick={() => handleDeleteTudo()}
                          >
                          <svg
                            className="me-1.5 h-5 w-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                            >
                            <path
                              stroke="currentColor"
                              
                              
                              d="M6 18 17.94 6M18 18 6.06 6"
                              />
                          </svg>
                          Remover
                        </button>
                      </dl>
                    </form>
                  ))}
                </div>


                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {" "}
                    ou{" "}
                  </span>
                  <a
                    href="/"
                    title=""
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
                    >
                    Continue Compando
                    <svg
                      className="h-5 w-5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      >
                      <path
                        stroke="currentColor"
                        
                        
                        d="M19 12H5m14 0-4 4m4-4-4-4"
                        />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
        }
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
