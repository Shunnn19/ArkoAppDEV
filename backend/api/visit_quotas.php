<?php
$db = getDB();

switch ($method) {
  case 'GET':
    $stmt = $db->query('SELECT * FROM visit_quotas ORDER BY last_updated DESC');
    jsonResponse($stmt->fetchAll());
    break;

  case 'POST':
    $input = getJsonInput();
    if (empty($input['period']) || !isset($input['target'])) {
      jsonError('Missing required fields: period, target');
    }

    // Generate ID
    $stmt = $db->query("SELECT COUNT(*) as cnt FROM visit_quotas");
    $count = $stmt->fetch()['cnt'] + 1;
    $quotaId = sprintf('Q%03d', $count);

    $actual = (int)($input['actual'] ?? 0);
    $target = (int)$input['target'];
    $progress = $target > 0 ? min(100, (int)($actual / $target * 100)) : 0;
    $status = $actual >= $target ? 'Met' : 'Unmet';

    $stmt = $db->prepare('
      INSERT INTO visit_quotas (quota_id, period, target, actual, progress, status)
      VALUES (?, ?, ?, ?, ?, ?)
    ');
    $stmt->execute([$quotaId, $input['period'], $target, $actual, $progress, $status]);

    jsonResponse(['quota_id' => $quotaId, 'message' => 'Quota created'], 201);
    break;

  case 'PUT':
    if (!$id) jsonError('Quota ID required');
    $input = getJsonInput();

    $fields = [];
    $params = [];
    if (isset($input['target'])) {
      $fields[] = 'target = ?';
      $params[] = (int)$input['target'];
    }
    if (isset($input['actual'])) {
      $fields[] = 'actual = ?';
      $params[] = (int)$input['actual'];
    }
    if (isset($input['period'])) {
      $fields[] = 'period = ?';
      $params[] = $input['period'];
    }
    if (empty($fields)) jsonError('No fields to update');

    // Recalculate progress and status if target or actual changed
    $stmt = $db->prepare("SELECT target, actual FROM visit_quotas WHERE quota_id = ?");
    $stmt->execute([$id]);
    $current = $stmt->fetch();
    if ($current) {
      $target = (int)(isset($input['target']) ? $input['target'] : $current['target']);
      $actual = (int)(isset($input['actual']) ? $input['actual'] : $current['actual']);
      $progress = $target > 0 ? min(100, (int)($actual / $target * 100)) : 0;
      $status = $actual >= $target ? 'Met' : 'Unmet';
      $fields[] = 'progress = ?';
      $fields[] = 'status = ?';
      $params[] = $progress;
      $params[] = $status;
    }

    $fields[] = 'last_updated = CURRENT_DATE';
    $params[] = $id;
    $sql = 'UPDATE visit_quotas SET ' . implode(', ', $fields) . ' WHERE quota_id = ?';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    jsonResponse(['message' => 'Quota updated']);
    break;

  default:
    jsonError('Method not allowed', 405);
}
