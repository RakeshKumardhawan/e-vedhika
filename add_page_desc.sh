sed -i 's/const \[landingPageData/const \[pageDescriptions, setPageDescriptions\] = useState<Record<string, { title: string; description: string }>>({});\n  const \[landingPageData/g' src/App.tsx
