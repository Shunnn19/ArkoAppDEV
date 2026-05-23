<?php
$db = getDB();

switch ($method) {
  case 'GET':
    $sql = 'SELECT * FROM VISIT_SCHEDULE WHERE 1=1';
    $params = [];

    if (!empty($_GET['museumSelection'])) {
      $sql .= ' AND museumSelection = ?';
      $params[] = $_GET['museumSelection'];
    }
    if (!empty($_GET['visitDate'])) {
      $sql .= ' AND visitDate = ?';
      $params[] = $_GET['visitDate'];
    }

    $sql .= ' ORDER BY visitDate DESC, timeSlot ASC';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    jsonResponse($stmt->fetchAll());
    break;

  case 'POST':
    $input = getJsonInput();

    $required = ['museumSelection', 'visitDate', 'timeSlot', 'maxCapacity', 'scheduleStatus'];
    foreach ($required as $field) {
      if (empty($input[$field])) {
        jsonError("Missing required field: $field");
      }
    }

    $year = date('Y');
    $stmt = $db->query("SELECT COUNT(*) as cnt FROM VISIT_SCHEDULE WHERE scheduleId LIKE 'SCH-$year-%'");
    $count = $stmt->fetch()['cnt'] + 1;
    $scheduleId = sprintf('SCH-%s-%03d', $year, $count);

    $stmt = $db->prepare('
      INSERT INTO VISIT_SCHEDULE (scheduleId, museumSelection, visitDate, timeSlot, maxCapacity, scheduleStatus)
      VALUES (?, ?, ?, ?, ?, ?)
    ');
    $stmt->execute([
      $scheduleId,
      $input['museumSelection'],
      $input['visitDate'],
      $input['timeSlot'],
      (int)$input['maxCapacity'],
      $input['scheduleStatus'],
    ]);

    jsonResponse(['scheduleId' => $scheduleId, 'message' => 'Visit schedule created'], 201);
    break;

  case 'PUT':
    if (!$id) jsonError('Schedule ID required');
    $input = getJsonInput();

    $fields = [];
    $params = [];
    $allowed = ['museumSelection', 'visitDate', 'timeSlot', 'maxCapacity', 'scheduleStatus'];
    foreach ($allowed as $f) {
      if (isset($input[$f])) {
        $fields[] = "$f = ?";
        $params[] = $input[$f];
      }
    }
    if (empty($fields)) jsonError('No fields to update');

    $params[] = $id;
    $sql = 'UPDATE VISIT_SCHEDULE SET ' . implode(', ', $fields) . ' WHERE scheduleId = ?';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    jsonResponse(['message' => 'Visit schedule updated']);
    break;

  default:
    jsonError('Method not allowed', 405);
}
