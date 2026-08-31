const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Add import
if (!content.includes('GrievancePortal')) {
    content = content.replace(
        'import { ExcelPrinterTool } from "./ExcelPrinterTool";',
        'import { ExcelPrinterTool } from "./ExcelPrinterTool";\nimport { GrievancePortal } from "./components/GrievancePortal";'
    );
}

// 2. Add to side menu dropdown
const menuDropdownTarget = `{ id: 'excel-merge', label: 'Excel File Merger', icon: <FileSpreadsheet size={16} /> },`;
if (!content.includes("{ id: 'grievance', label: 'Public Grievance'")) {
    content = content.replace(
        menuDropdownTarget,
        `${menuDropdownTarget}\n                                      { id: 'grievance', label: 'Public Grievance', icon: <MessageSquare size={16} /> },`
    );
}

// 3. Add to DigitalWorkspaceSection tools
const workspaceToolsTarget = `{
      id: "excel-merge",
      title: "Excel File Merger",
      icon: FileSpreadsheet,
      desc: "Merge Multiple Excel Files",
    },`;
if (!content.includes('id: "grievance"')) {
    content = content.replace(
        workspaceToolsTarget,
        `${workspaceToolsTarget}\n    {\n      id: "grievance",\n      title: "Public Grievances",\n      icon: MessageSquare,\n      desc: "ప్రజా ఫిర్యాదుల పరిష్కార వేదిక",\n    },`
    );
}

// 4. Add to DigitalWorkspaceSection render
const renderTarget = `{activeTool === "excel-merge" && (
                <ExcelMerger addToast={addToast} />
              )}`;
if (!content.includes('<GrievancePortal addToast={addToast} />')) {
    content = content.replace(
        renderTarget,
        `${renderTarget}\n              {activeTool === "grievance" && (\n                <GrievancePortal addToast={addToast} />\n              )}`
    );
}

fs.writeFileSync('src/App.tsx', content);
console.log("Updated App.tsx");
