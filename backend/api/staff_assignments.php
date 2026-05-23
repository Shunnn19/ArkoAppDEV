<?php
$db = getDB();

switch ($method) {
  case 'GET':
    $sql = 'SELECT * FROM STAFF_ASSIGNMENT WHERE 1=1';
    $params = [];

    if (!empty($_GET['museumSelection'])) {
      $sql .= ' AND museumSelection = ?';
      $params[] = $_GET['museumSelection'];
    }
    if (!empty($_GET['userId'])) {
      $sql .= ' AND userId = ?';
      $params[] = $_GET['userId'];
    }

    $sql .= ' ORDER BY assignmentDate DESC';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    jsonResponse($stmt->fetchAll());
    break;

  case 'POST':
    $input = getJsonInput();
    $required = ['museumSelection', 'scheduleId', 'userId'];
    foreach ($required as $field) {
      if (empty($input[$field])) {
        jsonError("Missing required field: $field");
      }
    }

    $stmt = $db->query("SELECT COUNT(*) as cnt FROM STAFF_ASSIGNMENT WHERE assignmentId LIKE 'ASG-%'");
    $count = $stmt->fetch()['cnt'] + 1;
    $assignmentId = sprintf('ASG-%05d', $count);

    $stmt = $db->prepare('
      INSERT INTO STAFF_ASSIGNMENT (assignmentId, museumSelection, assignmentStatus, assignmentDate, scheduleId, userId)
      VALUES (?, ?, ?, ?, ?, ?)
    ');
    $stmt->execute([
      $assignmentId,
      $input['museumSelection'],
      $input['assignmentStatus'] ?? 'Assigned',
      $input['assignmentDate'] ?? date('Y-m-d'),
      $input['scheduleId'],
      $input['userId'],
    ]);

    jsonResponse(['assignmentId' => $assignmentId, 'message' => 'Staff assignment created'], 201);
    break;

  case 'PUT':
    if (!$id) jsonError('Assignment ID required');
    $input = getJsonInput();

    $stmt = $db->prepare('UPDATE STAFF_ASSIGNMENT SET assignmentStatus = ? WHERE assignmentId = ?');
    $stmt->execute([$input['assignmentStatus'] ?? 'Cancelled', $id]);
    jsonResponse(['message' => 'Staff assignment updated']);
    break;

  default:
    jsonError('Method not allowed', 405);
}
