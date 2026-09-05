import React, { useState } from 'react';
import { Sparkles, FileText, Code, CheckCircle, Copy } from 'lucide-react';
import Markdown from 'react-markdown';

export function AIContentCopilot() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    
    // Simulate AI generation delay
    setTimeout(() => {
      setGeneratedContent(`## \${prompt}

Here is the auto-generated tech article and explanation you requested.

### Overview
This concept is highly crucial for modern web development, allowing developers to build robust and scalable systems. The architecture supports real-time data flow and high-performance metrics.

### Implementation Example

\`\`\`javascript
// Auto-generated implementation by E-Vedhika AI Copilot
function initializeSystem(config) {
  console.log("System initialized with config:", config);
  return {
    status: "Active",
    timestamp: new Date().toISOString()
  };
}

const sys = initializeSystem({ debug: true, maxThreads: 4 });
\`\`\`

### Summary
By following these best practices, you can ensure your platform remains highly available and secure from external vulnerabilities.
`);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-xs h-full flex flex-col">
      <div className="mb-6">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <Sparkles size={20} className="text-purple-600" /> AI Content & Code Auto-Generator
        </h3>
        <p className="text-xs text-slate-500 font-medium mt-1">Generate complete tech articles, explanations, and syntax-highlighted code blocks instantly.</p>
      </div>

      <div className="flex gap-3 mb-6">
        <input 
          type="text" 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="E.g., Write an article about React Server Components..."
          className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button 
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-black transition-all shadow-md flex items-center gap-2 disabled:opacity-50 shrink-0"
        >
          {isGenerating ? (
            <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Generating...</>
          ) : (
            <><Sparkles size={16} /> Generate Article</>
          )}
        </button>
      </div>

      <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-6 overflow-y-auto relative">
        {!generatedContent && !isGenerating && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3">
            <FileText size={48} className="opacity-20" />
            <p className="text-sm font-bold">Your AI-generated content will appear here.</p>
          </div>
        )}
        
        {isGenerating && (
           <div className="h-full flex flex-col items-center justify-center text-purple-500 space-y-4">
             <div className="flex gap-2">
               <span className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></span>
               <span className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
               <span className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
             </div>
             <p className="text-sm font-bold animate-pulse">Consulting AI Models...</p>
           </div>
        )}

        {generatedContent && !isGenerating && (
          <div className="markdown-body text-sm text-slate-700">
            <div className="absolute top-4 right-4 flex gap-2">
              <button className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 transition-colors tooltip-trigger" title="Copy Content">
                <Copy size={16} />
              </button>
              <button className="px-3 py-1.5 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold hover:bg-emerald-200 transition-colors flex items-center gap-1">
                <CheckCircle size={14} /> Publish to Portal
              </button>
            </div>
            <Markdown>{generatedContent}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
}
