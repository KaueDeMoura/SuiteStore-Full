import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2'

const Home = () => {
  const [compras, setCompras] = useState([]);
  const [detalhes, setDetalhes] = useState([]);
  const [historicos, setHistoricos] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost/pages/carrinho/carrinho.php")
      .then((response) => setHistoricos(response.data))
      .catch((error) => console.error("Erro ao buscar historicos:", error));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost/pages/historico/historico.php")
      .then((response) => setCompras(response.data))
      .catch((error) => console.error("Erro ao buscar compras:", error));
  }, []);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleVerDetalhes = (id_compra) => {
    axios
      .get(`http://localhost/pages/historico/getDetalhes.php?id+compra=${id_compra}`)
      .then((response) => {
        if (response.status==200) {
          setDetalhes(response.data.filter((hist) => hist.id_compra !== id_compra));
        } else {
          console.log(response.data);
        }
      })
      .catch((error) => console.error("Erro ao buscar detalhes historico:", error));
  };

  const alertAdd = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Compra Excluida com Sucesso!",
      showConfirmButton: false,
      timer: 1500,
    });
  }

  const handleDelete = (id_compra) => {
    axios
      .delete(`http://localhost/pages/historico/historico.php?id_compra=${id_compra}`)
      .then((response) => {
        if (response.status==200) {
          setHistoricos(historicos.filter((hist) => hist.id_compra !== id_compra));
          alertAdd();
          setTimeout(() => { window.location.reload() }, 1510)

        } else {
          console.log(response.data);
        }
      })
      .catch((error) => console.error("Erro ao deletar categoria:", error));
  };

  const formatCurrency = (value) =>
   new Intl.NumberFormat("pt-BR", {
     style: "currency",
     currency: "BRL",
   }).format(value);


  return (
    <>
      <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
  <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
    <div className="mx-auto max-w-5xl">
      <div className="gap-4 sm:flex sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Minhas Compras</h2>
      </div>

      <div className="mt-6 flow-root sm:mt-8" >
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
    {Object.values(compras).map((compras) => (
                  <form >
          <div className="flex flex-wrap items-center gap-y-4 py-6">
            <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
              <dt className="text-base font-medium text-gray-500 dark:text-gray-400">ID da Compra:</dt>
              <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                <a href="#" className="hover:underline">{compras.id_compra}</a>
              </dd>
            </dl>

            <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
              <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Data:</dt>
              <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">{compras.dates}</dd>
            </dl>

            <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
              <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Preço:</dt>
              <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">{formatCurrency(compras.total)}</dd>
            </dl>

            <div className="w-full grid sm:grid-cols-2 lg:flex lg:w-64 lg:items-center lg:justify-end gap-4">
              <button type="button" onClick={() => handleDelete(compras.id_compra)} className="w-full rounded-lg border border-red-700 px-3 py-2 text-center text-sm font-medium text-red-700 hover:bg-red-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900 lg:w-auto">Excluir Compra</button>
              <button type="button"  onClick={() => {handleVerDetalhes(compras.id_compra); setIsModalOpen(true)}} className="cursor-pointer w-full inline-flex justify-center rounded-lg  border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 lg:w-auto">Ver Detalhes</button>
            </div>
          </div>
        </form>
        ))}
        </div>
      </div>
    </div>
  </div>



  {isModalOpen && (
<div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
    <div className="mx-auto max-w-5xl">
      <div className="gap-4 sm:flex sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Detalhes da Compra</h2>
      </div>

      <div className="mt-6 flow-root sm:mt-8">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
    {Object.values(detalhes).map((detalhes) => (
                  <form>
          <div className="flex flex-wrap items-center gap-y-4 py-6">
            <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
              <dt className="text-base font-medium text-gray-500 dark:text-gray-400">ID da Compra:</dt>
              <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                <a href="#" className="hover:underline">{detalhes.produto_nomeprod}</a>
              </dd>
            </dl>

            <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
              <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Data:</dt>
              <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">{formatCurrency(detalhes.total)}</dd>
            </dl>

            <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
              <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Preço:</dt>
              <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">R{detalhes.preco}</dd>
            </dl>

            <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
              <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Taxa:</dt>
              <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">{detalhes.taxa}</dd>
            </dl>

            <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
              <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Quantidade:</dt>
              <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">{detalhes.quantidade}</dd>
            </dl>

            <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
              <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Total:</dt>
              <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">{detalhes.total}</dd>
            </dl>
          </div>
        </form>
        ))}
        </div>
      </div>
    </div>
  </div>
  )}
</section>
    </>
  );
};

export default Home;
