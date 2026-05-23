<?php
$db = getDB();

switch ($method) {
  case 'GET':
    $sql = 'SELECT * FROM visit_bookings WHERE 1=1';
    $params = [];

    if (!empty($_GET['email'])) {
      $sql .= ' AND email = ?';
      $params[] = $_GET['email'];
    }
    if (!empty($_GET['museum_id'])) {
      $sql .= ' AND museum_id = ?';
      $params[] = $_GET['museum_id'];
    }
    if (!empty($_GET['date'])) {
      $sql .= ' AND visit_date = ?';
      $params[] = $_GET['date'];
    }
    if (!empty($_GET['status'])) {
      $sql .= ' AND status = ?';
      $params[] = $_GET['status'];
    }

    $sql .= ' ORDER BY submitted_at DESC';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    jsonResponse($stmt->fetchAll());
    break;

  case 'POST':
    $input = getJsonInput();

    $required = ['museum_id', 'visit_date', 'time_slot', 'group_size', 'first_name', 'last_name', 'contact'];
    foreach ($required as $field) {
      if (empty($input[$field])) {
        jsonError("Missing required field: $field");
      }
    }

    // Generate reference
    $year = date('Y');
    $stmt = $db->query("SELECT COUNT(*) as cnt FROM visit_bookings WHERE ref LIKE 'BK-$year-%'");
    $count = $stmt->fetch()['cnt'] + 1;
    $ref = sprintf('BK-%s-%03d', $year, $count);

    $stmt = $db->prepare('
      INSERT INTO visit_bookings (ref, museum_id, visit_date, time_slot, group_size,
        first_name, middle_name, last_name, email, contact, country_code,
        group_type, visitor_type, booking_type, special_requirements, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ');
    $stmt->execute([
      $ref,
      $input['museum_id'],
      $input['visit_date'],
      $input['time_slot'],
      (int)$input['group_size'],
      $input['first_name'],
      $input['middle_name'] ?? '',
      $input['last_name'],
      $input['email'] ?? '',
      $input['contact'],
      $input['country_code'] ?? '+63',
      $input['group_type'] ?? 'Individual',
      $input['visitor_type'] ?? 'Guest',
      $input['booking_type'] ?? 'Pre-booked',
      $input['special_requirements'] ?? '',
      'pending',
    ]);

    jsonResponse(['ref' => $ref, 'message' => 'Booking created'], 201);
    break;

  case 'PUT':
    if (!$id) jsonError('Booking ref required');
    $input = getJsonInput();

    $fields = [];
    $params = [];
    $allowed = ['status', 'group_size', 'time_slot', 'special_requirements', 'assigned_staff'];
    foreach ($allowed as $f) {
      if (isset($input[$f])) {
        $fields[] = "$f = ?";
        $params[] = $input[$f];
      }
    }
    if (empty($fields)) jsonError('No fields to update');

    $params[] = $id;
    $sql = 'UPDATE visit_bookings SET ' . implode(', ', $fields) . ' WHERE ref = ?';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    jsonResponse(['message' => 'Booking updated']);
    break;

  case 'DELETE':
    if (!$id) jsonError('Booking ref required');
    $stmt = $db->prepare('DELETE FROM visit_bookings WHERE ref = ?');
    $stmt->execute([$id]);
    jsonResponse(['message' => 'Booking deleted']);
    break;

  default:
    jsonError('Method not allowed', 405);
}
