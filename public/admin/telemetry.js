// E-Vedhika Client Report Receiver (Server Proxy & Telegram Relayed)
async function receiveReport(reportData) {
    console.log("రిపోర్ట్ వచ్చింది:", reportData);
    
    try {
        // Send to e-Vedhika Central Telemetry Gateway API
        const response = await fetch('/api/telemetry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reportData)
        });
        
        const result = await response.json();
        console.log("టెలిమెట్రీ రిపోర్ట్ సర్వర్‌లో లాగ్ చేయబడింది:", result);
        return result;
    } catch (err) {
        console.error("Telemetry report relay error:", err);
        
        // Fallback direct test alert
        try {
            await fetch('/api/telemetry/test-telegram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: `🛡️ <b>E-VEDHIKA REPORT (CLIENT)</b>\n` +
                             `🏢 ఆఫీస్: ${reportData.officeLocation || 'GP Office'}\n` +
                             `💻 పీసీ: ${reportData.pcName || 'PC'}\n` +
                             `📊 స్టేటస్: ${reportData.status || 'SUCCESS'}\n` +
                             `📝 వివరాలు: ${reportData.remarks || 'Report completed'}`
                })
            });
        } catch (e) {
            console.error("Fallback telegram error:", e);
        }
    }
}
