<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Allow-Methods: *');

include_once "../../conexao.php";

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "GET") {
    try {
        $consulta = $myPDO->query("SELECT * FROM public.carrinho;");
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
            $sql = "INSERT INTO public.carrinho (precound, quantidade, taxa, produto_nomeprod, total, amount) 
                    VALUES (:precound, :quantidade, :taxa, :selectProduto, :total, :amount)";
            $stmt = $myPDO->prepare($sql);

            $data["total"] = $data["precound"]*$data["quantidade"];


// Total : nao é o total final, é (Total * Quantidade)
// amount : é a taxa do produto ex: Total=100 & Taxa=10 entao amount=== 10
// taxa é a taxa da categoria do produto
//                      2                100            2
        $seila = $data["total"]*($data["taxa"]*$data["quantidade"])/100; 

            $data["amount"] = $seila;

            $stmt->execute([
                ":precound" => $data["precound"],
                ":quantidade" => $data["quantidade"],
                ":total" => $data["total"],
                ":taxa" => $data["taxa"],
                ":selectProduto" => $data["selectProduto"],
                ":amount" => $data["amount"]
            ]);
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
