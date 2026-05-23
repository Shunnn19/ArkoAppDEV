<?php
/**
 * API Router
 * 
 * Routes requests to the appropriate API handler.
 * 
 * GET  /api/museums          → list all museums
 * GET  /api/holidays         → list all holidays
 * GET  /api/bookings         → list bookings (?email=, ?museum=, ?date=)
 * POST /api/bookings         → create booking
 * PUT  /api/bookings/{ref}   → update booking
 * DELETE /api/bookings/{ref} → delete booking
 * GET  /api/slot-overrides   → list overrides (?museum=, ?date=)
 * POST /api/slot-overrides   → create/update override
 * GET  /api/log-entries      → list log entries (?museum=, ?date=)
 * POST /api/log-entries      → create log entry
 * GET  /api/staff-assignments → list assignments (?museum=)
 * POST /api/staff-assignments → create assignment
 * PUT  /api/staff-assignments/{id} → update assignment
 * GET  /api/notifications    → list notifications (?recipient=)
 * POST /api/notifications    → create notification
 * GET  /api/staff            → list staff
 * POST /api/staff            → create staff
 * PUT  /api/staff/{id}       → update staff
 * GET  /api/visit-quotas     → list quotas
 * POST /api/visit-quotas     → create quota
 * PUT  /api/visit-quotas/{id}→ update quota
 * GET  /api/members          → list members
 * GET  /api/users            → list users
 * POST /api/auth/login       → login
 */

require_once __DIR__ . '/config/database.php';

// Handle CORS preflight — actual CORS headers set by .htaccess
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

$segments = getPathSegments();
$method   = $_SERVER['REQUEST_METHOD'];

// Remove leading 'museum-api' if present (subdirectory)
if (isset($segments[0]) && $segments[0] === 'museum-api') {
  array_shift($segments);
}

// Remove leading 'api' if present
if (isset($segments[0]) && $segments[0] === 'api') {
  array_shift($segments);
}

$resource = $segments[0] ?? null;
$id       = $segments[1] ?? null;

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

// Auth protection — public routes don't need a token
$publicRoutes  = ['museums', 'holidays', 'auth', 'visitors', 'visit-schedules'];
$hybridRoutes  = ['visitor-bookings']; // some methods are public, handler checks
$authUser      = getAuthUser(); // null if no/invalid token
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
