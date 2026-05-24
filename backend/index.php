<?php
require_once __DIR__ . '/config/database.php';

// Handle CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

// Support both: path-based (local) and ?route= (production)
$route = trim($_GET['route'] ?? '', '/');
if (!$route) {
  $segments = getPathSegments();
  // Remove 'museum-api' or 'api' prefix if present
  while (!empty($segments) && in_array($segments[0], ['museum-api', 'api', 'index.php'])) {
    array_shift($segments);
  }
  $resource = $segments[0] ?? null;
  $id       = $segments[1] ?? null;
} else {
  $parts = explode('/', $route);
  $resource = $parts[0] ?? null;
  $id       = $parts[1] ?? null;
}

$method = $_SERVER['REQUEST_METHOD'];

$handlers = [
  'museums'            => 'api/museums.php',
  'holidays'           => 'api/holidays.php',
  'bookings'           => 'api/bookings.php',
  'slot-overrides'     => 'api/slot_overrides.php',
  'log-entries'        => 'api/log_entries.php',
  'staff'              => 'api/staff.php',
  'visit-quotas'       => 'api/visit_quotas.php',
  'members'            => 'api/members.php',
  'users'              => 'api/users.php',
  'auth'               => 'api/auth.php',
  'visitors'           => 'api/visitors.php',
  'visit-schedules'    => 'api/visit_schedules.php',
  'visitor-bookings'   => 'api/visitor_bookings.php',
  'staff-assignments'  => 'api/staff_assignments.php',
  'walk-in-visitors'   => 'api/walk_in_visitors.php',
  'attendance-logs'    => 'api/attendance_logs.php',
  'notifications'      => 'api/notifications.php',
];

$publicRoutes  = ['museums', 'holidays', 'auth', 'visitors', 'visit-schedules'];
$hybridRoutes  = ['visitor-bookings'];
$authUser      = getAuthUser();
$protected     = !in_array($resource, $publicRoutes) && !in_array($resource, $hybridRoutes);

if ($resource && $protected && !$authUser) {
  jsonError('Authentication required', 401);
}

if ($resource && isset($handlers[$resource])) {
  require __DIR__ . '/' . $handlers[$resource];
} else {
  jsonResponse([
    'service' => 'Museum Operations API',
    'version' => '1.0.0',
    'endpoints' => array_keys($handlers),
  ]);
}
