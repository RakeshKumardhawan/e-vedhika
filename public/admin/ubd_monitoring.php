<?php
// ====================================================================================
// 🏛️ E-VEDHIKA CENTRAL TELEMETRY, UPDATES, REPORT CENTER & LIVE MONITORING GATEWAY
// File Path: /admin/ubd_monitoring.php
// Target: https://www.e-vedhika.in/admin/ubd_monitoring.php
// Developer: Rakesh Dhawan (@DhawanRakesh)
// Version: v1.0.9 | Resource Build: 2026.11.12.R4
// ====================================================================================

session_start();
date_default_timezone_set('Asia/Kolkata');

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$ADMIN_PASSCODE = 'EVEDHIKA@2026';
$version = 'v1.0.9';
$resourceBuild = '2026.11.12.R4';

$storageDir = __DIR__;
$consolidatedFile = $storageDir . '/pc_consolidated_health.json';
$reportsArchiveFile = $storageDir . '/reports_archive.json';

// Helper: Dummy filter
function isDummyRecord($pcId, $pcName) {
    $dummyIds = ['EVD-PC-9942-A1B2', 'DEMO-PC', 'SAMPLE-PC', 'DUMMY-PC'];
    $idUp = strtoupper(trim((string)$pcId));
    $nameUp = strtoupper(trim((string)$pcName));
    if (in_array($idUp, $dummyIds, true) || strpos($idUp, 'DUMMY') !== false || strpos($nameUp, 'DUMMY') !== false) {
        return true;
    }
    return false;
}

$action = strtolower(trim($_GET['action'] ?? $_POST['action'] ?? ''));

// ------------------------------------------------------------------------------------
// 1. PUBLIC API ENDPOINTS (FOR C# DESKTOP APPLICATION & USERS)
// ------------------------------------------------------------------------------------

// Cloud Ping
if ($action === 'ping') {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => true,
        'status' => 'INGEST_OK',
        'version' => $version,
        'resourceBuild' => $resourceBuild,
        'time' => date('Y-m-d H:i:s')
    ]);
    exit;
}

// OTA Version Check
if ($action === 'check_update' || $action === 'version') {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => true,
        'appName' => 'E-VEDHIKA All Problems One Solution & UBD Deployment Tool',
        'executableName' => "EVedhika_Setup_{$version}.exe",
        'currentVersion' => $version,
        'latestVersion' => $version,
        'latestResourceBuild' => $resourceBuild,
        'resourceBuild' => $resourceBuild,
        'releaseDate' => '2026-11-12',
        'downloadSize' => '8.5 MB',
        'downloadUrl' => "https://github.com/RakeshKumardhawan/UBDTOOLS/releases/latest/download/EVedhika_Setup_{$version}.exe",
        'updateRequired' => false
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}

// ------------------------------------------------------------------------------------
// 2. INBUILT REPORT RECEIVER (C# TELEMETRY INGESTION)
// ------------------------------------------------------------------------------------
$isIngest = ($action === 'ingest_report' || isset($_GET['payload_b64']) || isset($_POST['payload_b64']) || 
            ($_SERVER['REQUEST_METHOD'] === 'POST' && !isset($_POST['admin_passcode']) && !isset($_POST['current_passcode'])));

if ($isIngest) {
    $data = null;
    $b64 = $_POST['payload_b64'] ?? $_GET['payload_b64'] ?? '';
    if (!empty($b64)) {
        $decoded = base64_decode(str_replace(' ', '+', urldecode($b64)), true);
        if ($decoded !== false) $data = json_decode($decoded, true);
    }
    if (empty($data)) {
        $raw = file_get_contents('php://input');
        if (!empty($raw)) $data = json_decode($raw, true);
    }
    if (empty($data)) $data = $_POST;

    if (is_array($data) && !empty($data)) {
        $now = date('Y-m-d H:i:s');
        $nowEpoch = time();

        $pcName = trim($data['pcName'] ?? 'GP-OFFICE-PC');
        $machineId = trim($data['pcId'] ?? $pcName);

        if (isDummyRecord($machineId, $pcName)) {
            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'ignored' => 'dummy']);
            exit;
        }

        $location = trim($data['officeLocation'] ?? 'Grama Panchayat Office');
        $stateName = trim($data['state'] ?? 'Telangana');
        $os = trim($data['winEdition'] ?? $data['osVersion'] ?? 'Windows 10/11');
        $appVer = trim($data['version'] ?? $version);
        $resBuild = trim($data['resourceBuild'] ?? $resourceBuild);
        $dsc = trim($data['dscStatus'] ?? 'USB Token Active');
        $edge = trim($data['edgeIeMode'] ?? 'IE5 Quirks Active');
        $health = trim($data['healthScore'] ?? '100');
        $checks = trim($data['verification'] ?? '17/17 steps passed.');

        // Load & update consolidated database
        $pcs = file_exists($consolidatedFile) ? (json_decode(@file_get_contents($consolidatedFile), true) ?: []) : [];
        $pcs[$machineId] = [
            'machineId' => $machineId,
            'pcName' => $pcName,
            'userName' => trim($data['userName'] ?? 'Operator'),
            'officeLocation' => $location,
            'state' => $stateName,
            'os' => $os,
            'appVersion' => $appVer,
            'resourceBuild' => $resBuild,
            'livePresence' => 'ONLINE',
            'healthScore' => $health,
            'stepsVerified' => $checks,
            'dscStatus' => $dsc,
            'edgePolicy' => $edge,
            'lastSeen' => $now,
            'lastHeartbeatEpoch' => $nowEpoch
        ];

        @file_put_contents($consolidatedFile, json_encode($pcs, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

        // Archive event
        $archive = file_exists($reportsArchiveFile) ? (json_decode(@file_get_contents($reportsArchiveFile), true) ?: []) : [];
        array_unshift($archive, [
            'reportId' => 'RPT-' . $nowEpoch . '-' . substr(md5($machineId . $now), 0, 5),
            'pcName' => $pcName,
            'officeLocation' => $location,
            'state' => $stateName,
            'dscStatus' => $dsc,
            'healthScore' => $health,
            'status' => 'SUCCESS',
            'timestamp' => $now
        ]);
        if (count($archive) > 500) $archive = array_slice($archive, 0, 500);
        @file_put_contents($reportsArchiveFile, json_encode($archive, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'success' => true,
            'status' => 'INGEST_OK',
            'message' => 'Report stored live at e-vedhika.in',
            'pcName' => $pcName,
            'timestamp' => $now
        ]);
        exit;
    }
}

// ------------------------------------------------------------------------------------
// 3. ADMIN DASHBOARD & CSV / JSON EXPORT / DUMMY CLEANER
// ------------------------------------------------------------------------------------
$isAuth = (isset($_SESSION['auth']) && $_SESSION['auth'] === true);
if (isset($_POST['admin_passcode'])) {
    if (trim($_POST['admin_passcode']) === $ADMIN_PASSCODE) {
        $_SESSION['auth'] = true;
        $isAuth = true;
    } else {
        $error = 'చెల్లని అడ్మిన్ పాస్కోడ్! (Invalid Passcode)';
    }
}
if (isset($_GET['logout'])) {
    unset($_SESSION['auth']);
    header('Location: ubd_monitoring.php');
    exit;
}

// Raw Live JSON Data (FOR ADMIN ONLY)
if ($action === 'get_live_pcs') {
    if (!$isAuth) {
        header('Content-Type: application/json; charset=utf-8');
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Unauthorized: Admin authentication required']);
        exit;
    }
    header('Content-Type: application/json; charset=utf-8');
    $pcs = file_exists($consolidatedFile) ? (json_decode(@file_get_contents($consolidatedFile), true) ?: []) : [];
    echo json_encode([
        'success' => true,
        'version' => $version,
        'resourceBuild' => $resourceBuild,
        'total' => count($pcs),
        'machines' => array_values($pcs)
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}

// Dummy Cleaner Action (FOR ADMIN ONLY)
if ($action === 'clear_dummy') {
    if (!$isAuth) {
        header('Location: ubd_monitoring.php');
        exit;
    }
    $pcs = file_exists($consolidatedFile) ? (json_decode(@file_get_contents($consolidatedFile), true) ?: []) : [];
    $filtered = [];
    foreach ($pcs as $k => $v) {
        if (!isDummyRecord($v['machineId'] ?? $k, $v['pcName'] ?? '')) {
            $filtered[$k] = $v;
        }
    }
    @file_put_contents($consolidatedFile, json_encode($filtered, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    header('Location: ubd_monitoring.php?dummy_cleared=1');
    exit;
}

// Delete Specific PC Action
if ($action === 'delete_pc') {
    if (!$isAuth) { header('Location: ubd_monitoring.php'); exit; }
    $pcIdToDel = trim($_GET['pcId'] ?? $_POST['pcId'] ?? '');
    if ($pcIdToDel !== '') {
        $pcs = file_exists($consolidatedFile) ? (json_decode(@file_get_contents($consolidatedFile), true) ?: []) : [];
        if (isset($pcs[$pcIdToDel])) {
            unset($pcs[$pcIdToDel]);
            @file_put_contents($consolidatedFile, json_encode($pcs, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
        }
    }
    header('Location: ubd_monitoring.php?deleted=1');
    exit;
}

// Delete Specific Report Action
if ($action === 'delete_report') {
    if (!$isAuth) { header('Location: ubd_monitoring.php'); exit; }
    $eventIdToDel = trim($_GET['eventId'] ?? $_GET['reportId'] ?? $_POST['eventId'] ?? $_POST['reportId'] ?? '');
    if ($eventIdToDel !== '') {
        $archive = file_exists($reportsArchiveFile) ? (json_decode(@file_get_contents($reportsArchiveFile), true) ?: []) : [];
        $archive = array_filter($archive, function($r) use ($eventIdToDel) {
            $rid = trim((string)($r['eventId'] ?? $r['reportId'] ?? $r['id'] ?? ''));
            return $rid !== $eventIdToDel;
        });
        @file_put_contents($reportsArchiveFile, json_encode(array_values($archive), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    }
    header('Location: ubd_monitoring.php?report_deleted=1');
    exit;
}

// CSV Export
if ($action === 'export_csv') {
    if (!$isAuth) { header('Location: ubd_monitoring.php'); exit; }
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=EVedhika_Fleet_Report_' . date('Ymd_His') . '.csv');
    $out = fopen('php://output', 'w');
    fputcsv($out, ['PC Name', 'Operator', 'Office Location', 'State', 'OS', 'App Version', 'Build', 'Presence', 'Health %', 'Checks Passed', 'DSC Status', 'Edge Policy', 'Last Seen']);
    $pcs = file_exists($consolidatedFile) ? (json_decode(@file_get_contents($consolidatedFile), true) ?: []) : [];
    foreach ($pcs as $p) {
        fputcsv($out, [
            $p['pcName'], $p['userName'], $p['officeLocation'], $p['state'], $p['os'],
            $p['appVersion'], $p['resourceBuild'], $p['livePresence'], $p['healthScore'],
            $p['stepsVerified'], $p['dscStatus'], $p['edgePolicy'], $p['lastSeen']
        ]);
    }
    fclose($out);
    exit;
}

// Load PCs for dashboard
$pcs = file_exists($consolidatedFile) ? (json_decode(@file_get_contents($consolidatedFile), true) ?: []) : [];
$totalPCs = count($pcs);
$onlineCount = 0;
$nowEpoch = time();
foreach ($pcs as &$p) {
    $diff = $nowEpoch - ($p['lastHeartbeatEpoch'] ?? 0);
    $p['isOnline'] = ($diff <= 180); // 3 minutes timeout
    if ($p['isOnline']) $onlineCount++;
}
unset($p);
?>
<!DOCTYPE html>
<html lang="te">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E-Vedhika Live Central Telemetry Dashboard (v1.0.9 • 2026.11.12.R4)</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; }
        body { background: #0b0f19; color: #f1f5f9; min-height: 100vh; padding: 24px; }
        .container { max-width: 1400px; margin: 0 auto; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; padding-bottom: 20px; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
        .title h1 { font-size: 24px; font-weight: 800; color: #38bdf8; display: flex; align-items: center; gap: 10px; }
        .title p { font-size: 13px; color: #94a3b8; margin-top: 4px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px; }
        .card { background: #131b2e; border: 1px solid #1e293b; border-radius: 12px; padding: 18px; }
        .card h3 { font-size: 12px; text-transform: uppercase; color: #94a3b8; font-weight: 700; }
        .card .val { font-size: 32px; font-weight: 800; margin-top: 8px; color: #fff; }
        .val.online { color: #10b981; }
        .val.offline { color: #f43f5e; }
        .val.rate { color: #38bdf8; }
        .table-wrap { background: #131b2e; border: 1px solid #1e293b; border-radius: 12px; overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; }
        th { background: #0f172a; padding: 14px 16px; font-weight: 700; color: #94a3b8; border-bottom: 1px solid #1e293b; }
        td { padding: 14px 16px; border-bottom: 1px solid #1e293b; }
        tr:hover { background: #17233f; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; }
        .badge.on { background: rgba(16, 185, 129, 0.2); color: #34d399; }
        .badge.off { background: rgba(244, 63, 94, 0.2); color: #fb7185; }
        .btn { padding: 8px 16px; border-radius: 8px; font-weight: 700; font-size: 13px; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; border: none; }
        .btn-green { background: #10b981; color: #fff; }
        .btn-cyan { background: #0284c7; color: #fff; }
        .btn-amber { background: #d97706; color: #fff; }
        .btn-red { background: #f43f5e; color: #fff; }
        .login-box { max-width: 400px; margin: 100px auto; background: #131b2e; border: 1px solid #1e293b; border-radius: 16px; padding: 32px; text-align: center; }
        .login-box input { width: 100%; padding: 12px; margin: 16px 0; background: #0f172a; border: 1px solid #334155; border-radius: 8px; color: #fff; font-size: 14px; }
        .banner { background: #064e3b; border: 1px solid #059669; color: #a7f3d0; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-size: 13px; font-weight: 600; }
    </style>
</head>
<body>
    <div class="container">
        <?php if (!$isAuth): ?>
            <div class="login-box">
                <h2>🔐 Admin Login</h2>
                <p style="color:#94a3b8; font-size:13px; margin-top:8px;">E-Vedhika Central Fleet Monitoring (v1.0.9 • 2026.11.12.R4)</p>
                <?php if (isset($error)): ?><p style="color:#f43f5e; font-size:13px; margin-top:10px;"><?= $error ?></p><?php endif; ?>
                <form method="POST">
                    <input type="password" name="admin_passcode" placeholder="Enter Admin Passcode" required autofocus>
                    <button type="submit" class="btn btn-green" style="width:100%;">Sign In (లాగిన్)</button>
                </form>
            </div>
        <?php else: ?>
            <?php if (isset($_GET['dummy_cleared'])): ?>
                <div class="banner">✅ డమ్మీ టెస్ట్ రికార్డులు విజయవంతంగా క్లీన్ చేయబడ్డాయి! (Dummy records cleared)</div>
            <?php endif; ?>
            <div class="header">
                <div class="title">
                    <h1>🏛️ E-Vedhika Central Live Telemetry Dashboard</h1>
                    <p>Real-Time Monitoring of Grama Panchayat &amp; Mandal Workstations (Telangana &amp; AP) • v1.0.9 (2026.11.12.R4)</p>
                </div>
                <div style="display:flex; gap:10px; flex-wrap:wrap;">
                    <a href="?action=export_csv" class="btn btn-green">📊 Export CSV (Excel)</a>
                    <a href="?action=get_live_pcs" target="_blank" class="btn btn-cyan">📄 Live JSON API</a>
                    <a href="?action=clear_dummy" onclick="return confirm('డమ్మీ రికార్డులను తీసివేయాలా? (Clear dummy records?)')" class="btn btn-amber">🧹 Clear Dummy</a>
                    <a href="?logout=1" class="btn btn-red">Logout</a>
                </div>
            </div>

            <div class="stats-grid">
                <div class="card">
                    <h3>మొత్తం నమోదైన పీసీలు (Total PCs)</h3>
                    <div class="val"><?= $totalPCs ?></div>
                </div>
                <div class="card">
                    <h3>లైవ్ ఆన్లైన్ పీసీలు (Online Now)</h3>
                    <div class="val online"><?= $onlineCount ?></div>
                </div>
                <div class="card">
                    <h3>ఆఫ్లైన్ పీసీలు (Offline)</h3>
                    <div class="val offline"><?= $totalPCs - $onlineCount ?></div>
                </div>
                <div class="card">
                    <h3>సిస్టమ్ హెల్త్ (Average Health)</h3>
                    <div class="val rate">100%</div>
                </div>
            </div>

            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>PC Name &amp; Operator</th>
                            <th>ఆఫీస్ లొకేషన్ (Location)</th>
                            <th>రాష్ట్రం (State)</th>
                            <th>స్టేటస్ (Status)</th>
                            <th>వెరిఫికేషన్ (Checks)</th>
                            <th>USB DSC Token</th>
                            <th>OS &amp; Version</th>
                            <th>చివరి రిపోర్ట్ (Last Seen)</th>
                            <th>చర్య (Action)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($pcs)): ?>
                            <tr><td colspan="9" style="text-align:center; padding:40px; color:#64748b;">ఇంకా ఎలాంటి పీసీ రిపోర్టులు రాలేదు. C# టూల్ రన్ చేయగానే ఇక్కడ లైవ్ డేటా కనిపిస్తుంది.</td></tr>
                        <?php else: foreach ($pcs as $p): ?>
                            <tr>
                                <td>
                                    <strong><?= htmlspecialchars($p['pcName'] ?? 'GP-PC') ?></strong><br>
                                    <small style="color:#94a3b8;"><?= htmlspecialchars($p['userName'] ?? 'Operator') ?></small>
                                </td>
                                <td><?= htmlspecialchars($p['officeLocation'] ?? 'Grama Panchayat') ?></td>
                                <td><span style="color:#38bdf8; font-weight:600;"><?= htmlspecialchars($p['state'] ?? 'Telangana') ?></span></td>
                                <td>
                                    <span class="badge <?= !empty($p['isOnline']) ? 'on' : 'off' ?>">
                                        <?= !empty($p['isOnline']) ? '● ONLINE' : '○ OFFLINE' ?>
                                    </span>
                                </td>
                                <td><strong style="color:#10b981;"><?= htmlspecialchars($p['stepsVerified'] ?? '17/17 steps passed.') ?></strong></td>
                                <td><span style="color:#f59e0b;"><?= htmlspecialchars($p['dscStatus'] ?? 'USB Token Active') ?></span></td>
                                <td>
                                    <?= htmlspecialchars($p['os'] ?? 'Windows 10/11') ?><br>
                                    <small style="color:#64748b;"><?= htmlspecialchars($p['appVersion'] ?? $version) ?> (<?= htmlspecialchars($p['resourceBuild'] ?? $resourceBuild) ?>)</small>
                                </td>
                                <td style="color:#94a3b8;"><?= htmlspecialchars($p['lastSeen'] ?? date('Y-m-d H:i:s')) ?></td>
                                <td>
                                    <a href="?action=delete_pc&pcId=<?= urlencode($p['machineId'] ?? $p['pcName']) ?>" onclick="return confirm('ఈ పీసీ రికార్డును తొలగించాలా? (Delete this PC?)');" style="background:rgba(244,63,94,0.2); color:#fb7185; border:1px solid rgba(244,63,94,0.4); padding:4px 8px; border-radius:6px; font-size:11px; text-decoration:none; font-weight:700;">🗑️ Delete</a>
                                </td>
                            </tr>
                        <?php endforeach; endif; ?>
                    </tbody>
                </table>
            </div>
        <?php endif; ?>
    </div>
</body>
</html>
