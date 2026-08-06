import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface DynamicSectionProps {
  id: string;
}

export function DynamicSection({ id }: DynamicSectionProps) {
  const [htmlContent, setHtmlContent] = useState<string>('');
  
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'custom_code', id), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.status === 'Live' && data.content) {
          setHtmlContent(data.content);
        } else {
          setHtmlContent('');
        }
      } else {
        setHtmlContent('');
      }
    });

    return () => unsub();
  }, [id]);

  if (!htmlContent) return null;

  return (
    <div 
      className="e-vedhika-dynamic-section" 
      dangerouslySetInnerHTML={{ __html: htmlContent }} 
    />
  );
}
