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
  const rawContent = data?.content;
  const content = (!rawContent || rawContent.includes("not set yet") || rawContent.trim() === "") ? defaultContent : rawContent;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-8 sm:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-8 bg-white p-8 rounded-3xl shadow-xl">
        <Link to="/" className="text-primary font-bold hover:underline mb-4 inline-block">&larr; Back to Home</Link>
        
        {/* Disclaimer Banner */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-semibold text-amber-900 leading-relaxed">
          <strong>Disclaimer:</strong> E-VEDHIKA (e-vedhika.in) is an independent private technical utility platform created for automation, deployment assistance, code management, and system monitoring. <strong>This website has no connection, affiliation, partnership, or authorization with any government department or external public entity.</strong>
        </div>

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
  return <PageTemplate pageId="privacy" defaultTitle="Privacy Policy" defaultContent={`
### 1. Information We Collect
At **E-VEDHIKA** (e-vedhika.in), we respect your privacy and are committed to protecting your personal data. We collect basic account details, telemetry logs, and user preferences necessary to provide our services.

### 2. How We Use Data
- To provide, maintain, and improve our deployment tools and administrative features.
- To send important system notifications, updates, and announcements.
- To ensure platform security and troubleshoot technical issues.

### 3. Data Security
We implement robust security measures, encryption, and secure cloud storage to protect your data against unauthorized access, alteration, or disclosure.

### 4. Third-Party Services
We do not sell or rent your personal information to third parties. Data is only processed securely through trusted infrastructure providers (Firebase, Cloud Run).
  `} />;
}

export function TermsPage() {
  return <PageTemplate pageId="terms" defaultTitle="Terms & Conditions" defaultContent={`
### 1. Introduction & Independence
Welcome to **E-VEDHIKA** (e-vedhika.in) - All Problems One Solution & Deployment Tool. **E-Vedhika is an independent private platform and has no affiliation, connection, or endorsement from any government agency.** By accessing or using our platform, website, applications, and tools, you agree to comply with and be bound by the following terms and conditions.

### 2. Usage Policy
- Users must use the platform responsibly and for legitimate technical or administrative utility purposes.
- Unauthorized attempts to modify, disrupt, or bypass system security, deployment tools, or API endpoints are strictly prohibited.

### 3. Intellectual Property
All content, tools, source code, designs, and documentation on E-Vedhika are protected by intellectual property rights. Redistribution or commercial exploitation without prior permission is prohibited.

### 4. Limitation of Liability
E-Vedhika provides deployment tools, guides, and monitoring features on an "as is" basis without warranties of any kind. We strive for maximum reliability but are not liable for external network issues or third-party service downtime.

### 5. Contact Information
For any questions regarding these terms, please reach out via our official support portal or contact channels.
  `} />;
}

export function AboutPage() {
  return <PageTemplate pageId="about" defaultTitle="About E-Vedhika" defaultContent={`
### 🌟 E-Vedhika: All Problems One Solution & Deployment Tool
**E-Vedhika** is an independent advanced administrative and technical utility platform designed to streamline software configurations, digital signature setups, system telemetry monitoring, and IT support services.

**Official Notice:** E-Vedhika is an independent private platform and is **not affiliated with, endorsed by, or connected to any government agency.**

### 🚀 Key Features & Capabilities
- **Deployment Tools & Code Management**: Automated configuration assistants and deployment gateways.
- **Real-time Monitoring**: Live status tracking of system telemetry, server health, and platform availability.
- **Secure Collaboration & Admin Controls**: Role-based access, audit logs, and direct administrative communication.
- **Comprehensive Guides & Formats**: Quick access to utility formats, guides, and troubleshooting documentation.

### 📞 Contact & Support
- **Email**: [evedhikasupport@gmail.com](mailto:evedhikasupport@gmail.com)
- **Telegram Chat**: Contact via Telegram for quick assistance and support.
- **Screen Sharing Requests**: If anyone requests screen sharing or remote assistance, please connect and contact me via **UltraViewer**.
  `} />;
}

export function ContactPage() {
  return <PageTemplate pageId="contact" defaultTitle="Contact Us" defaultContent={`
### 📞 Get in Touch
Have questions, suggestions, or technical support requests regarding **E-Vedhika**? We are here to help!

- **Official Website**: [https://e-vedhika.in](https://e-vedhika.in)
- **Support Channels**: Use the **Suggestions / Support** panel inside the app or the Direct Message system to reach out to administrators.
- **Response Time**: Our support team reviews queries regularly and provides timely assistance for technical and deployment issues.
  `} />;
}
