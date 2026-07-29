sed -i 's/setIsPriorityOpen(false)/setOpenDropdown(null)/g' src/App.tsx
sed -i 's/setCurrentTab("workspace"); }); }}/setCurrentTab("workspace"); }); setOpenDropdown(null); }}/g' src/App.tsx
sed -i 's/setCurrentTab("gos_formats"); }); }}/setCurrentTab("gos_formats"); }); setOpenDropdown(null); }}/g' src/App.tsx
