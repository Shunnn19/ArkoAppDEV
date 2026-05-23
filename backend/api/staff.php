<?php
$db = getDB();

switch ($method) {
  case 'GET':
    $sql = "SELECT * FROM users WHERE role IN ('Administrator','Staff','Assistant')";
    $params = [];

    if (!empty($_GET['department'])) {
      $sql .= ' AND department = ?';
      $params[] = $_GET['department'];
    }
    if (!empty($_GET['status'])) {
      $sql .= ' AND status = ?';
      $params[] = $_GET['status'];
    }

    $sql .= ' ORDER BY name';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    jsonResponse($stmt->fetchAll());
    break;

  case 'POST':
    $input = getJsonInput();
    $required = ['first_name', 'last_name', 'email', 'role'];
    foreach ($required as $field) {
      if (empty($input[$field])) {
        jsonError("Missing required field: $field");
      }
    }

    // Generate user ID
    $prefix = $input['role'] === 'Administrator' ? 'CUR' : 'USR';
    $stmt = $db->query("SELECT COUNT(*) as cnt FROM users WHERE id LIKE '$prefix-%'");
    $count = $stmt->fetch()['cnt'] + 1;
    $id = sprintf('%s-%s%08d', $prefix, $input['department'] === 'Museum Operations' ? 'MHY' : 'GEN', $count);

    $fullName = trim($input['first_name'] . ' ' . ($input['middle_name'] ?? '') . ' ' . $input['last_name']);

    $stmt = $db->prepare('
      INSERT INTO users (id, email, password_hash, first_name, middle_name, last_name, name, role, department, status, phone, joined_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ');
    $stmt->execute([
      $id,
      $input['email'],
      password_hash($input['password'] ?? 'changeme123', PASSWORD_BCRYPT),
      $input['first_name'],
      $input['middle_name'] ?? '',
      $input['last_name'],
      $fullName,
      $input['role'],
      $input['department'] ?? 'Museum Operations',
      $input['status'] ?? 'Active',
      $input['phone'] ?? '',
      $input['joined_date'] ?? date('Y-m-d'),
    ]);

    jsonResponse(['id' => $id, 'message' => 'Staff created'], 201);
    break;

  case 'PUT':
    if (!$id) jsonError('Staff ID required');
    $input = getJsonInput();

    $fields = [];
    $params = [];
    $allowed = ['first_name', 'middle_name', 'last_name', 'name', 'email', 'role', 'department', 'status', 'phone'];
    foreach ($allowed as $f) {
      if (isset($input[$f])) {
        $fields[] = "$f = ?";
        $params[] = $input[$f];
      }
    }
    if (empty($fields)) jsonError('No fields to update');

    $params[] = $id;
    $sql = 'UPDATE users SET ' . implode(', ', $fields) . ' WHERE id = ?';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    jsonResponse(['message' => 'Staff updated']);
    break;

  default:
    jsonError('Method not allowed', 405);
}
