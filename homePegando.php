import styles from '../css/Historico.module.css';
import React, { useEffect, useState} from 'react';
import axios from 'axios';

const Home = () => {
  const [produtos, setProdutos] = useState([]);
  const [carrinhos, setCarrinhos] = useState([]);
  const [novoCarrinho, setNovoCarrinho] = useState({
    produto: '',
    preco: '',
    quantidade: '',
    selectCategoria: ''
  });
 
  useEffect(() => {
    axios.get('http://localhost/pages/categorias.php')
            .then(response => setProdutos(response.data))
            .catch(error => console.error('Erro ao buscar categorias:', error))
      }, []);

  useEffect(() => {
axios.get('http://localhost/pages/home/home.php')
      .then(response => setCarrinhos(response.data))
      .catch(error => console.error('Erro ao buscar produtos:', error))
  }, []);
 
  const handleChange = (e) => {
    setNovoCarrinho({
      ...novoCarrinho, [e.target.name]: e.target.value
    });
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
axios.post('http://localhost/pages/home/home.php', novoCarrinho)
      .then(response => {
        console.log(response.data.success || response.data.error);
        setCarrinhos([...carrinhos, novoCarrinho]);
        window.location.reload();
      })
      .catch(error => alert('Erro ao adicionar produto:', error));
  };

return (

<div>
<div className={styles.pagina}>
    <div className={styles.separar}>
      <div className={styles.carrt}>
      <h1>Selecionar Produtos</h1>
      </div>
      <form id="formHome" className={styles.input}>
      <select name="selectProduto" id="selectProduto" className={styles.selectProduto} required>
          <option>Produto</option>
          {Object.values(produtos).map(produtos => (
                <option>{produtos.nomeprod}</option>
            ))}
        </select>
        <br />
        <input type="number" name="Quantidade" placeholder="Quantidade" id="inputQuantidade" className={styles.qtde} required />

          <input type="number" name="Taxa" placeholder="Taxa" id="Taxa" readOnly />
          <input type="text" name="Precound" placeholder="Preco" id="Preco" readOnly/>
        <br />
        <p className={styles.errorMsg}>Por favor insira uma Quantidade Valida</p>
        <button className={styles.addProduto} id="addProduto" name="addProduto">Adcicionar produto</button>
        <p></p>
      </form>
    </div>

    <div className={styles.divisao}></div>

    <div className={styles.separar}>
      <div className={styles.carrt}>
      <h1>Carrinho</h1>
      </div>
      <div className={styles.tabela}>
        <table>
            <tbody>
          <tr>
            <th>Produto</th>
            <th>Preço unidade</th>
              <th>Quantidade</th>
              <th>Total</th>
              <th>Ação</th>
            </tr>
            </tbody>
            <tbody id="listaHomeBody">
            {Object.values(carrinhos).map(carrinhos => (
              <tr>
                <td>{carrinhos.produto_nomeprod}</td>
                <td>{carrinhos.precound}</td>
                <td>{carrinhos.quantidade}</td>
                <td>{carrinhos.total}</td>
                <td><button>Deletar</button></td>
              </tr>
            ))}
            </tbody>
          </table>
          <div className={styles.infos}>
            <label>Taxa:</label>
            <input type="text" name="taxa" className={styles.inputTaxaTotal} readOnly />
            <br />
            <label>Total:</label>
            <input type="text" name="total" className={styles.inputValorTotal} readOnly />
            <br />

            <a className={styles.cancelar}>Cancelar</a>
            <a className={styles.concluir}>Concluir</a>
            
          </div>
        </div>
    </div>
  </div>
  <hr />
</div>

)

}

export default Home;