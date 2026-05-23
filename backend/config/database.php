<?php
/**
 * Database configuration and connection helper
 */

define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_PORT', getenv('DB_PORT') ?: '3306');
define('DB_NAME', getenv('DB_NAME') ?: 'museum_ops');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');

function getDB(): PDO {
  static $pdo = null;
  if ($pdo === null) {
    $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4', DB_HOST, DB_PORT, DB_NAME);
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
      PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
      PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
    $pdo->exec('SET NAMES utf8mb4');
  }
  return $pdo;
}

function jsonResponse(mixed $data, int $status = 200): void {
  http_response_code($status);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode($data, JSON_UNESCAPED_UNICODE);
  exit;
}

function jsonError(string $message, int $status = 400): void {
  jsonResponse(['error' => $message], $status);
}

function getJsonInput(): array {
  $raw = file_get_contents('php://input');
  $data = json_decode($raw, true);
  return is_array($data) ? $data : [];
}

function getPathSegments(): array {
  $uri = $_SERVER['REQUEST_URI'] ?? '/';
  $uri = parse_url($uri, PHP_URL_PATH);
  $uri = trim($uri, '/');
  return array_values(array_filter(explode('/', $uri)));
}

function getAuthUser(): ?array {
  $headers = getallheaders();
  $authHeader = $headers['Authorization'] ?? '';
  if (!preg_match('/^Bearer\s+(.+)$/', $authHeader, $m)) {
    return null;
  }
  $token = $m[1];
  $db = getDB();
  $stmt = $db->prepare('SELECT id, name, email, role FROM users WHERE auth_token = ? AND auth_token_expires > NOW()');
  $stmt->execute([$token]);
  $user = $stmt->fetch();
  return $user ?: null;
}

function requireAuth(): array {
  $user = getAuthUser();
  if (!$user) {
    jsonError('Authentication required', 401);
  }
  return $user;
}
