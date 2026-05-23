<?php
$db = getDB();

switch ($method) {
  case 'GET':
    $sql = 'SELECT * FROM VISITOR WHERE 1=1';
    $params = [];

    if (!empty($_GET['visitorId'])) {
      $sql .= ' AND visitorId = ?';
      $params[] = $_GET['visitorId'];
    }

    $sql .= ' ORDER BY lastName ASC, firstName ASC';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    jsonResponse($stmt->fetchAll());
    break;

  case 'POST':
    $input = getJsonInput();

    $required = ['lastName', 'firstName', 'contactNumber', 'visitorType'];
    foreach ($required as $field) {
      if (empty($input[$field])) {
        jsonError("Missing required field: $field");
      }
    }

    $stmt = $db->query("SELECT COUNT(*) as cnt FROM VISITOR WHERE visitorId LIKE 'VIS-%'");
    $count = $stmt->fetch()['cnt'] + 1;
    $visitorId = sprintf('VIS-%05d', $count);

    $stmt = $db->prepare('
      INSERT INTO VISITOR (visitorId, lastName, firstName, middleName, contactNumber, emailAddress, visitorType)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    ');
    $stmt->execute([
      $visitorId,
      $input['lastName'],
      $input['firstName'],
      $input['middleName'] ?? null,
      $input['contactNumber'],
      $input['emailAddress'] ?? null,
      $input['visitorType'],
    ]);

    jsonResponse(['visitorId' => $visitorId, 'message' => 'Visitor created'], 201);
    break;

  case 'PUT':
    if (!$id) jsonError('Visitor ID required');
    $input = getJsonInput();

    $fields = [];
    $params = [];
    $allowed = ['lastName', 'firstName', 'middleName', 'contactNumber', 'emailAddress', 'visitorType'];
    foreach ($allowed as $f) {
      if (isset($input[$f])) {
        $fields[] = "$f = ?";
        $params[] = $input[$f];
      }
    }
    if (empty($fields)) jsonError('No fields to update');

    $params[] = $id;
    $sql = 'UPDATE VISITOR SET ' . implode(', ', $fields) . ' WHERE visitorId = ?';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    jsonResponse(['message' => 'Visitor updated']);
    break;

  default:
    jsonError('Method not allowed', 405);
}
