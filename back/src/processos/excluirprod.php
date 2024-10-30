<?php
header('Access-Control-Allow-Origin: *');
include_once '../conexao.php';
if (!empty($_GET['id'])) {
    try {
        $id = $_GET['id'];
        $sqlDelete = "DELETE FROM public.produtos WHERE id=:id";
        $stmt = $myPDO -> prepare($sqlDelete);
        $stmt -> execute(['id'=> $id]);
        echo json_encode([ 'Produto excluido']);
    } catch (Exception $e) {
        echo json_encode([ 'Não foi Possivel excluir este produto']);
    }
} else {
    echo json_encode([ 'Não foi fornecido um ID de produto'])
}

?>