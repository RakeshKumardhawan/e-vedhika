import React, { useState } from "react";

const THEMES = [
  "Theme 1 - Poverty Free and Enhanced Livelihoods Village",
  "Theme 2 - Healthy Village",
  "Theme 3 - Child Friendly Village",
  "Theme 4 - Water Sufficient Village",
  "Theme 5 - Clean and Green Village",
  "Theme 6 - Self-sufficient Infrastructure in Village",
  "Theme 7 - Socially Just and Socially Secured Village",
  "Theme 8 - Village with Good Governance",
  "Theme 9 - Women Friendly Village"
];

export default function GPDPSetup() {
  const [gpName, setGpName] = useState("");
  const [sankalpTheme1, setSankalpTheme1] = useState(THEMES[3]); // Default to Theme 4
  const [sankalpTheme2, setSankalpTheme2] = useState(THEMES[4]); // Default to Theme 5

  const [funds, setFunds] = useState({
    ownFund: 100,
    sfc: 100,
    tiedGrant: 100,
    untiedGrant: 100
  });

  const handleFundChange = (key: keyof typeof funds, val: string) => {
    const num = parseFloat(val);
    setFunds(prev => ({ ...prev, [key]: isNaN(num) ? 0 : num }));
  };

  return (
    <div className="p-4 w-full bg-white text-sm text-black" style={{ fontFamily: "Arial, sans-serif" }}>
      <h1 className="text-2xl font-bold text-green-900 underline mb-4">GPDP Initial Setup</h1>
      
      <div className="mb-6 overflow-x-auto">
        <table className="border-collapse border border-black w-full max-w-lg mb-6">
          <tbody>
            <tr>
              <td className="border border-black p-1 font-bold bg-gray-50 w-1/3">Gram Panchayat Name</td>
              <td className="border border-black p-0">
                <input 
                  type="text" 
                  value={gpName} 
                  onChange={(e) => setGpName(e.target.value)} 
                  className="w-full h-full p-1 outline-none"
                />
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold bg-gray-50">Sankalp Theme 1</td>
              <td className="border border-black p-0">
                <select 
                  value={sankalpTheme1} 
                  onChange={(e) => setSankalpTheme1(e.target.value)}
                  className="w-full h-full p-1 outline-none"
                >
                  <option value="">Select Theme</option>
                  {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold bg-gray-50">Sankalp Theme 2</td>
              <td className="border border-black p-0">
                <select 
                  value={sankalpTheme2} 
                  onChange={(e) => setSankalpTheme2(e.target.value)}
                  className="w-full h-full p-1 outline-none"
                >
                  <option value="">Select Theme</option>
                  {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </td>
            </tr>
          </tbody>
        </table>

        <table className="border-collapse border border-black w-full mb-6">
          <thead>
            <tr className="bg-gray-100 text-center font-bold text-xs">
              <th className="border border-black p-1"></th>
              <th className="border border-black p-1">Fund</th>
              <th className="border border-black p-1">Sankalp Theme Cut (25%)</th>
              <th className="border border-black p-1">Drinking Water (50%)</th>
              <th className="border border-black p-1">Sanitation (50%)</th>
              <th className="border border-black p-1">Balance (75%)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-1 font-bold bg-gray-50">Own Fund</td>
              <td className="border border-black p-0"><input type="number" value={funds.ownFund || ""} onChange={(e) => handleFundChange('ownFund', e.target.value)} className="w-full h-full p-1 text-center outline-none" /></td>
              <td className="border border-black p-1 text-center bg-gray-50">{(funds.ownFund * 0.25).toFixed(2)}</td>
              <td className="border border-black p-1 text-center bg-gray-50"></td>
              <td className="border border-black p-1 text-center bg-gray-50"></td>
              <td className="border border-black p-1 text-center bg-blue-100 text-blue-900">{(funds.ownFund * 0.75).toFixed(2)}</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold bg-gray-50">SFC</td>
              <td className="border border-black p-0"><input type="number" value={funds.sfc || ""} onChange={(e) => handleFundChange('sfc', e.target.value)} className="w-full h-full p-1 text-center outline-none" /></td>
              <td className="border border-black p-1 text-center bg-gray-50">{(funds.sfc * 0.25).toFixed(2)}</td>
              <td className="border border-black p-1 text-center bg-gray-50"></td>
              <td className="border border-black p-1 text-center bg-gray-50"></td>
              <td className="border border-black p-1 text-center bg-blue-100 text-blue-900">{(funds.sfc * 0.75).toFixed(2)}</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold bg-gray-50">Tied Grant</td>
              <td className="border border-black p-0"><input type="number" value={funds.tiedGrant || ""} onChange={(e) => handleFundChange('tiedGrant', e.target.value)} className="w-full h-full p-1 text-center outline-none" /></td>
              <td className="border border-black p-1 text-center bg-gray-50"></td>
              <td className="border border-black p-1 text-center bg-gray-50">{(funds.tiedGrant * 0.50).toFixed(2)}</td>
              <td className="border border-black p-1 text-center bg-gray-50">{(funds.tiedGrant * 0.50).toFixed(2)}</td>
              <td className="border border-black p-1 text-center bg-blue-100 text-blue-900">{(funds.tiedGrant * 1.00).toFixed(2)}</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold bg-gray-50">Untied Grant</td>
              <td className="border border-black p-0"><input type="number" value={funds.untiedGrant || ""} onChange={(e) => handleFundChange('untiedGrant', e.target.value)} className="w-full h-full p-1 text-center outline-none" /></td>
              <td className="border border-black p-1 text-center bg-gray-50">{(funds.untiedGrant * 0.25).toFixed(2)}</td>
              <td className="border border-black p-1 text-center bg-gray-50"></td>
              <td className="border border-black p-1 text-center bg-gray-50"></td>
              <td className="border border-black p-1 text-center bg-blue-100 text-blue-900">{(funds.untiedGrant * 0.75).toFixed(2)}</td>
            </tr>
            <tr className="bg-green-200 font-bold">
              <td colSpan={6} className="border border-black p-1">Total Available Funds</td>
            </tr>
          </tbody>
        </table>

        {/* Third Table */}
        <table className="border-collapse border border-black w-full mb-6">
          <thead>
            <tr className="bg-gray-100 text-center font-bold text-xs">
              <th className="border border-black p-1 w-10">S.No.</th>
              <th className="border border-black p-1 w-64">Theme Name</th>
              <th className="border border-black p-1">Activity Name</th>
              <th className="border border-black p-1 w-32">Grant Type</th>
              <th className="border border-black p-1 w-32">Amount</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={`t4-${i}`}>
                <td className="border border-black p-1 text-center">{i + 1}</td>
                <td className="border border-black p-1">{THEMES[3]}</td>
                <td className="border border-black p-1"><input type="text" className="w-full outline-none" /></td>
                <td className="border border-black p-1 text-center">Tied</td>
                <td className="border border-black p-1"><input type="number" className="w-full outline-none text-right" /></td>
              </tr>
            ))}
            {[...Array(5)].map((_, i) => (
              <tr key={`t5-${i}`}>
                <td className="border border-black p-1 text-center">{i + 1}</td>
                <td className="border border-black p-1">{THEMES[4]}</td>
                <td className="border border-black p-1"><input type="text" className="w-full outline-none" /></td>
                <td className="border border-black p-1 text-center">Tied</td>
                <td className="border border-black p-1"><input type="number" className="w-full outline-none text-right" /></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Sankalp Theme Table */}
        <table className="border-collapse border border-black w-full mb-6">
          <thead>
            <tr>
              <th colSpan={6} className="border border-black p-2 bg-blue-100 text-lg font-bold text-center">
                Sanklap Theme
              </th>
            </tr>
            <tr>
              <td colSpan={6} className="border border-black p-1 bg-gray-50 text-xs">
                <div>{THEMES[3]} లో ఇంకా 8 ఆక్టివిటీలు మీరు తీసుకోవాలి</div>
                <div>{THEMES[4]} లో ఇంకా 18 ఆక్టివిటీలు మీరు తీసుకోవాలి</div>
                <div>మొత్తం ఆక్టివిటీలు: 26</div>
              </td>
            </tr>
            <tr className="bg-gray-100 font-bold text-xs">
              <td colSpan={2} className="border border-black p-1">Own Fund 25 % ===&gt;</td>
              <td colSpan={2} className="border border-black p-1">SFC 25% ===&gt;</td>
              <td colSpan={2} className="border border-black p-1">Untied Grant 25 % ===&gt;</td>
            </tr>
            <tr className="bg-gray-100 text-center font-bold text-xs">
              <th className="border border-black p-1 w-10">S.No.</th>
              <th className="border border-black p-1 w-64">Theme Name</th>
              <th className="border border-black p-1">Activity Name for Sankalp</th>
              <th className="border border-black p-1 w-32">Work Type</th>
              <th className="border border-black p-1 w-32 text-[10px] leading-tight">Grant Type<br/>OWN<br/>SFC<br/>FFC</th>
              <th className="border border-black p-1 w-32">Balance</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(8)].map((_, i) => (
              <tr key={`st4-${i}`}>
                <td className="border border-black p-1 text-center">{i + 1}</td>
                <td className="border border-black p-1 text-xs">{THEMES[3]}</td>
                <td className="border border-black p-1"><input type="text" className="w-full outline-none" /></td>
                <td className="border border-black p-1"><input type="text" className="w-full outline-none" /></td>
                <td className="border border-black p-1"><input type="text" className="w-full outline-none" /></td>
                <td className="border border-black p-1"><input type="number" className="w-full outline-none text-right" /></td>
              </tr>
            ))}
            {[...Array(18)].map((_, i) => (
              <tr key={`st5-${i}`}>
                <td className="border border-black p-1 text-center">{i + 1}</td>
                <td className="border border-black p-1 text-xs">{THEMES[4]}</td>
                <td className="border border-black p-1"><input type="text" className="w-full outline-none" /></td>
                <td className="border border-black p-1"><input type="text" className="w-full outline-none" /></td>
                <td className="border border-black p-1"><input type="text" className="w-full outline-none" /></td>
                <td className="border border-black p-1"><input type="number" className="w-full outline-none text-right" /></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* OUT of Sankalp Theme Table */}
        <table className="border-collapse border border-black w-full mb-16">
          <thead>
            <tr>
              <th colSpan={6} className="border border-black p-2 bg-blue-100 text-lg font-bold text-center">
                OUT of Sanklap Theme
              </th>
            </tr>
            <tr className="bg-gray-100 font-bold text-xs">
              <td colSpan={2} className="border border-black p-1">Own Fund 75 % ===&gt;</td>
              <td colSpan={2} className="border border-black p-1">SFC 75% ===&gt;</td>
              <td colSpan={2} className="border border-black p-1">Untied Grant 75 % ===&gt;</td>
            </tr>
            <tr className="bg-gray-100 text-center font-bold text-xs">
              <th className="border border-black p-1 w-10">S.No.</th>
              <th className="border border-black p-1 w-64">Theme Name</th>
              <th className="border border-black p-1">Activity Name for Sankalp</th>
              <th className="border border-black p-1 w-32">Work Type</th>
              <th className="border border-black p-1 w-32 text-[10px] leading-tight">Grant Type<br/>OWN<br/>SFC<br/>FFC</th>
              <th className="border border-black p-1 w-32">Balance</th>
            </tr>
          </thead>
          <tbody>
            {THEMES.map((theme, themeIdx) => {
              // 2 rows per theme
              return [...Array(2)].map((_, i) => (
                <tr key={`out-${themeIdx}-${i}`}>
                  <td className="border border-black p-1 text-center">{(themeIdx * 2) + i + 1}</td>
                  <td className="border border-black p-1 text-xs leading-tight">{theme}</td>
                  <td className="border border-black p-1"><input type="text" className="w-full outline-none" /></td>
                  <td className="border border-black p-1"><input type="text" className="w-full outline-none" /></td>
                  <td className="border border-black p-1"><input type="text" className="w-full outline-none" /></td>
                  <td className="border border-black p-1"><input type="number" className="w-full outline-none text-right" /></td>
                </tr>
              ));
            })}
          </tbody>
        </table>

        <div className="flex justify-between items-center px-10 text-sm mb-10">
          <div>Signature of PS</div>
          <div>Signature of Sarpanch</div>
        </div>
      </div>
    </div>
  );
}
