#!/bin/bash
sed -i 's/|const attToDownload = getLatestAttachment(post.attachments) | if (!attToDownload) return;/const attToDownload = getLatestAttachment(post.attachments); if (!attToDownload) return;/g' src/App.tsx
