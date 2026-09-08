const fs = require('fs');
const file = 'src/components/ComplaintFormModal.tsx';
let code = fs.readFileSync(file, 'utf8');

const stateTarget = `const [fileName, setFileName] = useState("");`;
const stateNew = `const [fileName, setFileName] = useState("");
  const [successTicketId, setSuccessTicketId] = useState<string | null>(null);`;

if (code.includes(stateTarget)) {
  code = code.replace(stateTarget, stateNew);
} else {
  console.log("State target not found");
}

const submitTarget = `        confirmButtonColor: '#005bb5'
      });

      if (addToast) {
        addToast("టికెట్ విజయవంతంగా సమర్పించబడింది.");
      }

      onClose();`;
const submitNew = `        confirmButtonColor: '#005bb5'
      });

      if (addToast) {
        addToast("టికెట్ విజయవంతంగా సమర్పించబడింది.");
      }

      setSuccessTicketId(ticketRef.id.substring(0, 8).toUpperCase());`;

if (code.includes(submitTarget)) {
  code = code.replace(submitTarget, submitNew);
} else {
  console.log("Submit target not found");
}

const jsxTarget = `        <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8 space-y-6">`;
const jsxNew = `        {successTicketId ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">విజయవంతంగా సమర్పించబడింది! (Submitted Successfully!)</h3>
            <p className="text-slate-600 text-[15px] max-w-md">
              మీ సమస్య/విజ్ఞప్తి మా బృందానికి చేరింది. దయచేసి భవిష్యత్తు సూచన కోసం మీ టికెట్ నంబరును సేవ్ చేసుకోండి.
            </p>
            <div className="bg-white border-2 border-dashed border-slate-300 px-6 py-4 rounded-lg">
              <p className="text-slate-500 text-[13px] font-medium mb-1 uppercase tracking-wider">Ticket Reference Number</p>
              <p className="text-3xl font-black text-[#005bb5]">#{successTicketId}</p>
            </div>
            <button
              onClick={onClose}
              className="mt-4 bg-[#005bb5] hover:bg-[#004a94] text-white px-8 py-2.5 rounded text-[14px] font-bold shadow-md transition-all hover:shadow-lg"
            >
              Close Window
            </button>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8 space-y-6">`;

if (code.includes(jsxTarget)) {
  code = code.replace(jsxTarget, jsxNew);
} else {
  console.log("JSX target not found");
}

const jsxEndTarget = `        </form>
      </div>
    </div>`;
const jsxEndNew = `        </form>
        )}
      </div>
    </div>`;

if (code.includes(jsxEndTarget)) {
  code = code.replace(jsxEndTarget, jsxEndNew);
} else {
  console.log("JSX end target not found");
}

fs.writeFileSync(file, code);
console.log("ComplaintFormModal patched successfully!");
