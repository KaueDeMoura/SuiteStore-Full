<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Allow-Methods: *');
include "../../conexao.php";

$method = $_SERVER['REQUEST_METHOD'];

if (
    $method === 'GET' &&
    isset($_GET['id_compra'])
) {
    try {
        $id_compra = $_GET['id_compra'];
        $consulta = $myPDO->prepare("SELECT produto_nomeprod, precound as preco, quantidade, taxa, total
                                 FROM historico
                                 WHERE id_compra = :id_compra");
        $consulta->bindParam(':id_compra', $id_compra);
        $consulta->execute();
        $result = $consulta->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
    } catch (Exception $e) {
        echo json_encode(['Falha ao buscar produtos']);
        echo '<br>';
        echo "Falha ao adicionar: " . $e->getMessage();
    }
}