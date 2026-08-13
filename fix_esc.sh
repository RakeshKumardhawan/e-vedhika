#!/bin/bash
sed -i '2363,2382d' src/App.tsx
sed -i '/delete (window as any).setSharingPostForPoster;/a\
    };\
  }, []);\
\
  useEffect(() => {\
    const handleEsc = (e: KeyboardEvent) => {\
      if (e.key === "Escape") {\
        setShowPostForm(false);\
        setShowSuggestionForm(false);\
        setShowProfileModal(false);\
        setShowAuthModal(false);\
        setShowFooterModal(null);\
        setShowPin(false);\
        setShowUpload(false);\
        setLightboxImage(null);\
        setSharingPostForPoster(null);\
      }\
    };\
    document.addEventListener("keydown", handleEsc);\
    return () => document.removeEventListener("keydown", handleEsc);' src/App.tsx
