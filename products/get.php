<?php

header("Content-Type: application/json");

require_once "../middleware/auth.php";
require_once "../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    echo json_encode([
        "success" => false,
        "message" => "Only GET request is allowed"
    ]);
    exit;
}

// Get logged-in user's ID
$userId = $_SESSION["user_id"];

$stmt = $conn->prepare(
    "SELECT id, item_name, price, description
     FROM products
     WHERE user_id = ?
     ORDER BY id DESC"
);

$stmt->bind_param("i", $userId);

$stmt->execute();

$result = $stmt->get_result();

$products = [];

while ($row = $result->fetch_assoc()) {
    $products[] = $row;
}

echo json_encode([
    "success" => true,
    "products" => $products
]);

?>