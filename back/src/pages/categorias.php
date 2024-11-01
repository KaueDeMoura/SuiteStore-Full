<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Allow-Methods: *');

include_once '../conexao.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $consulta = $myPDO->query("SELECT * 
                                    FROM public.categorias ORDER BY nomecat;");
        $categorias = $consulta->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($categorias);
    } catch (Exception $e) {
        echo json_encode(['Falha ao buscar categorias']);
        echo '<br>';
        echo "Falha ao adicionar: " . $e->getMessage();
    }
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (
        !empty($data['nomecat']) &&
        preg_match("/^[a-zA-ZÀ-ÿ\s]+$/", $data['nomecat']) &&
        !empty($data['taxa']) && $data['taxa'] >= 0 && $data['taxa'] <= 100
    ) {
        try {
            $sql = "INSERT INTO public.categorias (nomecat, taxa) 
            VALUES (:nomecat, :taxa)";
            $stmt = $myPDO->prepare($sql);
            $stmt->execute([
                ':nomecat' => $data['nomecat'],
                ':taxa' => $data['taxa']
            ]);
            $last_id = $myPDO->lastInsertId();

            echo json_encode([
                "id" => $last_id,
                "nomecat" => $data['nomecat'],
                "taxa" => $data['taxa']
            ]);
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(['Falha ao adicionar categoria']);
            echo '<br>';
            echo "Falha ao adicionar: " . $e->getMessage();
        }
    } else {
        http_response_code(401);
        echo json_encode(['Dados invalidos']);
    }
} elseif ($method === 'DELETE') {
    if (!empty($_GET['id'])) {
        $id = $_GET['id'];
        try {
            $sqlDelete = "DELETE FROM public.categorias WHERE id = :id";
            $stmt = $myPDO->prepare($sqlDelete);
            $stmt->execute([':id' => $id]);
            echo json_encode(['success' => 'Categoria deletada']);
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(['Falha ao excluir categoria. Certifique-se de que não existam produtos dependentes.']);
            echo '<br>';
            echo "Falha ao excluir: " . $e->getMessage();
        }
    } else {
        http_response_code(401);
        echo json_encode(['ID da categoria não fornecido']);
    }
}
?>