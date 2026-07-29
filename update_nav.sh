sed -i 's/<div key={item.id} className="relative group\/navitem shrink-0">/<div key={item.id} className="relative group\/navitem shrink-0" onMouseLeave={() => setOpenDropdown(null)}>/g' src/App.tsx
