const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const targetStr = `{title && (
                <div className="text-[13px] text-[#646970] flex items-center gap-1 flex-wrap">
                  <strong>Permalink:</strong>
                  <span className="text-[#2271b1] underline truncate max-w-[300px] sm:max-w-md">
                    https://evedhika.in/{title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                  </span>
                </div>
              )}`;

const newStr = `{title && (
                <div className="text-[13px] text-[#646970] flex items-center gap-1 flex-wrap">
                  <strong>Permalink:</strong>
                  {isEditingSlug ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[#646970]">https://evedhika.in/</span>
                      <input 
                        type="text" 
                        value={customSlug}
                        onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/\\s+/g, '-'))}
                        placeholder={derivedSlug}
                        className="border border-[#8c8f94] px-1 py-0.5 text-[13px] outline-none focus:border-[#2271b1] focus:shadow-[0_0_0_1px_#2271b1] text-black w-[200px]"
                      />
                      <button type="button" onClick={() => {
                        if (!customSlug.trim()) { setCustomSlug(derivedSlug); }
                        setIsEditingSlug(false);
                      }} className="border border-[#8c8f94] bg-[#f6f7f7] px-2 py-0.5 rounded-[3px] text-[12px] hover:bg-[#f0f0f1] text-[#3c434a]">OK</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-[#2271b1] underline truncate max-w-[300px] sm:max-w-md">
                        https://evedhika.in/{displaySlug}
                      </span>
                      <button type="button" onClick={() => {
                        if (!customSlug) { setCustomSlug(derivedSlug); }
                        setIsEditingSlug(true);
                      }} className="border border-[#8c8f94] bg-[#f6f7f7] px-2 py-0.5 rounded-[3px] text-[12px] hover:bg-[#f0f0f1] text-[#3c434a]">Edit</button>
                    </div>
                  )}
                </div>
              )}`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, newStr);
  fs.writeFileSync(file, code);
  console.log('Success');
} else {
  console.log('Target not found!');
}
