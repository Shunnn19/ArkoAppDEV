<?php
$db = getDB();

switch ($method) {
  case 'GET':
    $sql = 'SELECT * FROM visit_log_entries WHERE 1=1';
    $params = [];

    if (!empty($_GET['museum_id'])) {
      $sql .= ' AND museum_id = ?';
      $params[] = $_GET['museum_id'];
    }
    if (!empty($_GET['visit_date'])) {
      $sql .= ' AND visit_date = ?';
      $params[] = $_GET['visit_date'];
    }
    if (!empty($_GET['attendance_status'])) {
      $sql .= ' AND attendance_status = ?';
      $params[] = $_GET['attendance_status'];
    }

    $sql .= ' ORDER BY arrival_date DESC, arrival_time DESC';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    jsonResponse($stmt->fetchAll());
    break;

  case 'POST':
    $input = getJsonInput();
    $required = ['museum_id', 'visit_date', 'time_slot', 'visitor_name', 'group_size', 'entry_type', 'arrival_time', 'arrival_date', 'recorded_by'];
    foreach ($required as $field) {
      if (empty($input[$field])) {
        jsonError("Missing required field: $field");
      }
    }

    $id = 'log-' . time() . '-' . rand(1000, 9999);

    $stmt = $db->prepare('
      INSERT INTO visit_log_entries (id, booking_ref, museum_id, visit_date, time_slot,
        visitor_name, group_size, entry_type, arrival_time, arrival_date,
        attendance_status, recorded_by, departure_time, notes, is_complete,
        walk_in_id, last_name, first_name, middle_name, contact_number,
        email_address, number_of_visitors, schedule_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ');
    $stmt->execute([
      $id,
      $input['booking_ref'] ?? null,
      $input['museum_id'],
      $input['visit_date'],
      $input['time_slot'],
      $input['visitor_name'],
      (int)$input['group_size'],
      $input['entry_type'],
      $input['arrival_time'],
      $input['arrival_date'],
      $input['attendance_status'] ?? 'Present',
      $input['recorded_by'],
      $input['departure_time'] ?? null,
      $input['notes'] ?? null,
      (int)($input['is_complete'] ?? 0),
      $input['walk_in_id'] ?? null,
      $input['last_name'] ?? null,
      $input['first_name'] ?? null,
      $input['middle_name'] ?? null,
      $input['contact_number'] ?? null,
      $input['email_address'] ?? null,
      $input['number_of_visitors'] ?? null,
      $input['schedule_id'] ?? null,
    ]);

    jsonResponse(['id' => $id, 'message' => 'Log entry created'], 201);
    break;

  case 'PUT':
    if (!$id) jsonError('Log entry ID required');
    $input = getJsonInput();

    $fields = [];
    $params = [];
    $allowed = ['attendance_status', 'departure_time', 'notes', 'is_complete'];
    foreach ($allowed as $f) {
      if (isset($input[$f])) {
        $fields[] = "$f = ?";
        $params[] = $input[$f];
      }
    }
    if (empty($fields)) jsonError('No fields to update');

    $params[] = $id;
    $sql = 'UPDATE visit_log_entries SET ' . implode(', ', $fields) . ' WHERE id = ?';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    jsonResponse(['message' => 'Log entry updated']);
    break;

  default:
    jsonError('Method not allowed', 405);
}
