<?php
$db = getDB();

switch ($method) {
  case 'GET':
    $sql = '
      SELECT
        al.*,
        vs.timeSlot AS scheduleTimeSlot,
        COALESCE(wv.firstName, v.firstName) AS visitorFirstName,
        COALESCE(wv.lastName, v.lastName)   AS visitorLastName,
        COALESCE(wv.numberOfVisitors, vb.numberOfVisitors) AS visitorCount
      FROM ATTENDANCE_LOG al
      LEFT JOIN VISIT_SCHEDULE vs ON al.scheduleId = vs.scheduleId
      LEFT JOIN WALK_IN_VISITOR wv ON al.walkInId = wv.walkInId
      LEFT JOIN VISITOR_BOOKING vb ON al.bookingId = vb.bookingId
      LEFT JOIN VISITOR v ON vb.visitorId = v.visitorId
      WHERE 1=1';
    $params = [];

    if (!empty($_GET['museumSelection'])) {
      $sql .= ' AND al.museumSelection = ?';
      $params[] = $_GET['museumSelection'];
    }
    if (!empty($_GET['arrivalDate'])) {
      $sql .= ' AND al.arrivalDate = ?';
      $params[] = $_GET['arrivalDate'];
    }
    if (!empty($_GET['entryType'])) {
      $sql .= ' AND al.entryType = ?';
      $params[] = $_GET['entryType'];
    }

    $sql .= ' ORDER BY al.arrivalDate DESC, al.arrivalTime DESC';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    jsonResponse($stmt->fetchAll());
    break;

  case 'POST':
    $input = getJsonInput();
    $required = ['museumSelection', 'arrivalDate', 'arrivalTime', 'entryType', 'attendanceStatus', 'scheduleId', 'userId'];
    foreach ($required as $field) {
      if (empty($input[$field])) {
        jsonError("Missing required field: $field");
      }
    }

    $year = date('Y');
    $stmt = $db->query("SELECT COUNT(*) as cnt FROM ATTENDANCE_LOG WHERE logId LIKE 'LOG-$year-%'");
    $count = $stmt->fetch()['cnt'] + 1;
    $logId = sprintf('LOG-%s-%05d', $year, $count);

    $stmt = $db->prepare('
      INSERT INTO ATTENDANCE_LOG (logId, museumSelection, arrivalDate, arrivalTime, departureTime, entryType, attendanceStatus, scheduleId, bookingId, walkInId, userId)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ');
    $stmt->execute([
      $logId,
      $input['museumSelection'],
      $input['arrivalDate'],
      $input['arrivalTime'],
      $input['departureTime'] ?? null,
      $input['entryType'],
      $input['attendanceStatus'],
      $input['scheduleId'],
      $input['bookingId'] ?? null,
      $input['walkInId'] ?? null,
      $input['userId'],
    ]);

    jsonResponse(['logId' => $logId, 'message' => 'Attendance log created'], 201);
    break;

  case 'PUT':
    if (!$id) jsonError('Log ID required');
    $input = getJsonInput();

    $fields = [];
    $params = [];
    $allowed = ['arrivalDate', 'arrivalTime', 'departureTime', 'entryType', 'attendanceStatus', 'bookingId', 'walkInId', 'userId'];
    foreach ($allowed as $f) {
      if (isset($input[$f])) {
        $fields[] = "$f = ?";
        $params[] = $input[$f];
      }
    }
    if (empty($fields)) jsonError('No fields to update');

    $params[] = $id;
    $sql = 'UPDATE ATTENDANCE_LOG SET ' . implode(', ', $fields) . ' WHERE logId = ?';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    jsonResponse(['message' => 'Attendance log updated']);
    break;

  default:
    jsonError('Method not allowed', 405);
}
