<?php
$db = getDB();

// POST (create booking) is public; GET/PUT/DELETE require authentication
if ($method !== 'POST' && !$authUser) {
  jsonError('Authentication required', 401);
}

switch ($method) {
  case 'GET':
    $sql = 'SELECT vb.*, v.firstName, v.lastName, v.emailAddress, v.contactNumber,
                   s.visitDate, s.timeSlot
            FROM VISITOR_BOOKING vb
            JOIN VISITOR v ON vb.visitorId = v.visitorId
            JOIN VISIT_SCHEDULE s ON vb.scheduleId = s.scheduleId
            WHERE 1=1';
    $params = [];

    if (!empty($_GET['visitorId'])) {
      $sql .= ' AND visitorId = ?';
      $params[] = $_GET['visitorId'];
    }
    if (!empty($_GET['museumSelection'])) {
      $sql .= ' AND museumSelection = ?';
      $params[] = $_GET['museumSelection'];
    }
    if (!empty($_GET['bookingStatus'])) {
      $sql .= ' AND bookingStatus = ?';
      $params[] = $_GET['bookingStatus'];
    }

    $sql .= ' ORDER BY bookingDate DESC';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    jsonResponse($stmt->fetchAll());
    break;

  case 'POST':
    $input = getJsonInput();

    $required = ['museumSelection', 'bookingDate', 'bookingType', 'bookingStatus', 'numberOfVisitors', 'visitorId', 'scheduleId'];
    foreach ($required as $field) {
      if (empty($input[$field])) {
        jsonError("Missing required field: $field");
      }
    }

    $year = date('Y');
    $stmt = $db->query("SELECT COUNT(*) as cnt FROM VISITOR_BOOKING WHERE bookingId LIKE 'BK-$year-%'");
    $count = $stmt->fetch()['cnt'] + 1;
    $bookingId = sprintf('BK-%s-%03d', $year, $count);

    $stmt = $db->prepare('
      INSERT INTO VISITOR_BOOKING (bookingId, museumSelection, bookingDate, bookingType, bookingStatus, numberOfVisitors, specialRequest, visitorId, scheduleId)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ');
    $stmt->execute([
      $bookingId,
      $input['museumSelection'],
      $input['bookingDate'],
      $input['bookingType'],
      $input['bookingStatus'],
      (int)$input['numberOfVisitors'],
      $input['specialRequest'] ?? null,
      $input['visitorId'],
      $input['scheduleId'],
    ]);

    jsonResponse(['bookingId' => $bookingId, 'message' => 'Booking created'], 201);
    break;

  case 'PUT':
    if (!$id) jsonError('Booking ID required');
    $input = getJsonInput();

    $fields = [];
    $params = [];
    $allowed = ['museumSelection', 'bookingDate', 'bookingType', 'bookingStatus', 'numberOfVisitors', 'specialRequest', 'visitorId', 'scheduleId'];
    foreach ($allowed as $f) {
      if (isset($input[$f])) {
        $fields[] = "$f = ?";
        $params[] = $input[$f];
      }
    }
    if (empty($fields)) jsonError('No fields to update');

    $params[] = $id;
    $sql = 'UPDATE VISITOR_BOOKING SET ' . implode(', ', $fields) . ' WHERE bookingId = ?';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    jsonResponse(['message' => 'Booking updated']);
    break;

  case 'DELETE':
    if (!$id) jsonError('Booking ID required');
    $stmt = $db->prepare('DELETE FROM VISITOR_BOOKING WHERE bookingId = ?');
    $stmt->execute([$id]);
    jsonResponse(['message' => 'Booking deleted']);
    break;

  default:
    jsonError('Method not allowed', 405);
}
