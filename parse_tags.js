const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf-8');
const lines = content.split('\n');

let stack = [];
for (let i = 6820; i < 7000; i++) {
    const line = lines[i];
    if (line) {
        let divOpenMatch = line.match(/<div[^>]*>/g);
        let divCloseMatch = line.match(/<\/div>/g);
        if (divOpenMatch) {
            for (let j=0; j<divOpenMatch.length; j++) stack.push({tag: 'div', line: i+1});
        }
        if (divCloseMatch) {
            for (let j=0; j<divCloseMatch.length; j++) {
                if (stack[stack.length-1].tag === 'div') {
                    stack.pop();
                } else {
                    console.log('Mismatched close at ' + (i+1));
                }
            }
        }
    }
}
console.log('Unclosed tags:', stack);
