<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Allow-Methods: *');

include_once '../conexao.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $consulta = $myPDO->query("SELECT p.id, p.nomeprod, p.preco, p.quantidade, p.categoria_nomecat, c.taxa, p.imgLink
	FROM produtos p
	inner join categorias c on c.nomecat = p.categoria_nomecat ORDER BY p.nomeprod;");
        $produtos = $consulta->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($produtos);
    } catch (Exception $e) {
        echo json_encode(['Falha ao buscar produtos']);
        echo '<br>';
        echo "Falha ao adicionar: " . $e->getMessage();
    }
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (
        !empty($data['nomeprod']) &&
        !empty($data['preco']) ||
        !empty($data['preco']) > 0 &&
        !empty($data['quantidade']) &&
        !empty($data['categoria_nomecat']) &&
        !empty($data['imglink'])
    ) {
        try {
            $msql = "INSERT INTO public.produtos(
                    nomeprod, preco, quantidade, categoria_nomecat, imgLink)
                    VALUES (:nomeprod, :preco, :quantidade, :categoria_nomecat, :imglink)";
            $stmt = $myPDO->prepare($msql);
            $stmt->execute([
                ':nomeprod' => $data['nomeprod'],
                ':preco' => $data['preco'],
                ':quantidade' => $data['quantidade'],
                ':categoria_nomecat' => $data['categoria_nomecat'],
                ':imglink' => $data['imglink'],
            ]);
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(['Falha ao adicionar produtos']);
            echo '<br>';
            echo "Falha ao adicionar: " . $e->getMessage();
        }
    } else {
        http_response_code(401);
        echo json_encode(['Dados Invaliados']);
    }

} elseif ($method === 'DELETE') //delete produtos
    if (!empty($_GET['id'])) {
        $id = $_GET['id'];
        try {
            $ssqlDelete = "DELETE FROM public.produtos WHERE id=:id";  // INVES DE DELETE FAZER UM UPDATE 
            $stmt = $myPDO->prepare($ssqlDelete);                         // retoranr dos mortos, botao de retornar ao estoque volta deleted 0
            $stmt->execute([':id' => $id]);
            echo json_encode(['Produto deletado']);
        } catch (Exception $e) {
            echo json_encode(['Falha ao excluir produtos']);
            echo '<br>';
            echo "Falha ao excluir: " . $e->getMessage();
        }
    } else {
        echo json_encode(['id nao de prod nao fornecido']);
    }



?>