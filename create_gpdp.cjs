const fs = require('fs');

const content = `import React, { useState, useMemo, useEffect } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { 
  CheckCircle2, AlertCircle, Upload, Download, ArrowRight, ArrowLeft, 
  FileSpreadsheet, FileDown, Activity, ClipboardList, Plus, Trash2, 
  MapPin, CheckSquare, Square
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ... (Will append chunks)
`;
fs.writeFileSync('src/components/GPDPPlanningTool.tsx', content);
console.log('Base created');
