<?php

session_start();
header("Content-Type: application/json");
require_once "../config/db.php";


if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    echo json_encode([
        "success" => false,
        "message" => "Only POST method is allowed"
    ]);
    exit;
}


$email = trim($_POST["email"] ?? "");
$password = $_POST["password"] ?? "";


// Validation

if ($password === "" || $email === "") {

    echo json_encode([
        "success" => false,
        "message" => " Email and Password is required"
    ]);
    exit;
}


// Find user

$stmt = $conn->prepare(
    "SELECT id, name, email, password
     FROM users
     WHERE email = ?"
);

$stmt->bind_param("s", $email);

$stmt->execute();

$result = $stmt->get_result();


if ($result->num_rows === 0) {

    echo json_encode([
        "success" => false,
        "message" => "Invalid email or password"
    ]);

    exit;
}

// associative array

$user = $result->fetch_assoc();


// Verify password

if (!password_verify($password, $user["password"])) {

    echo json_encode([
        "success" => false,
        "message" => "Invalid email or password"
    ]);

    exit;
}

// Create session

$_SESSION["user_id"] = $user["id"];
$_SESSION["user_name"] = $user["name"];
$_SESSION["user_email"] = $user["email"];

echo json_encode([
    "success" => true,
    "message" => "Login successful"
]);

?>