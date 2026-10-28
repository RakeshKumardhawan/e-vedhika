<?php
// ====================================================================================
// 🏛️ E-VEDHIKA CENTRAL TELEMETRY & UBD LIVE MONITORING GATEWAY (v1.0.9)
// File Path: /admin/ubd_monitoring.php  (URL: https://www.e-vedhika.in/admin/ubd_monitoring)
// Developer: Rakesh Dhawan (@DhawanRakesh)
// ====================================================================================

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$storageDir = __DIR__;
$dataFile = $storageDir . '/telemetry_storage.json';
$consolidatedFile = $storageDir . '/pc_consolidated_health.json';

// Application Version
$version = 'v1.0.9';

// Central Telegram Bot Credentials
$botToken = "8822107822:AAG9TIOX1lnRXpUuKCbs7ppM3r1TPTnNYrE";
$chatId = "431228008";

// Helper: Dispatch Telegram Message
function sendTelegramMessage($token, $chat, $message) {
    if (empty($token) || empty($chat) || empty($message)) return false;
    $ch = curl_init("https://api.telegram.org/bot{$token}/sendMessage");
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'chat_id' => $chat,
        'text' => $message,
        'parse_mode' => 'HTML',
        'disable_web_page_preview' => true
    ]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 6);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $res = @curl_exec($ch);
    curl_close($ch);
    return $res;
}

// Helper: Get Normalized Consolidated Machine Health Records
function getNormalizedConsolidatedPcs($consolidatedFile) {
    if (file_exists($consolidatedFile)) {
        $raw = json_decode(@file_get_contents($consolidatedFile), true);
        if (is_array($raw)) return $raw;
    }
    return [];
}

// Clear Dummy Reports Action
if (isset($_GET['clear']) && $_GET['clear'] === '1') {
    if (file_exists($dataFile)) @unlink($dataFile);
    if (file_exists($consolidatedFile)) @unlink($consolidatedFile);
    header('Location: ' . strtok($_SERVER['REQUEST_URI'], '?'));
    exit;
}

// Handle Incoming POST Telemetry from C# App
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true) ?: $_POST;

    if (!empty($data)) {
        $now = date('Y-m-d H:i:s');
        $pcName = trim($data['pcName'] ?? $data['computerName'] ?? 'Unknown-PC');
        $machineId = trim($data['deviceInstallationId'] ?? $data['machineId'] ?? $data['pcId'] ?? $pcName);
        $userName = trim($data['userName'] ?? $data['operatorName'] ?? 'Panchayat Operator');
        $location = trim($data['officeLocation'] ?? $data['office'] ?? 'Grama Panchayat Office');
        $os = trim($data['osVersion'] ?? $data['os'] ?? 'Windows 11');
        $remarks = trim($data['remarks'] ?? $data['summary'] ?? 'Report received from client machine.');

        $stepsTotal = intval($data['stepsTotal'] ?? 17);
        $stepsVerified = intval($data['stepsVerified'] ?? ($data['status'] === 'SUCCESS' ? 17 : 12));

        $isIssue = (stripos($data['status'] ?? '', 'ISSUE') !== false || stripos($data['status'] ?? '', 'FAIL') !== false);
        $overallStatus = $isIssue ? 'DEGRADED' : 'ONLINE & READY';

        $pcs = getNormalizedConsolidatedPcs($consolidatedFile);
        
        // Strict Enforce: 1 Report per PC
        $pcs[$machineId] = [
            'machineId' => $machineId,
            'pcName' => $pcName,
            'userName' => $userName,
            'officeLocation' => $location,
            'os' => $os,
            'appVersion' => $version,
            'overallStatus' => $overallStatus,
            'stepsVerified' => "{$stepsVerified}/{$stepsTotal} Passed",
            'dscStatus' => trim($data['dscStatus'] ?? 'Connected'),
            'lastSeen' => $now,
            'lastSummary' => $remarks
        ];
        @file_put_contents($consolidatedFile, json_encode($pcs, JSON_PRETTY_PRINT));

        // Telegram Auto-Dispatch
        $statusEmoji = $isIssue ? '🚨' : '✅';
        $tgMsg = "🏛️ <b>E-VEDHIKA TELEMETRY REPORT RECEIVED</b>\n" .
                 "━━━━━━━━━━━━━━━━━━━━━━━━━━\n" .
                 "💻 <b>PC:</b> <code>" . htmlspecialchars($pcName) . "</code>\n" .
                 "🏢 <b>Office:</b> " . htmlspecialchars($location) . "\n" .
                 "👤 <b>Operator:</b> " . htmlspecialchars($userName) . "\n" .
                 "⚡ <b>Status:</b> {$statusEmoji} <b>" . htmlspecialchars($overallStatus) . "</b>\n" .
                 "⚙️ <b>Verification:</b> {$stepsVerified}/{$stepsTotal} Steps Verified\n" .
                 "📝 <b>Summary:</b> " . htmlspecialchars($remarks) . "\n" .
                 "⏰ <b>Timestamp:</b> {$now}\n" .
                 "━━━━━━━━━━━━━━━━━━━━━━━━━━\n" .
                 "🌐 <b>Admin Gateway:</b> https://www.e-vedhika.in/admin/ubd_monitoring";
        sendTelegramMessage($botToken, $chatId, $tgMsg);

        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['success' => true, 'message' => 'Telemetry logged successfully', 'pcId' => $machineId]);
        exit;
    }
}

// Prepare Data for Browser Rendering
$consolidatedPcs = getNormalizedConsolidatedPcs($consolidatedFile);
$totalPcs = count($consolidatedPcs);
$healthyPcs = count(array_filter($consolidatedPcs, fn($p) => in_array($p['overallStatus'] ?? '', ['ONLINE & READY', 'HEALTHY', 'SUCCESS'])));
$issueCount = count(array_filter($consolidatedPcs, fn($p) => !in_array($p['overallStatus'] ?? '', ['ONLINE & READY', 'HEALTHY', 'SUCCESS'])));
?>
<!DOCTYPE html>
<html lang="te">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🏛️ E-Vedhika Live Telemetry & UBD Monitoring Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <meta http-equiv="refresh" content="30">
    <style> body { font-family: 'Inter', sans-serif; } .font-mono { font-family: 'JetBrains Mono', monospace; } </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-4 md:p-8">
    <div class="max-w-7xl mx-auto space-y-6">
        
        <!-- Header Banner -->
        <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 rounded-3xl border border-indigo-900/40 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
            <div class="flex items-center gap-4">
                <img src="/ev-logo-v2.png" alt="E-Vedhika Logo" class="w-14 h-14 rounded-full object-contain drop-shadow-md border border-indigo-400/40">
                <div>
                    <h1 class="text-2xl font-black text-white tracking-tight">E-Vedhika Central Cloud Telemetry Dashboard</h1>
                    <p class="text-xs text-indigo-300 font-medium">Grama Panchayat & Mandal Office Live PC Monitoring Gateway (Admin: Rakesh Dhawan)</p>
                </div>
            </div>
            <div class="flex flex-wrap items-center gap-3">
                <a href="?clear=1" onclick="return confirm('అన్ని డమ్మి రిపోర్ట్లను తీసివేయాలా?')" class="px-4 py-2 bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow transition">
                    🗑️ క్లియర్ డమ్మి రిపోర్ట్స్
                </a>
                <a href="?t=<?= time() ?>" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow">
                    🔄 రిఫ్రెష్
                </a>
            </div>
        </div>

        <!-- Metric Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow">
                <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">మొత్తం కనెక్ట్ అయిన PCలు</span>
                <span class="text-3xl font-black text-white mt-1 block font-mono"><?= $totalPcs ?></span>
                <span class="text-[10px] text-slate-500 mt-0.5 block">1 PC కి 1 రిపోర్ట్ లిమిట్</span>
            </div>
            <div class="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow">
                <span class="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">ఆరోగ్యకరమైనవి (HEALTHY)</span>
                <span class="text-3xl font-black text-emerald-400 mt-1 block font-mono"><?= $healthyPcs ?></span>
                <span class="text-[10px] text-slate-500 mt-0.5 block">ONLINE &amp; READY (17/17 PASSED)</span>
            </div>
            <div class="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow">
                <span class="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">సమస్యలు ఉన్నవి (ATTENTION)</span>
                <span class="text-3xl font-black text-amber-400 mt-1 block font-mono"><?= $issueCount ?></span>
                <span class="text-[10px] text-slate-500 mt-0.5 block">వివరణాత్మక అలర్ట్లు</span>
            </div>
        </div>

        <!-- Real-Time Live Table -->
        <div class="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
            <div class="p-5 border-b border-slate-800 flex justify-between items-center">
                <h2 class="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <span class="text-indigo-400">⚡</span> UBD LIVE MONITORING REPORTS
                </h2>
                <span class="text-xs text-indigo-300 font-mono font-bold"><?= $totalPcs ?> Active Computers</span>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                    <thead class="bg-slate-950/60 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                        <tr>
                            <th class="p-4">PC NAME &amp; ID</th>
                            <th class="p-4">OFFICE LOCATION</th>
                            <th class="p-4">OS &amp; BUILD</th>
                            <th class="p-4">STATUS</th>
                            <th class="p-4">VERIFICATION</th>
                            <th class="p-4">DSC STATUS</th>
                            <th class="p-4">SUMMARY</th>
                            <th class="p-4">LAST SEEN</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-800/60">
                        <?php if (empty($consolidatedPcs)): ?>
                        <tr>
                            <td colspan="8" class="p-12 text-center text-slate-500 font-medium italic">
                                డమ్మి రిపోర్టులన్నీ తొలగించబడ్డాయి. కంప్యూటర్ నుండి కొత్త రిపోర్ట్ రాగానే ఇక్కడ ప్రత్యక్షమవుతుంది.
                            </td>
                        </tr>
                        <?php else: ?>
                        <?php foreach ($consolidatedPcs as $pc): ?>
                        <tr class="hover:bg-slate-800/40 transition">
                            <td class="p-4">
                                <div class="font-bold text-white font-mono"><?= htmlspecialchars($pc['pcName']) ?></div>
                                <div class="text-[10px] text-slate-500 font-mono"><?= htmlspecialchars($pc['machineId']) ?></div>
                            </td>
                            <td class="p-4 text-slate-300 font-medium max-w-xs"><?= htmlspecialchars($pc['officeLocation']) ?></td>
                            <td class="p-4 text-slate-400 font-mono text-[11px]"><?= htmlspecialchars($pc['os']) ?></td>
                            <td class="p-4 whitespace-nowrap">
                                <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase border bg-emerald-950 text-emerald-300 border-emerald-800">
                                    <?= htmlspecialchars($pc['overallStatus']) ?>
                                </span>
                            </td>
                            <td class="p-4 font-mono font-bold text-indigo-300"><?= htmlspecialchars($pc['stepsVerified']) ?></td>
                            <td class="p-4 text-slate-300"><?= htmlspecialchars($pc['dscStatus']) ?></td>
                            <td class="p-4 text-slate-400 italic max-w-sm"><?= htmlspecialchars($pc['lastSummary']) ?></td>
                            <td class="p-4 text-slate-400 font-mono text-[11px] whitespace-nowrap"><?= htmlspecialchars($pc['lastSeen']) ?></td>
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
