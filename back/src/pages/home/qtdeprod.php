<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Allow-Methods: *');
 
include_once "../../conexao.php";
 
$method = $_SERVER["REQUEST_METHOD"];
 
if ($method === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
 
    if (
        !empty($data["precound"]) &&
        !empty($data["quantidade"]) > 0 &&
        !empty($data["taxa"]) &&
        !empty($data["selectProduto"])
    ) {
        try {
            $sql = "SELECT SUM(quantidade) as quantidade_carrinho from carrinho
                    where produto_nomeprod = :selectProduto
                    GROUP BY produto_nomeprod";
            $stmt = $myPDO->prepare($sql);
            $stmt->execute([":selectProduto" => $data["selectProduto"]]);
            $carrinhoQuantidade = $stmt->fetchColumn();

            $sql2 = "SELECT quantidade from produtos where nomeprod = :selectProduto";
            $stmt2 = $myPDO->prepare($sql2);
            $stmt2->execute([":selectProduto" => $data["selectProduto"]]);
            $estoqueQuantidade = $stmt2->fetchColumn();
 
            $quantidadeLimite = $estoqueQuantidade - $carrinhoQuantidade;

            $quantidadeTotal = $carrinhoQuantidade + $data["quantidade"];
 
            if ($quantidadeTotal > $estoqueQuantidade) {
                http_response_code(401);
                echo json_encode([
                    "Limite de produto excedido. O limite disponível é $quantidadeLimite unidades."// se inserir mais que a quantidade limite retorna este erro
                ]);
            } else {
                $data["total"] = $data["precound"] * $data["quantidade"];
                $data["amount"] = $data["total"] * ($data["taxa"] * $data["quantidade"]) / 100;
 
                $sqlInsertado = "INSERT INTO public.carrinho (precound, quantidade, taxa, produto_nomeprod, total, amount) 
                              VALUES (:precound, :quantidade, :taxa, :selectProduto, :total, :amount)";
                $stmtInsertado = $myPDO->prepare($sqlInsertado);
 
                $stmtInsertado->execute([
                    ":precound" => $data["precound"],
                    ":quantidade" => $data["quantidade"],
                    ":taxa" => $data["taxa"],
                    ":selectProduto" => $data["selectProduto"],
                    ":total" => $data["total"],
                    ":amount" => $data["amount"]
                ]);
                echo json_encode(["Produto adicionado com sucesso"]);
            }
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode([
                "Falha ao adicionar ao carrinho", // falhou em alguma parte da query
                "message" => $e->getMessage(),
            ]);
        }
    } else {
        http_response_code(401);
        echo json_encode(["Dados inválidos"]); //falhou em tentar passar os dados do front para o backend
    }
}
?>
 