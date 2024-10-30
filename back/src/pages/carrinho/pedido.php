<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Allow-Methods: *');

include_once "../../conexao.php";

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "GET") {
    try {
        $consulta = $myPDO->query("SELECT sum(total) as totals, sum(taxa) as taxas,
                                    sum(total)+sum(taxa) as totalfinal
                                    FROM carrinho");
        $produtos = $consulta->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($produtos);
    } catch (Exception $e) {
        echo json_encode([
            "error" => "Falha ao buscar produtos",
            "message" => $e->getMessage(),
        ]);
    }
} 

elseif ($method === "DELETE") {
        try {
            $sqlex = "TRUNCATE TABLE carrinho";
            $stmtex = $myPDO->prepare($sqlex);
            $stmtex->execute();
        echo json_encode(["success" => "Produto deletado"]);


        
        } catch (Exception $e) {
            echo json_encode([
                "error" => "Falha ao excluir produto",
                "message" => $e->getMessage(),
            ]);
        }
    } 



    
    elseif ($method === "POST") {
    try {
        $sql_id = "SELECT MAX(id_compra) AS ultimo_id_compra FROM historico";
        $stmt_id = $myPDO->prepare($sql_id);
        $stmt_id->execute();
        $resultado = $stmt_id->fetch(PDO::FETCH_ASSOC);

 
        $ultimo_id_compra = $resultado['ultimo_id_compra'] ? $resultado['ultimo_id_compra'] : 0;
        $novo_id_compra = $ultimo_id_compra + 1;
 
        $sql = "INSERT INTO historico(produto_nomeprod, precound, quantidade, total, taxa, amount, id_compra, date)
                SELECT produto_nomeprod, precound, quantidade, total, taxa, amount, :id_compra, now()
                FROM carrinho";
        $stmt = $myPDO->prepare($sql);
        $stmt->bindParam(':id_compra', $novo_id_compra, PDO::PARAM_INT);
 
        if ($stmt->execute()) {

            $sql_sum_qtde = "SELECT c.produto_nomeprod, sum(c.quantidade) as qtde, p.quantidade
                            FROM carrinho c
                            inner join produtos p on c.produto_nomeprod = p.nomeprod
                            GROUP BY c.produto_nomeprod, p.quantidade;";
            $stmt_sum_qtde = $myPDO->prepare($sql_sum_qtde);
            $stmt_sum_qtde->execute();
            $result_sum_qtde = $stmt_sum_qtde->fetchALL(PDO::FETCH_ASSOC);

            foreach ($result_sum_qtde as $option) {
                $teste = $option['quantidade'] - $option['qtde'];
                $nomeprodalt = $option['produto_nomeprod'];

                $sql_update = "UPDATE produtos
                                SET quantidade = $teste
                                where nomeprod = '$nomeprodalt'";
                $stmt_update = $myPDO->prepare($sql_update);
                $stmt_update->execute();
            }
            $sqlex = "TRUNCATE TABLE carrinho";
            $stmtex = $myPDO->prepare($sqlex);
            $stmtex->execute();
        } else {
            echo "Falha ao adicionar itens ao histórico";
        }
    } catch (\Exception $e) {
        echo '<br>';
        echo "Falha ao adicionar: " . $e->getMessage();
    }
}
    
 
?>
