#!/bin/bash
sed -i 's/className="text-center relative z-10"/className="text-center relative z-10 w-full max-w-sm p-8 bg-slate-900\/60 rounded-\[40px\] border border-slate-800 backdrop-blur-md"/g' src/App.tsx
