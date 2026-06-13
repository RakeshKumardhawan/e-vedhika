const fs = require('fs');
fs.writeFileSync('/tmp/test_cwd.txt', process.cwd());
