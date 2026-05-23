<?php
$db = getDB();

switch ($method) {
  case 'GET':
    $stmt = $db->query('SELECT * FROM museums ORDER BY id');
    jsonResponse($stmt->fetchAll());
    break;

  default:
    jsonError('Method not allowed', 405);
}
