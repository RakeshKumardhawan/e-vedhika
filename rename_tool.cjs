const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
    'import { GrievancePortal } from "./components/GrievancePortal";',
    'import { GPDPPlanningTool } from "./components/GPDPPlanningTool";'
);

content = content.replace(
    "{ id: 'grievance', label: 'Public Grievance', icon: <MessageSquare size={16} /> },",
    "{ id: 'gpdp-planning', label: '(GPDP) - Planning & Budget', icon: <ClipboardList size={16} /> },"
);

content = content.replace(
    `    {
      id: "grievance",
      title: "Public Grievances",
      icon: MessageSquare,
      desc: "ప్రజా ఫిర్యాదుల పరిష్కార వేదిక",
    },`,
    `    {
      id: "gpdp-planning",
      title: "(GPDP) – Planning & Budget Allocation",
      icon: ClipboardList,
      desc: "గ్రామ పంచాయతీ అభివృద్ధి ప్రణాళిక",
    },`
);

content = content.replace(
    `              {activeTool === "grievance" && (
                <GrievancePortal addToast={addToast} />
              )}`,
    `              {activeTool === "gpdp-planning" && (
                <GPDPPlanningTool addToast={addToast} />
              )}`
);

fs.writeFileSync('src/App.tsx', content);
console.log("Renamed to GPDP Planning Tool.");
