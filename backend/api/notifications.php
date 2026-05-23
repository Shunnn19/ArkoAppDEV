<?php
$db = getDB();

switch ($method) {
  case 'GET':
    $sql = 'SELECT * FROM NOTIFICATION_RECORD WHERE 1=1';
    $params = [];

    if (!empty($_GET['userId'])) {
      $sql .= ' AND userId = ?';
      $params[] = $_GET['userId'];
    }
    if (!empty($_GET['recipient'])) {
      $sql .= ' AND recipient = ?';
      $params[] = $_GET['recipient'];
    }

    $sql .= ' ORDER BY dateNotified DESC LIMIT 100';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    jsonResponse($stmt->fetchAll());
    break;

  case 'POST':
    $input = getJsonInput();
    $required = ['notificationType', 'notificationChannel', 'recipient', 'dateNotified', 'notificationStatus'];
    foreach ($required as $field) {
      if (empty($input[$field])) {
        jsonError("Missing required field: $field");
      }
    }

    $stmt = $db->query("SELECT COUNT(*) as cnt FROM NOTIFICATION_RECORD WHERE notificationId LIKE 'NTF-%'");
    $count = $stmt->fetch()['cnt'] + 1;
    $notificationId = sprintf('NTF-%05d', $count);

    $stmt = $db->prepare('
      INSERT INTO NOTIFICATION_RECORD (notificationId, notificationType, notificationChannel, recipient, dateNotified, notificationStatus, userId, bookingId, assignmentId, scheduleId, logId)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ');
    $stmt->execute([
      $notificationId,
      $input['notificationType'],
      $input['notificationChannel'],
      $input['recipient'],
      $input['dateNotified'],
      $input['notificationStatus'],
      $input['userId'] ?? null,
      $input['bookingId'] ?? null,
      $input['assignmentId'] ?? null,
      $input['scheduleId'] ?? null,
      $input['logId'] ?? null,
    ]);

    jsonResponse(['notificationId' => $notificationId, 'message' => 'Notification created'], 201);
    break;

  case 'PUT':
    if (!$id) jsonError('Notification ID required');
    $input = getJsonInput();

    $fields = [];
    $params = [];
    $allowed = ['notificationType', 'notificationChannel', 'recipient', 'dateNotified', 'notificationStatus', 'userId', 'bookingId', 'assignmentId', 'scheduleId', 'logId'];
    foreach ($allowed as $f) {
      if (isset($input[$f])) {
        $fields[] = "$f = ?";
        $params[] = $input[$f];
      }
    }
    if (empty($fields)) jsonError('No fields to update');

    $params[] = $id;
    $sql = 'UPDATE NOTIFICATION_RECORD SET ' . implode(', ', $fields) . ' WHERE notificationId = ?';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    jsonResponse(['message' => 'Notification updated']);
    break;

  default:
    jsonError('Method not allowed', 405);
}
