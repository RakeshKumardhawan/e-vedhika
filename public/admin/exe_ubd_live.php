<?php
// ====================================================================================
// 🏛️ E-VEDHIKA CENTRAL TELEMETRY, UPDATES & LIVE MONITORING GATEWAY (v1.0.7)
// File Path: /admin/exe_ubd_live.php  (URL: https://www.e-vedhika.in/admin/exe_ubd_live)
// Developer: Rakesh Dhawan (@DhawanRakesh)
// ====================================================================================

// 1. Enable Global CORS Headers (Allows C# Apps, Web Browser & External Tools to Communicate)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataFile = __DIR__ . '/telemetry_storage.json';
$botToken = "8822107822:AAG9TIOX1lnRXpUuKCbs7ppM3r1TPTnNYrE";
$chatId = "431228008";

// 2. Clear Logs Action (Optional for Admin)
if (isset($_GET['clear']) && $_GET['clear'] === '1') {
    if (file_exists($dataFile)) unlink($dataFile);
    header('Location: ' . strtok($_SERVER['REQUEST_URI'], '?'));
    exit;
}

$action = strtolower($_GET['action'] ?? $_POST['action'] ?? '');

// 3. ACTION: Software Update & Version Check (Used by C# Tool and Web Portal)
if ($action === 'check_update' || $action === 'version') {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => true,
        'name' => 'E-VEDHIKA All Problems One Solution & UBD Deployment Tool',
        'appName' => 'E-VEDHIKA All Problems One Solution & UBD Deployment Tool',
        'executableName' => 'EVedhika_Setup_v1.0.7.exe',
        'currentVersion' => 'v1.0.7',
        'latestVersion' => 'v1.0.7',
        'versionCode' => 10070,
        'releaseDate' => '2026-10-17',
        'downloadUrl' => 'https://github.com/RakeshKumardhawan/UBDTOOLS/releases/latest/download/EVedhika_Setup_v1.0.7.exe',
        'githubRepo' => 'https://github.com/RakeshKumardhawan/UBDTOOLS',
        'updateRequired' => false,
        'silent' => false,
        'releaseNotes' => 'Enterprise v1.0.7: Instant Install Reporting, Zone 2 Automation, Telegram Live Heartbeat & Windows 7/8/10/11 Full Support.',
        'publisher' => 'E-Vedhika.in (Rakesh Dhawan)',
        'telemetryRelayUrl' => 'https://www.e-vedhika.in/admin/exe_ubd_live'
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}

// 4. ACTION: Live News & Announcements
if ($action === 'get_news' || $action === 'news') {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'news' => [
            [
                'title' => 'E-Vedhika v1.0.7 Live Deployment Engine Active',
                'content' => 'UBD Telangana (ubd.telangana.gov.in) Zone 2 Registry Automation, DSC Token Drivers & Central Live Telemetry active.',
                'date' => date('Y-m-d'),
                'importance' => 'HIGH'
            ]
        ]
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}

// 5. ACTION: Export JSON Logs (Used by Web App to Sync Cloud Logs)
if ($action === 'export' || (isset($_GET['format']) && $_GET['format'] === 'json')) {
    header('Content-Type: application/json; charset=utf-8');
    $logs = file_exists($dataFile) ? (json_decode(file_get_contents($dataFile), true) ?: []) : [];
    echo json_encode(['success' => true, 'count' => count($logs), 'logs' => $logs], JSON_PRETTY_PRINT);
    exit;
}

// 6. HANDLE INCOMING POST TELEMETRY & INSTALLATION NOTIFICATIONS
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    if (!$data) {
        $data = $_POST;
    }

    if (!empty($data)) {
        $logs = [];
        if (file_exists($dataFile)) {
            $jsonData = file_get_contents($dataFile);
            $logs = json_decode($jsonData, true) ?: [];
        }

        // Standardize timestamps, IDs, and PC details
        $now = date('Y-m-d H:i:s');
        $data['receivedAt'] = $now;
        if (!isset($data['id'])) {
            $data['id'] = 'TEL-' . time() . '-' . rand(100, 999);
        }

        $pcName = $data['pcName'] ?? $data['computerName'] ?? 'Unknown-PC';
        $userName = $data['userName'] ?? $data['operatorName'] ?? 'Panchayat Operator';
        $location = $data['officeLocation'] ?? $data['office'] ?? 'Telangana GP Office';
        $status = strtoupper($data['status'] ?? 'SUCCESS');
        $version = $data['deployVersion'] ?? $data['version'] ?? 'v1.0.7';
        $os = $data['osVersion'] ?? 'Windows';
        $dsc = $data['dscStatus'] ?? 'Connected';
        $remarks = $data['remarks'] ?? 'Report received from client machine.';

        // Detect attached files / logs
        $fileLink = $data['fileLink'] ?? $data['link'] ?? $data['fileUrl'] ?? null;
        if (!empty($fileLink)) {
            $data['hasFile'] = true;
        }

        // Prepend new report to storage (keeps latest 1000 records)
        array_unshift($logs, $data);
        if (count($logs) > 1000) {
            $logs = array_slice($logs, 0, 1000);
        }
        @file_put_contents($dataFile, json_encode($logs, JSON_PRETTY_PRINT));

        // 7. AUTOMATIC DUAL TELEGRAM ALERT DISPATCH
        $headerEmoji = "🛡️";
        $headerTitle = "E-VEDHIKA TELEMETRY REPORT (Live)";
        
        if (stripos($status, 'INSTALLED') !== false || stripos($remarks, 'Installation') !== false) {
            $headerEmoji = "🎉";
            $headerTitle = "NEW E-VEDHIKA INSTALLATION DETECTED!";
        } elseif (stripos($status, 'ONLINE') !== false || stripos($remarks, 'App Opened') !== false) {
            $headerEmoji = "⚡";
            $headerTitle = "PC ONLINE & APP OPENED (v1.0.7)";
        } elseif (stripos($status, 'ISSUE') !== false || stripos($status, 'ERROR') !== false) {
            $headerEmoji = "🚨";
            $headerTitle = "UBD PORTAL / TOKEN ISSUE REPORTED!";
        }

        $teleMsg = "{$headerEmoji} <b>{$headerTitle}</b>\n" .
                   "━━━━━━━━━━━━━━━━━━━━━━━━━━\n" .
                   "🏢 <b>Office:</b> " . htmlspecialchars($location) . "\n" .
                   "💻 <b>PC:</b> <code>" . htmlspecialchars($pcName) . "</code> (" . htmlspecialchars($userName) . ")\n" .
                   "🪟 <b>OS:</b> " . htmlspecialchars($os) . "\n" .
                   "🔏 <b>DSC Token:</b> " . htmlspecialchars($dsc) . "\n" .
                   "📦 <b>Version:</b> " . htmlspecialchars($version) . "\n" .
                   "📊 <b>Status:</b> <b>" . htmlspecialchars($status) . "</b>\n" .
                   "📝 <b>Summary:</b> " . htmlspecialchars($remarks) . "\n" .
                   "⏰ <b>Time:</b> " . $now . "\n" .
                   "━━━━━━━━━━━━━━━━━━━━━━━━━━\n";

        if (!empty($data['fileLink'])) {
            $teleMsg .= "📎 <b>ఫైల్ / లింక్:</b> <a href=\"" . htmlspecialchars($data['fileLink']) . "\">డౌన్‌లోడ్ చేయండి</a>\n";
        }

        $teleMsg .= "🌐 <b>Gateway:</b> https://www.e-vedhika.in/admin/exe_ubd_live";

        // Dispatch to Telegram Bot using cURL with timeout
        if (!empty($botToken) && !empty($chatId)) {
            $ch = curl_init("https://api.telegram.org/bot{$botToken}/sendMessage");
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
                'chat_id' => $chatId,
                'text' => $teleMsg,
                'parse_mode' => 'HTML',
                'disable_web_page_preview' => true
            ]));
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 4);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            @curl_exec($ch);
            curl_close($ch);
        }

        // Return clean JSON response
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'success' => true,
            'message' => 'Report stored and Telegram alert dispatched successfully!',
            'id' => $data['id'],
            'receivedAt' => $now
        ]);
        exit;
    }
}

// 8. RENDER WEB MONITORING DASHBOARD (When viewed in browser)
$logs = file_exists($dataFile) ? (json_decode(file_get_contents($dataFile), true) ?: []) : [];
$totalCount = count($logs);
$successCount = count(array_filter($logs, fn($l) => stripos($l['status'] ?? 'SUCCESS', 'SUCCESS') !== false));
$installCount = count(array_filter($logs, fn($l) => stripos($l['status'] ?? '', 'INSTALLED') !== false || stripos($l['remarks'] ?? '', 'Installation') !== false));
$issuesCount = count(array_filter($logs, fn($l) => stripos($l['status'] ?? '', 'ISSUE') !== false || stripos($l['status'] ?? '', 'ERROR') !== false));
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🏛️ E-Vedhika Live Telemetry Gateway & Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <meta http-equiv="refresh" content="15">
    <style> body { font-family: 'Inter', sans-serif; } .font-mono { font-family: 'JetBrains Mono', monospace; } </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-4 md:p-8">
    <div class="max-w-7xl mx-auto space-y-6">
        
        <!-- Header -->
        <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 rounded-3xl border border-indigo-900/40 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
            <div class="flex items-center gap-4">
                <div class="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-400/30 text-indigo-400 text-3xl shadow-inner">🛡️</div>
                <div>
                    <h1 class="text-2xl font-black text-white tracking-tight">ఈ-వేదిక (E-Vedhika) Live Telemetry Gateway</h1>
                    <p class="text-xs text-indigo-300 font-medium">Real-Time Central Monitoring & Automatic Telegram Alerts (@DhawanRakesh)</p>
                </div>
            </div>
            <div class="flex items-center gap-3">
                <a href="?action=check_update" target="_blank" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl border border-slate-700 transition">Test Update JSON</a>
                <a href="?format=json" target="_blank" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl border border-slate-700 transition">Export JSON</a>
                <a href="?clear=1" onclick="return confirm('మీరు అన్ని లాగ్స్‌ను క్లియర్ చేయాలనుకుంటున్నారా?');" class="px-4 py-2 bg-rose-900/60 hover:bg-rose-800 text-rose-200 text-xs font-bold rounded-xl border border-rose-700/50 transition">Clear Logs</a>
            </div>
        </div>

        <!-- Metrics Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow">
                <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">మొత్తం రిపోర్టులు</span>
                <span class="text-3xl font-black text-white mt-1 block font-mono"><?= $totalCount ?></span>
            </div>
            <div class="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow">
                <span class="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">విజయవంతమైనవి (Success)</span>
                <span class="text-3xl font-black text-emerald-400 mt-1 block font-mono"><?= $successCount ?></span>
            </div>
            <div class="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow">
                <span class="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block">కొత్త ఇన్‌స్టాలేషన్‌లు</span>
                <span class="text-3xl font-black text-indigo-400 mt-1 block font-mono"><?= $installCount ?></span>
            </div>
            <div class="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow">
                <span class="text-[11px] font-bold text-rose-400 uppercase tracking-wider block">ఎర్రర్లు / సమస్యలు</span>
                <span class="text-3xl font-black text-rose-400 mt-1 block font-mono"><?= $issuesCount ?></span>
            </div>
        </div>

        <!-- Live Reports Table -->
        <div class="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
            <div class="p-5 border-b border-slate-800 flex justify-between items-center">
                <h2 class="text-sm font-black text-white uppercase tracking-wider">Live Panchayat & Mandal Executions</h2>
                <span class="text-xs text-slate-400">ఆటో-రిఫ్రెష్: 15 సెకన్లకు ఒకసారి</span>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                    <thead class="bg-slate-950/60 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                        <tr>
                            <th class="p-4">Time</th>
                            <th class="p-4">PC & Operator</th>
                            <th class="p-4">Office Location</th>
                            <th class="p-4">OS / Windows</th>
                            <th class="p-4">DSC Status</th>
                            <th class="p-4">Status</th>
                            <th class="p-4">Summary</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-800/60">
                        <?php if (empty($logs)): ?>
                        <tr>
                            <td colspan="7" class="p-12 text-center text-slate-500 font-medium">
                                ఇంకా ఎటువంటి రిపోర్టులు రాలేదు. క్లయింట్ PC లో టూల్ ఇన్‌స్టాల్ లేదా రన్ అయిన వెంటనే ఇక్కడ ప్రత్యక్షమవుతాయి.
                            </td>
                        </tr>
                        <?php else: ?>
                        <?php foreach ($logs as $log): ?>
                        <tr class="hover:bg-slate-800/40 transition">
                            <td class="p-4 font-mono text-slate-400 whitespace-nowrap"><?= htmlspecialchars($log['receivedAt'] ?? $log['time'] ?? 'Just now') ?></td>
                            <td class="p-4">
                                <div class="font-bold text-white"><?= htmlspecialchars($log['pcName'] ?? 'PC') ?></div>
                                <div class="text-[10px] text-slate-400"><?= htmlspecialchars($log['userName'] ?? 'User') ?></div>
                            </td>
                            <td class="p-4 text-slate-300 font-medium"><?= htmlspecialchars($log['officeLocation'] ?? 'GP Office') ?></td>
                            <td class="p-4 text-slate-400 font-mono text-[11px]"><?= htmlspecialchars($log['osVersion'] ?? 'Windows') ?></td>
                            <td class="p-4">
                                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold <?= stripos($log['dscStatus'] ?? '', 'Connect') !== false ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-400' ?>">
                                    <?= htmlspecialchars($log['dscStatus'] ?? 'Not Checked') ?>
                                </span>
                            </td>
                            <td class="p-4 whitespace-nowrap">
                                <?php 
                                    $st = strtoupper($log['status'] ?? 'SUCCESS');
                                    $bg = 'bg-emerald-950 text-emerald-300 border-emerald-800';
                                    if (stripos($st, 'INSTALLED') !== false) $bg = 'bg-indigo-950 text-indigo-300 border-indigo-800';
                                    elseif (stripos($st, 'ONLINE') !== false) $bg = 'bg-sky-950 text-sky-300 border-sky-800';
                                    elseif (stripos($st, 'ISSUE') !== false || stripos($st, 'ERROR') !== false) $bg = 'bg-rose-950 text-rose-300 border-rose-800';
                                ?>
                                <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase border <?= $bg ?>"><?= htmlspecialchars($st) ?></span>
                            </td>
                            <td class="p-4 text-slate-300 max-w-xs truncate"><?= htmlspecialchars($log['remarks'] ?? 'Report completed.') ?></td>
                        </tr>
                        <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>

    </div>
</body>
</html>