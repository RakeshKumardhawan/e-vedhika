<?php
// ====================================================================
// e-Vedhika: Central Cloud OTA Auto-Update Gateway (PHP)
// Hostinger / cPanel / Apache Deployment
// Path: public_html/api/version/index.php
// ====================================================================

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$dataFile = __DIR__ . '/ota_version.json';

// డీఫాల్ట్ OTA వెర్షన్ కాన్ఫిగ్
$defaultConfig = [
    "success" => true,
    "status" => "ok",
    "name" => "E-VEDHIKA All Problems One Solution & UBD Deployment Tool",
    "portal" => "e-vedhika.in",
    "latestVersion" => "v1.6.3 Enterprise",
    "versionCode" => 163, // పాత కోడ్ 162 కంటే ఎక్కువ సంఖ్య ఉండాలి
    "downloadUrl" => "https://www.e-vedhika.in/EVedhikaUBDDeploymentTool.exe",
    "releaseNotes" => "కొత్త డ్రైవర్లు మరియు స్పీడ్ ఇంప్రూవ్మెంట్స్ యాడ్ చేయబడ్డాయి.",
    "updatedAt" => date('Y-m-d H:i:s')
];

// POST రిక్వెస్ట్: వెబ్‌సైట్ డాష్‌బోర్డ్ నుండి వెర్షన్ అప్‌డేట్ చేయడం
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $body = json_decode($input, true) ?: $_POST;
    
    $current = [];
    if (file_exists($dataFile)) {
        $current = json_decode(file_get_contents($dataFile), true) ?: [];
    }
    
    $updated = array_merge($defaultConfig, $current, is_array($body) ? $body : [], [
        "success" => true,
        "updatedAt" => date('Y-m-d H:i:s')
    ]);
    if (isset($updated['versionCode'])) {
        $updated['versionCode'] = (int)$updated['versionCode'];
    }
    
    file_put_contents($dataFile, json_encode($updated, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    echo json_encode([
        "success" => true,
        "message" => "OTA Version updated successfully!",
        "otaVersionConfig" => $updated
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit();
}

// GET రిక్వెస్ట్: C# టూల్ వెర్షన్ వివరాలను పొందడం
if (file_exists($dataFile)) {
    $content = file_get_contents($dataFile);
    $data = json_decode($content, true);
    if ($data && is_array($data)) {
        echo json_encode(array_merge(["success" => true], $data), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        exit();
    }
}

echo json_encode($defaultConfig, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>
