<?php

header("Content-Type: application/json");

require_once "../middleware/auth.php";
require_once "../config/db.php";

// Only POST allowed
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode([
        "success" => false,
        "message" => "Only POST request is allowed"
    ]);
    exit;
}

// Logged-in user
$userId = $_SESSION["user_id"];

// Get data
$id = intval($_POST["id"] ?? 0);
$itemName = trim($_POST["item_name"] ?? "");
$price = trim($_POST["price"] ?? "");
$description = trim($_POST["description"] ?? "");

// Validation
if ($id <= 0 || $itemName === "" || $price === "" || $description === "") {
    echo json_encode([
        "success" => false,
        "message" => "All fields are required"
    ]);
    exit;
}

if (!is_numeric($price) || $price < 0) {
    echo json_encode([
        "success" => false,
        "message" => "Enter a valid price"
    ]);
    exit;
}

// Update product
$stmt = $conn->prepare(
    "UPDATE products
     SET item_name = ?, price = ?, description = ?
     WHERE id = ? AND user_id = ?"
);

$stmt->bind_param(
    "sdsii",
    $itemName,
    $price,
    $description,
    $id,
    $userId
);

if ($stmt->execute()) {

    if ($stmt->affected_rows > 0) {
        echo json_encode([
            "success" => true,
            "message" => "Product updated successfully"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Product not found or no changes made"
        ]);
    }

} else {

    echo json_encode([
        "success" => false,
        "message" => "Update failed"
    ]);
}

$stmt->close();

?>
