<?php

header("Content-Type: application/json");

require_once "../middleware/auth.php";
require_once "../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode([
        "success" => false,
        "message" => "Only POST request is allowed"
    ]);
    exit;
}

$userId = $_SESSION["user_id"];

$id = intval($_POST["id"] ?? 0);

if ($id <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid product ID"
    ]);
    exit;
}

$stmt = $conn->prepare(
    "DELETE FROM products
     WHERE id = ?
     AND user_id = ?"
);

$stmt->bind_param(
    "ii",
    $id,
    $userId
);

if ($stmt->execute()) {

    if ($stmt->affected_rows > 0) {

        echo json_encode([
            "success" => true,
            "message" => "Product deleted successfully"
        ]);

    } else {

        echo json_encode([
            "success" => false,
            "message" => "Product not found or does not belong to you"
        ]);
    }

} else {

    echo json_encode([
        "success" => false,
        "message" => "Delete failed"
    ]);
}

?>