const fs = require('fs');
const file = 'src/components/ComplaintFormModal.tsx';
let code = fs.readFileSync(file, 'utf8');

const submitTarget = `      Swal.fire({
        icon: 'success',
        title: 'టికెట్ సమర్పించబడింది!',
        text: \`మీ సపోర్ట్ టికెట్ ఐడీ: #\${ticketRef.id.substring(0, 8).toUpperCase()}\`,
        confirmButtonColor: '#005bb5'
      });

      if (addToast) {
        addToast("టికెట్ విజయవంతంగా సమర్పించబడింది.");
      }

      setSuccessTicketId(ticketRef.id.substring(0, 8).toUpperCase());`;

const submitNew = `      if (addToast) {
        addToast("టికెట్ విజయవంతంగా సమర్పించబడింది.");
      }

      setSuccessTicketId(ticketRef.id.substring(0, 8).toUpperCase());`;

if (code.includes(submitTarget)) {
  code = code.replace(submitTarget, submitNew);
  fs.writeFileSync(file, code);
  console.log("Removed Swal.fire success popup!");
} else {
  console.log("Target not found for Swal.fire removal.");
}
