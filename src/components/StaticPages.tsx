import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

function useStaticPage(pageId: string) {
  const [data, setData] = useState<{ title: string; content: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const snap = await getDoc(doc(db, "settings", "static_pages"));
        if (snap.exists() && snap.data()[pageId]) {
          setData(snap.data()[pageId]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [pageId]);

  return { data, loading };
}

function PageTemplate({ pageId, defaultTitle, defaultContent }: { pageId: string, defaultTitle: string, defaultContent: string }) {
  const { data, loading } = useStaticPage(pageId);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 p-8 sm:p-12 font-sans flex justify-center items-center">
        <div className="text-slate-500 font-bold animate-pulse">Loading...</div>
      </div>
    );
  }

  const title = data?.title || defaultTitle;
  const content = data?.content || defaultContent;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-8 sm:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-8 bg-white p-8 rounded-3xl shadow-xl">
        <Link to="/" className="text-primary font-bold hover:underline mb-4 inline-block">&larr; Back to Home</Link>
        <h1 className="text-4xl font-black text-slate-900 mb-6 border-b pb-4">{title}</h1>
        
        <div className="prose prose-slate max-w-none space-y-6 markdown-body">
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export function PrivacyPolicyPage() {
  return <PageTemplate pageId="privacy" defaultTitle="Privacy Policy" defaultContent="<p>Privacy Policy not set yet.</p>" />;
}

export function TermsPage() {
  return <PageTemplate pageId="terms" defaultTitle="Terms & Conditions" defaultContent="<p>Terms not set yet.</p>" />;
}

export function AboutPage() {
  return <PageTemplate pageId="about" defaultTitle="About Us" defaultContent="<p>About content not set yet.</p>" />;
}

export function ContactPage() {
  return <PageTemplate pageId="contact" defaultTitle="Contact Us" defaultContent="<p>Contact information not set yet.</p>" />;
}
