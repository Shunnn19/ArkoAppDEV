<?php
$db = getDB();

switch ($method) {
  case 'GET':
    $sql = 'SELECT * FROM members WHERE 1=1';
    $params = [];

    if (!empty($_GET['email'])) {
      $sql .= ' AND email = ?';
      $params[] = $_GET['email'];
    }
    if (!empty($_GET['status'])) {
      $sql .= ' AND status = ?';
      $params[] = $_GET['status'];
    }

    $sql .= ' ORDER BY join_date DESC';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    jsonResponse($stmt->fetchAll());
    break;

  default:
    jsonError('Method not allowed', 405);
}
