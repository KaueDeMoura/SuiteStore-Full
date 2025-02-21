<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Allow-Methods: *');

include_once "../../conexao.php";

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "GET") {
    try {
        $consulta = $myPDO->query("SELECT c.id, c.precound, c.quantidade, c.amount, c.total, c.taxa, c.produto_nomeprod, p.imgLink
	FROM carrinho c
	inner join produtos p on p.nomeprod = c.produto_nomeprod;");
        $produtos = $consulta->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($produtos);
    } catch (Exception $e) {
        echo json_encode([
            "error" => "Falha ao buscar produtos",
            "message" => $e->getMessage(),
        ]);
    }
} elseif ($method === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    if (
        !empty($data["precound"]) &&
        !empty($data["quantidade"]) &&
        // !empty($data["total"]) &&
        !empty($data["taxa"]) &&
        !empty($data["selectProduto"])
    ) {
        try {
            $sql = "INSERT INTO public.carrinho (precound, quantidade, taxa, produto_nomeprod, total/*, amount*/) 
                    VALUES (:precound, :quantidade, :taxa, :selectProduto, :total/*, :amount*/)";
            $stmt = $myPDO->prepare($sql);

            $data["total"] = $data["precound"] * $data["quantidade"];

            /*$valorTaxa = $data["precound"] * $data["quantidade"];
            $valorTaxaDivisao = $valorTaxa / 100;
            $calctotal = $data["precound"] + $valorTaxaDivisao;
            $data["amount"] = $calctotal;*/

            $stmt->execute([
                ":precound" => $data["precound"],
                ":quantidade" => $data["quantidade"],
                ":total" => $data["total"],
                ":taxa" => $data["taxa"],
                ":selectProduto" => $data["selectProduto"]//,
                //":amount" => $data["amount"],
            ]);
            $last_id = $myPDO->lastInsertId();
            echo json_encode(["success" => "Produto adicionado com sucesso"]);
        } catch (Exception $e) {
            echo json_encode([
                "error" => "Falha ao adicionar ao carrinho",
                "message" => $e->getMessage(),
            ]);
        }
    } else {
        echo json_encode(["error" => "Dados inválidos"]);
    }
} elseif ($method === "DELETE") {
    if (!empty($_GET["id"])) {
        $id = $_GET["id"];
        try {
            $sqlDelete = "DELETE FROM public.carrinho WHERE id = :id";
            $stmt = $myPDO->prepare($sqlDelete);
            $stmt->execute([":id" => $id]);
            echo json_encode(["success" => "Produto deletado"]);
        } catch (Exception $e) {
            echo json_encode([
                "error" => "Falha ao excluir produto",
                "message" => $e->getMessage(),
            ]);
        }
    } else {
        echo json_encode(["error" => "ID do produto não fornecido"]);
    }
}
?>