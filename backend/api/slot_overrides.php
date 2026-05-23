<?php
$db = getDB();

switch ($method) {
  case 'GET':
    $sql = 'SELECT * FROM visit_slot_overrides WHERE 1=1';
    $params = [];

    if (!empty($_GET['museum_id'])) {
      $sql .= ' AND museum_id = ?';
      $params[] = $_GET['museum_id'];
    }
    if (!empty($_GET['override_date'])) {
      $sql .= ' AND override_date = ?';
      $params[] = $_GET['override_date'];
    }

    $sql .= ' ORDER BY override_date, time_slot';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    jsonResponse($stmt->fetchAll());
    break;

  case 'POST':
    $input = getJsonInput();

    if (empty($input['museum_id']) || empty($input['override_date']) || empty($input['time_slot'])) {
      jsonError('Missing required fields: museum_id, override_date, time_slot');
    }

    // Upsert: insert or update
    $stmt = $db->prepare('
      INSERT INTO visit_slot_overrides (museum_id, override_date, time_slot, status, capacity, reason, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE status = VALUES(status), capacity = VALUES(capacity),
        reason = VALUES(reason), updated_at = CURRENT_TIMESTAMP
    ');
    $stmt->execute([
      $input['museum_id'],
      $input['override_date'],
      $input['time_slot'],
      $input['status'] ?? 'open',
      (int)($input['capacity'] ?? 40),
      $input['reason'] ?? null,
      $input['created_by'] ?? null,
    ]);

    jsonResponse(['message' => 'Slot override saved'], 200);
    break;

  default:
    jsonError('Method not allowed', 405);
}
