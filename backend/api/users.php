<?php
$db = getDB();

switch ($method) {
  case 'GET':
    $sql = 'SELECT id, email, name, role, department, status FROM users WHERE 1=1';
    $params = [];

    if (!empty($_GET['role'])) {
      $sql .= ' AND role = ?';
      $params[] = $_GET['role'];
    }

    $sql .= ' ORDER BY name';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    jsonResponse($stmt->fetchAll());
    break;

  default:
    jsonError('Method not allowed', 405);
}
