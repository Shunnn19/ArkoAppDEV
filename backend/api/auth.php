<?php
$db = getDB();

if ($method !== 'POST') {
  jsonError('Method not allowed', 405);
}

$segments = getPathSegments();
$action = $id; // login, register, or logout

if ($action === 'login') {
  $input = getJsonInput();
  if (empty($input['email']) || empty($input['password'])) {
    jsonError('Email and password required');
  }

  $stmt = $db->prepare('SELECT * FROM users WHERE email = ?');
  $stmt->execute([$input['email']]);
  $user = $stmt->fetch();

  if (!$user || !password_verify($input['password'], $user['password_hash'])) {
    jsonError('Invalid credentials', 401);
  }

  // Check if user is active
  if ($user['status'] !== 'Active') {
    jsonError('Account is inactive. Please contact an administrator.', 403);
  }

  // Generate 256-bit random token
  $token = bin2hex(random_bytes(32));
  $rememberMe = !empty($input['rememberMe']);
  $expires = $rememberMe
    ? date('Y-m-d H:i:s', strtotime('+7 days'))
    : date('Y-m-d H:i:s', strtotime('+24 hours'));

  // Store token in database
  $stmt = $db->prepare('UPDATE users SET auth_token = ?, auth_token_expires = ? WHERE id = ?');
  $stmt->execute([$token, $expires, $user['id']]);

  jsonResponse([
    'token' => $token,
    'expiresAt' => $expires,
    'user' => [
      'id' => $user['id'],
      'name' => $user['name'],
      'email' => $user['email'],
      'role' => $user['role'],
    ],
  ]);
} elseif ($action === 'register') {
  $input = getJsonInput();
  if (empty($input['email']) || empty($input['password']) || empty($input['name'])) {
    jsonError('Name, email, and password required');
  }

  // Check existing
  $stmt = $db->prepare('SELECT id FROM users WHERE email = ?');
  $stmt->execute([$input['email']]);
  if ($stmt->fetch()) {
    jsonError('Email already registered', 409);
  }

  $id = 'USR-GEN' . str_pad((string)rand(1, 99999999), 8, '0', STR_PAD_LEFT);

  $stmt = $db->prepare('
    INSERT INTO users (id, email, password_hash, first_name, last_name, name, role, department, status, joined_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  ');
  $nameParts = explode(' ', $input['name'], 2);
  $stmt->execute([
    $id,
    $input['email'],
    password_hash($input['password'], PASSWORD_BCRYPT),
    $nameParts[0] ?? '',
    $nameParts[1] ?? '',
    $input['name'],
    $input['role'] ?? 'General',
    $input['department'] ?? '',
    'Active',
    date('Y-m-d'),
  ]);

  jsonResponse(['id' => $id, 'message' => 'User registered'], 201);
} elseif ($action === 'logout') {
  $authUser = requireAuth();
  $stmt = $db->prepare('UPDATE users SET auth_token = NULL, auth_token_expires = NULL WHERE id = ?');
  $stmt->execute([$authUser['id']]);
  jsonResponse(['message' => 'Logged out successfully']);
} else {
  jsonError('Unknown action', 404);
}
