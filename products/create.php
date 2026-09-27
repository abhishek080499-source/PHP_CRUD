<?php

header("Content-Type: application/json");

require_once "../middleware/auth.php";
require_once "../config/db.php";

// Check POST request
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode([
        "success" => false,
        "message" => "Only POST request is allowed"
    ]);
    exit;
}

// Logged-in user ID
$userId = $_SESSION["user_id"];

// Get form data
$itemName = trim($_POST["item_name"] ?? "");
$price = trim($_POST["price"] ?? "");
$description = trim($_POST["description"] ?? "");

// Validation
if ($itemName === "" || $price === "" || $description === "") {
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

// Insert product
$stmt = $conn->prepare(
    "INSERT INTO products
    (user_id, item_name, price, description)
    VALUES (?, ?, ?, ?)"
);

$stmt->bind_param(
    "isds",
    $userId,
    $itemName,
    $price,
    $description
);

// Execute query
if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Product added successfully"
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Failed to add product"
    ]);
}

?>
