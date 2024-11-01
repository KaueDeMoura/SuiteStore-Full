<?php
header('Access-Control-Allow-Origin: *');
include "../../conexao.php";


if (
    $_SERVER['REQUEST_METHOD'] === 'GET' &&
    isset($_GET['id_compra'])
) {

    try {
        $id_compra = $_GET['id_compra'];

        $querySum = $myPDO->prepare("SELECT SUM(taxa) AS taxa, SUM(total) AS total FROM historico WHERE id_compra = :id_compra");
        $querySum->bindParam(':id_compra', $id_compra);
        $querySum->execute();
        $rowTotalTaxa = $querySum->fetch(PDO::FETCH_ASSOC);

    } catch (Exception $e) {
        echo json_encode(['Falha ao buscar produtos']);
        echo '<br>';
        echo "Falha ao adicionar: " . $e->getMessage();
    }
}
?>