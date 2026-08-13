#!/bin/bash
sed -i 's/const \[hasError, setHasError\] = useState(false);/const [hasError, setHasError] = useState(false);\n  const [isLoading, setIsLoading] = useState(true);/g' src/App.tsx
sed -i 's/setHasError(false);/setHasError(false);\n    setIsLoading(true);/g' src/App.tsx
