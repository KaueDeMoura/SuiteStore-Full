<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Allow-Methods: *');
include "../../conexao.php";

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $consulta = $myPDO->query("SELECT id_compra, to_char(date::timestamp, 'DD/MM/YYYY - HH24:MI') as dates, sum(total) as total
                               FROM historico
                               GROUP BY id_compra, dates
                               ORDER BY id_compra ASC;");
        $result = $consulta->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
    } catch (Exception $e) {
        echo json_encode(['Falha ao buscar produtos']);
        echo '<br>';
        echo "Falha ao adicionar: " . $e->getMessage();
    }


} elseif (
    $method === 'DELETE' &&
    isset($_GET['id_compra'])
) {
    try {
        $id_compra = $_GET['id_compra'];
        $consulta = $myPDO->prepare("DELETE
                                 FROM historico
                                 WHERE id_compra = :id_compra");
        $consulta->bindParam(':id_compra', $id_compra);
        $consulta->execute();
        $result = $consulta->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
    } catch (Exception $e) {
        echo json_encode(['Falha ao excluir compra']);
        echo '<br>';
        echo "Falha ao adicionar: " . $e->getMessage();
    }
}
?>