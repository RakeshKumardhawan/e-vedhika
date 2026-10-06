<?php
// ====================================================================================
// E-VEDHIKA ULTIMATE HANDS-FREE TELEMETRY & DUAL-DELIVERY GATEWAY
// Path: public/api/telemetry/index.php
// Target URL: https://www.e-vedhika.in/admin/exe_ubd_live & https://www.e-vedhika.in/api/telemetry
// ====================================================================================

// CORS & Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$dataFile = __DIR__ . '/telemetry_storage.json';

// Handle clear query parameter
if ((isset($_GET['clear']) && $_GET['clear'] == '1') || $_SERVER['REQUEST_METHOD'] === 'DELETE') {
    if (file_exists($dataFile)) unlink($dataFile);
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        header('Content-Type: application/json');
        echo json_encode(["success" => true, "message" => "Telemetry logs cleared."]);
        exit;
    }
    header('Location: ' . strtok($_SERVER['REQUEST_URI'], '?'));
    exit;
}

// 1. HANDLE INCOMING POST TELEMETRY (From C# App or Node Server)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    if (!$data && !empty($_POST)) {
        $data = $_POST;
    }

    if ($data) {
        $logs = [];
        if (file_exists($dataFile)) {
            $jsonData = file_get_contents($dataFile);
            $logs = json_decode($jsonData, true) ?: [];
        }

        // Standardize timestamps & IDs
        $data['receivedAt'] = date('Y-m-d H:i:s');
        if (!isset($data['id'])) {
            $data['id'] = 'TEL-' . time() . '-' . rand(100, 999);
        }

        // Prepend new report to storage
        array_unshift($logs, $data);

        // Keep last 1000 records safely
        if (count($logs) > 1000) {
            $logs = array_slice($logs, 0, 1000);
        }

        file_put_contents($dataFile, json_encode($logs, JSON_PRETTY_PRINT));

        // 2. AUTOMATIC TELEGRAM DUAL-DISPATCH
        $botToken = "8822107822:AAG9TIOX1lnRXpUuKCbs7ppM3r1TPTnNYrE";
        $chatId = "431228008";

        $pcName = $data['pcName'] ?? $data['computerName'] ?? 'Unknown PC';
        $userName = $data['userName'] ?? $data['operatorName'] ?? 'Panchayat User';
        $location = $data['officeLocation'] ?? 'Telangana GP';
        $status = $data['status'] ?? 'SUCCESS';
        $os = $data['osVersion'] ?? 'Win11 Pro';
        $dsc = $data['dscStatus'] ?? 'Connected';

        $teleMsg = "🛡️ <b>E-VEDHIKA LIVE REPORT (v1.0.4)</b>\n" .
                   "💻 <b>PC:</b> " . htmlspecialchars($pcName) . "\n" .
                   "👤 <b>User:</b> " . htmlspecialchars($userName) . "\n" .
                   "📍 <b>Location:</b> " . htmlspecialchars($location) . "\n" .
                   "🪟 <b>OS:</b> " . htmlspecialchars($os) . "\n" .
                   "🔏 <b>DSC:</b> " . htmlspecialchars($dsc) . "\n" .
                   "📊 <b>Status:</b> <b>" . htmlspecialchars($status) . "</b>\n" .
                   "🚀 <i>Delivered to e-vedhika.in/admin/exe_ubd_live</i>";

        $telegramUrl = "https://api.telegram.org/bot{$botToken}/sendMessage?chat_id={$chatId}&parse_mode=HTML&text=" . urlencode($teleMsg);
        @file_get_contents($telegramUrl);

        // Respond to client
        header('Content-Type: application/json');
        echo json_encode([
            'success' => true, 
            'message' => 'Report stored and dispatched successfully!',
            'recordId' => $data['id'],
            'logs' => $logs
        ]);
        exit;
    }
}

// 3. FETCH STORED LOGS FOR DASHBOARD / API
$logs = [];
if (file_exists($dataFile)) {
    $jsonData = file_get_contents($dataFile);
    $logs = json_decode($jsonData, true) ?: [];
}

// Return JSON if requested as API
if (isset($_GET['format']) && $_GET['format'] === 'json' || (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false)) {
    header('Content-Type: application/json');
    echo json_encode(["success" => true, "count" => count($logs), "logs" => $logs]);
    exit;
}

$totalCount = count($logs);
$successCount = count(array_filter($logs, fn($l) => stripos($l['status'] ?? 'SUCCESS', 'SUCCESS') !== false));
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E-Vedhika Central Monitoring & Hands-Free Gateway</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;850&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style> body { font-family: 'Inter', sans-serif; } .font-mono { font-family: 'JetBrains Mono', monospace; } </style>
    <meta http-equiv="refresh" content="10"> <!-- Auto refresh every 10 seconds -->
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-4 md:p-8">
    <div class="max-w-7xl mx-auto space-y-6">
        
        <!-- Header -->
        <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-3xl border border-slate-800 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="flex items-center gap-4">
                <div class="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-400/30 text-indigo-400 shadow-inner">
                    <svg class="w-8 h-8 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <div>
                    <h1 class="text-2xl font-black tracking-tight text-white">E-Vedhika Hands-Free Live Gateway</h1>
                    <p class="text-xs text-indigo-300 font-mono">https://www.e-vedhika.in/admin/exe_ubd_live</p>
                </div>
            </div>
            <div class="flex items-center gap-3">
                <span class="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 text-xs font-mono">
                    ● Live Dual-Delivery Active
                </span>
                <a href="?clear=1" onclick="return confirm('Are you sure you want to clear all logs?')" class="px-4 py-2 bg-rose-600 hover:bg-rose-500 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95">Clear All Logs</a>
            </div>
        </div>

        <!-- Metrics Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div class="bg-slate-900/80 p-5 rounded-3xl border border-slate-800 shadow-xl backdrop-blur-md">
                <div class="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Total Reports</div>
                <div class="text-4xl font-black text-white"><?php echo $totalCount; ?></div>
            </div>
            <div class="bg-slate-900/80 p-5 rounded-3xl border border-slate-800 shadow-xl backdrop-blur-md">
                <div class="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1">Successful Runs</div>
                <div class="text-4xl font-black text-white"><?php echo $successCount; ?></div>
            </div>
            <div class="bg-slate-900/80 p-5 rounded-3xl border border-slate-800 shadow-xl backdrop-blur-md">
                <div class="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-1">Health Index</div>
                <div class="text-4xl font-black text-white"><?php echo $totalCount > 0 ? round(($successCount / $totalCount) * 100) : 100; ?>%</div>
            </div>
        </div>

        <!-- Master Telemetry Table -->
        <div class="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
            <div class="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
                <h3 class="text-xs font-black uppercase tracking-widest text-slate-400">Incoming Computer Telemetry Logs</h3>
                <span class="text-[10px] text-slate-500 font-mono">Auto-refreshes every 10 seconds</span>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs font-mono border-collapse">
                    <thead>
                        <tr class="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                            <th class="p-4">Sl.No</th>
                            <th class="p-4">PC ID / Unique Key</th>
                            <th class="p-4">Timestamp</th>
                            <th class="p-4">Computer & Operator</th>
                            <th class="p-4">Office Location</th>
                            <th class="p-4">OS Version</th>
                            <th class="p-4">DSC Status</th>
                            <th class="p-4">Verification</th>
                            <th class="p-4">Status</th>
                            <th class="p-4 text-center">Payload</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-800/60">
                        <?php if (empty($logs)): ?>
                        <tr>
                            <td colspan="10" class="p-20 text-center text-slate-500 italic">
                                ఎ ఎలాంటి రిపోర్టులు ఇంకా రాలేదు. సాఫ్ట్వేర్ ఇన్స్టాల్ చేయగానే ఇక్కడ కనిపిస్తాయి.
                            </td>
                        </tr>
                        <?php else: ?>
                            <?php foreach ($logs as $i => $log): ?>
                            <tr class="hover:bg-slate-800/40 transition-colors">
                                <td class="p-4 font-bold text-slate-400"><?php echo $i + 1; ?></td>
                                <td class="p-4">
                                    <span class="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg font-bold border border-indigo-500/30">
                                        <?php echo htmlspecialchars($log['pcId'] ?? $log['pcName'] ?? 'EVD-PC'); ?>
                                    </span>
                                </td>
                                <td class="p-4 text-slate-400 whitespace-nowrap"><?php echo htmlspecialchars($log['receivedAt'] ?? ($log['date'] . ' ' . $log['time'])); ?></td>
                                <td class="p-4">
                                    <div class="font-bold text-white"><?php echo htmlspecialchars($log['pcName'] ?? 'PC'); ?></div>
                                    <div class="text-[10px] text-slate-400"><?php echo htmlspecialchars($log['userName'] ?? 'User'); ?></div>
                                </td>
                                <td class="p-4 text-slate-300"><?php echo htmlspecialchars($log['officeLocation'] ?? 'Telangana GP'); ?></td>
                                <td class="p-4 text-slate-400"><?php echo htmlspecialchars($log['osVersion'] ?? 'Win11 Pro'); ?></td>
                                <td class="p-4 text-emerald-400 font-bold"><?php echo htmlspecialchars($log['dscStatus'] ?? 'Connected'); ?></td>
                                <td class="p-4 text-cyan-400 font-bold"><?php echo htmlspecialchars($log['verification'] ?? 'Passed (15/15)'); ?></td>
                                <td class="p-4">
                                    <span class="px-3 py-1 bg-emerald-500 text-slate-950 font-black rounded-xl text-[10px]">
                                        <?php echo htmlspecialchars($log['status'] ?? 'SUCCESS'); ?>
                                    </span>
                                </td>
                                <td class="p-4 text-center">
                                    <button onclick="alert(<?php echo htmlspecialchars(json_encode(json_encode($log, JSON_PRETTY_PRINT))); ?>)" class="px-3 py-1.5 bg-slate-800 hover:bg-indigo-600 text-white rounded-lg text-[10px] font-bold transition-all">VIEW JSON</button>
                                </td>
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
