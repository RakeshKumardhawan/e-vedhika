import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

pattern = r'let tabClickCount = 0;\nconst triggerTabAd = \(\) => \{.*?^\};\n'
content = re.sub(pattern, '', content, flags=re.MULTILINE|re.DOTALL)

pattern2 = r'  useEffect\(\(\) => \{\n    if \(tabClickCount === 0\) \{\n      tabClickCount\+\+;\n      return;\n    \}\n    triggerTabAd\(\);\n  \}, \[currentTab\]\);\n'
content = re.sub(pattern2, '', content, flags=re.MULTILINE|re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(content)
