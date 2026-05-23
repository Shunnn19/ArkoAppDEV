<?php
$db = getDB();

switch ($method) {
  case 'GET':
    $sql = 'SELECT * FROM WALK_IN_VISITOR WHERE 1=1';
    $params = [];

    if (!empty($_GET['museumSelection'])) {
      $sql .= ' AND museumSelection = ?';
      $params[] = $_GET['museumSelection'];
    }
    if (!empty($_GET['scheduleId'])) {
      $sql .= ' AND scheduleId = ?';
      $params[] = $_GET['scheduleId'];
    }

    $sql .= ' ORDER BY registrationDate DESC, registrationTime DESC';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    jsonResponse($stmt->fetchAll());
    break;

  case 'POST':
    $input = getJsonInput();
    $required = ['museumSelection', 'lastName', 'firstName', 'contactNumber', 'numberOfVisitors', 'scheduleId', 'recordingStaff'];
    foreach ($required as $field) {
      if (empty($input[$field])) {
        jsonError("Missing required field: $field");
      }
    }

    $stmt = $db->query("SELECT COUNT(*) as cnt FROM WALK_IN_VISITOR WHERE walkInId LIKE 'WLK-%'");
    $count = $stmt->fetch()['cnt'] + 1;
    $walkInId = sprintf('WLK-%05d', $count);

    $stmt = $db->prepare('
      INSERT INTO WALK_IN_VISITOR (walkInId, museumSelection, lastName, firstName, middleName, contactNumber, emailAddress, numberOfVisitors, registrationDate, registrationTime, scheduleId, recordingStaff)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ');
    $stmt->execute([
      $walkInId,
      $input['museumSelection'],
      $input['lastName'],
      $input['firstName'],
      $input['middleName'] ?? null,
      $input['contactNumber'],
      $input['emailAddress'] ?? null,
      (int)$input['numberOfVisitors'],
      $input['registrationDate'] ?? date('Y-m-d'),
      $input['registrationTime'] ?? date('H:i:s'),
      $input['scheduleId'],
      $input['recordingStaff'],
    ]);

    jsonResponse(['walkInId' => $walkInId, 'message' => 'Walk-in visitor recorded'], 201);
    break;

  default:
    jsonError('Method not allowed', 405);
}
