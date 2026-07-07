const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `            {activeSubTab === "logs" && (
              <SecurityLogsSection
                logsError={logsError}
                logs={logs}
                logSearchTerm={logSearchTerm}
                setLogSearchTerm={setLogSearchTerm}
              <SecurityLogsSection />`;

content = content.replace(target, `            {activeSubTab === "logs" && (
              <SecurityLogsSection />
            )}
            {/* Survey Reports (సర్వే రిపోర్ట్స్) */}
            {activeSubTab === "survey_reports" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">`);

fs.writeFileSync('src/App.tsx', content);
