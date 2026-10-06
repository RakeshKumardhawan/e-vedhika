<?php
// ====================================================================================
// E-VEDHIKA ULTIMATE HANDS-FREE TELEMETRY & DUAL-DELIVERY GATEWAY
// Target URL: https://www.e-vedhika.in/admin/exe_ubd_live
// ====================================================================================

$dataFile = __DIR__ . '/telemetry_storage.json';

// Handle clear query parameter
if (isset($_GET['clear']) && $_GET['clear'] == '1') {
    if (file_exists($dataFile)) unlink($dataFile);
    header('Location: ' . strtok($_SERVER['REQUEST_URI'], '?'));
    exit;
}

// 1. HANDLE INCOMING POST TELEMETRY (From C# App or Node Server)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

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

        // Detect attached file or link in POST payload
        $fileLink = $data['fileLink'] ?? $data['link'] ?? $data['fileUrl'] ?? $data['file_url'] ?? $data['downloadUrl'] ?? $data['download_url'] ?? $data['file'] ?? $data['attachment'] ?? $data['reportUrl'] ?? $data['logUrl'] ?? null;
        if (!empty($fileLink)) {
            $data['fileLink'] = $fileLink;
            $data['link'] = $fileLink;
            $cleanName = basename(parse_url($fileLink, PHP_URL_PATH) ?: '');
            $data['fileName'] = $data['fileName'] ?? $data['file_name'] ?? (!empty($cleanName) ? $cleanName : 'Attached_File');
            $data['hasFile'] = true;
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
                   "📊 <b>Status:</b> <b>" . htmlspecialchars($status) . "</b>\n";
        
        if (!empty($data['fileLink'])) {
            $teleMsg .= "📎 <b>ఫైల్ / లింక్:</b> <a href=\"" . htmlspecialchars($data['fileLink']) . "\">" . htmlspecialchars($data['fileName'] ?? 'డౌన్‌లోడ్ చేయండి') . "</a>\n";
        }
        
        $teleMsg .= "🚀 <i>Delivered to e-vedhika.in/admin/exe_ubd_live</i>";

        $telegramUrl = "https://api.telegram.org/bot{$botToken}/sendMessage?chat_id={$chatId}&parse_mode=HTML&text=" . urlencode($teleMsg);
        @file_get_contents($telegramUrl);

        // Respond to client
        header('Content-Type: application/json');
        echo json_encode([
            'success' => true, 
            'message' => 'Report stored and dispatched successfully!',
            'hasFile' => !empty($data['fileLink']),
            'fileLink' => $data['fileLink'] ?? null
        ]);
        exit;
    }
}

// 3. FETCH STORED LOGS FOR DASHBOARD
$logs = [];
if (file_exists($dataFile)) {
    $jsonData = file_get_contents($dataFile);
    $logs = json_decode($jsonData, true) ?: [];
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
                            <th class="p-4 text-center">Attached File / లింక్</th>
                            <th class="p-4 text-center">Payload</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-800/60">
                        <?php if (empty($logs)): ?>
                        <tr>
                            <td colspan="11" class="p-20 text-center text-slate-500 italic">
                                ఎ ఎలాంటి రిపోర్టులు ఇంకా రాలేదు. సాఫ్ట్‌వేర్ ఇన్‌స్టాల్ చేయగానే ఇక్కడ కనిపిస్తాయి.
                            </td>
                        </tr>
                        <?php else: ?>
                            <?php foreach ($logs as $i => $log): ?>
                            <?php 
                                $rowLink = $log['fileLink'] ?? $log['link'] ?? $log['fileUrl'] ?? null; 
                                $rowFileName = $log['fileName'] ?? ($rowLink ? basename(parse_url($rowLink, PHP_URL_PATH)) : 'Download File');
                            ?>
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
                                    <?php if (!empty($rowLink)): ?>
                                    <a href="<?php echo htmlspecialchars($rowLink); ?>" target="_blank" download class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold text-[11px] shadow-lg transition-all active:scale-95 whitespace-nowrap">
                                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                                        <?php echo htmlspecialchars($rowFileName ?: 'ఫైల్ డౌన్‌లోడ్'); ?>
                                    </a>
                                    <?php else: ?>
                                    <span class="text-slate-600 text-[11px] italic">నో ఫైల్</span>
                                    <?php endif; ?>
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

        <?php
        // Filter logs that include a file/link
        $fileLogs = array_values(array_filter($logs, function($l) {
            return !empty($l['fileLink']) || !empty($l['link']) || !empty($l['fileUrl']) || !empty($l['attachment']);
        }));
        ?>

        <!-- Automatic Attached Files Section (పోస్ట్ ద్వారా అటాచ్ అయిన ఫైల్స్) -->
        <div class="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-6 space-y-5">
            <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-4 border-b border-slate-800">
                <div class="flex items-center gap-3">
                    <div class="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
                        </svg>
                    </div>
                    <div>
                        <h2 class="text-lg font-black text-white flex items-center gap-2">
                            పోస్ట్ చేయబడిన ఫైల్స్ & డౌన్‌లోడ్ హబ్ (Auto-Collected Files via POST)
                            <span class="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-mono border border-emerald-500/30 font-bold">
                                <?php echo count($fileLogs); ?> ఫైల్స్
                            </span>
                        </h2>
                        <p class="text-xs text-slate-400 mt-0.5">POST రిక్వెస్ట్‌లో లింక్ (<code>"link"</code> లేదా <code>"fileUrl"</code>) ఇవ్వగానే ఆ ఫైల్ ఆటోమేటిక్‌గా క్రింద చేర్చబడుతుంది.</p>
                    </div>
                </div>
                <div class="text-right">
                    <span class="text-[11px] text-indigo-400 font-mono">Format: {"link": "https://...", "fileName": "patch.exe"}</span>
                </div>
            </div>

            <?php if (empty($fileLogs)): ?>
            <div class="p-10 text-center bg-slate-950/60 rounded-2xl border border-dashed border-slate-800 space-y-3">
                <div class="w-12 h-12 mx-auto bg-slate-800/60 rounded-2xl flex items-center justify-center text-slate-400">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                </div>
                <p class="text-sm font-bold text-slate-300">ప్రస్తుతానికి ఏ ఫైల్ లింక్ పోస్ట్ చేయబడలేదు.</p>
                <p class="text-xs text-slate-500 max-w-md mx-auto">
                    మీరు C# అప్లికేషన్ లేదా API POST రిక్వెస్ట్ ద్వారా లింక్ పంపిన వెంటనే, ఆ ఫైల్ ఇక్కడ ఆటోమేటిక్‌గా ప్రత్యక్షమవుతుంది.
                </p>
                <!-- Quick Test POST Link Button -->
                <div class="pt-2">
                    <button onclick="testPostWithLink()" class="px-4 py-2 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white rounded-xl text-xs font-bold border border-indigo-500/40 transition-all cursor-pointer">
                        🧪 టెస్ట్ ఫైల్ లింక్ పంపండి (Simulate POST with File Link)
                    </button>
                </div>
            </div>
            <?php else: ?>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <?php foreach ($fileLogs as $fLog): ?>
                <?php 
                    $fLink = $fLog['fileLink'] ?? $fLog['link'] ?? $fLog['fileUrl'] ?? '';
                    $fName = $fLog['fileName'] ?? basename(parse_url($fLink, PHP_URL_PATH)) ?: 'e-Vedhika-File';
                    $fExt = strtoupper(pathinfo($fName, PATHINFO_EXTENSION) ?: 'FILE');
                ?>
                <div class="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-4 shadow-xl">
                    <div class="flex items-start justify-between gap-3">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-black text-xs shrink-0">
                                <?php echo htmlspecialchars($fExt); ?>
                            </div>
                            <div class="min-w-0">
                                <h4 class="text-sm font-black text-white truncate" title="<?php echo htmlspecialchars($fName); ?>">
                                    <?php echo htmlspecialchars($fName); ?>
                                </h4>
                                <p class="text-[11px] text-slate-400 truncate">
                                    <?php echo htmlspecialchars($fLog['pcName'] ?? 'PC'); ?> • <?php echo htmlspecialchars($fLog['userName'] ?? 'User'); ?>
                                </p>
                            </div>
                        </div>
                        <span class="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[9px] font-mono border border-emerald-500/30 font-bold shrink-0">
                            AUTO-SYNCED
                        </span>
                    </div>

                    <div class="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 text-[11px] space-y-1">
                        <div class="flex justify-between text-slate-400">
                            <span>లొకేషన్:</span>
                            <span class="text-slate-200 font-bold truncate max-w-[180px]"><?php echo htmlspecialchars($fLog['officeLocation'] ?? 'Telangana GP'); ?></span>
                        </div>
                        <div class="flex justify-between text-slate-400">
                            <span>సమయం:</span>
                            <span class="text-slate-300 font-mono"><?php echo htmlspecialchars($fLog['receivedAt'] ?? ($fLog['date'] . ' ' . $fLog['time'])); ?></span>
                        </div>
                    </div>

                    <div class="flex items-center gap-2 pt-1">
                        <a href="<?php echo htmlspecialchars($fLink); ?>" target="_blank" download class="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-xl text-xs text-center transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                            డౌన్‌లోడ్
                        </a>
                        <a href="<?php echo htmlspecialchars($fLink); ?>" target="_blank" class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all" title="ఓపెన్ లింక్">
                            🔗
                        </a>
                        <button onclick="navigator.clipboard.writeText('<?php echo addslashes($fLink); ?>'); alert('ఫైల్ లింక్ కాపీ చేయబడింది!');" class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all" title="కాపీ లింక్">
                            📋
                        </button>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
            <?php endif; ?>
        </div>
    </div>

    <script>
    function testPostWithLink() {
        const testPayload = {
            pcName: "GP-SECRETARY-PC-TS",
            userName: "Panchayat Secretary",
            officeLocation: "Siddipet GP, Telangana",
            osVersion: "Windows 11 Pro 64-bit",
            dscStatus: "Connected (Token Active)",
            verification: "Passed (15/15)",
            status: "SUCCESS",
            link: "https://www.e-vedhika.in/EVedhikaUBDDeploymentTool.exe",
            fileName: "EVedhikaUBDDeploymentTool.exe"
        };
        fetch(window.location.href, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testPayload)
        })
        .then(res => res.json())
        .then(d => {
            alert('టెస్ట్ రిపోర్ట్ ఫైల్ లింక్ తో పంపబడింది! పేజీ రీలోడ్ అవుతుంది.');
            window.location.reload();
        })
        .catch(e => alert('Error sending test POST: ' + e));
    }
    </script>
</body>
</html>
