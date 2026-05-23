<?php
$db = getDB();

switch ($method) {
  case 'GET':
    $year = $_GET['year'] ?? date('Y');
    $stmt = $db->prepare("SELECT * FROM holidays WHERE YEAR(holiday_date) = ? ORDER BY holiday_date");
    $stmt->execute([(int)$year]);
    jsonResponse($stmt->fetchAll());
    break;

  default:
    jsonError('Method not allowed', 405);
}
