const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('dist/index.html', 'utf8');

// The dist html is just a shell.
