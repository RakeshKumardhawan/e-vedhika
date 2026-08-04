import React from 'react';
import { Link } from 'react-router-dom';

export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-8 sm:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-8 bg-white p-8 rounded-3xl shadow-xl">
        <Link to="/" className="text-primary font-bold hover:underline mb-4 inline-block">&larr; Back to Home</Link>
        <h1 className="text-4xl font-black text-slate-900 mb-6 border-b pb-4">Privacy Policy for E-Vedhika</h1>
        
        <div className="prose prose-slate max-w-none space-y-6">
          <p><strong>Effective Date:</strong> January 1, 2024</p>
          
          <p>At E-Vedhika (www.e-vedhika.in), accessible from https://www.e-vedhika.in/, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by E-Vedhika and how we use it.</p>
          
          <h2 className="text-2xl font-bold mt-8">Information We Collect</h2>
          <p>The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.</p>
          <p>If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.</p>
          
          <h2 className="text-2xl font-bold mt-8">How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, operate, and maintain our website</li>
            <li>Improve, personalize, and expand our website</li>
            <li>Understand and analyze how you use our website</li>
            <li>Develop new products, services, features, and functionality</li>
            <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
            <li>Send you emails</li>
            <li>Find and prevent fraud</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8">Log Files</h2>
          <p>E-Vedhika follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.</p>

          <h2 className="text-2xl font-bold mt-8">Cookies and Web Beacons</h2>
          <p>Like any other website, E-Vedhika uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.</p>

          <h2 className="text-2xl font-bold mt-8">Google DoubleClick DART Cookie</h2>
          <p>Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads" className="text-blue-600 hover:underline">https://policies.google.com/technologies/ads</a></p>

          <h2 className="text-2xl font-bold mt-8">Third Party Privacy Policies</h2>
          <p>E-Vedhika's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.</p>
          
          <h2 className="text-2xl font-bold mt-8">Contact Us</h2>
          <p>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at rakeshkumardhawan123@gmail.com.</p>
        </div>
      </div>
    </div>
  );
}

export function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-8 sm:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-8 bg-white p-8 rounded-3xl shadow-xl">
        <Link to="/" className="text-primary font-bold hover:underline mb-4 inline-block">&larr; Back to Home</Link>
        <h1 className="text-4xl font-black text-slate-900 mb-6 border-b pb-4">Terms & Conditions</h1>
        
        <div className="prose prose-slate max-w-none space-y-6">
          <p>Welcome to E-Vedhika!</p>
          <p>These terms and conditions outline the rules and regulations for the use of E-Vedhika's Website, located at https://www.e-vedhika.in/.</p>
          <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use E-Vedhika if you do not agree to take all of the terms and conditions stated on this page.</p>
          
          <h2 className="text-2xl font-bold mt-8">Cookies</h2>
          <p>We employ the use of cookies. By accessing E-Vedhika, you agreed to use cookies in agreement with the E-Vedhika's Privacy Policy.</p>
          
          <h2 className="text-2xl font-bold mt-8">License</h2>
          <p>Unless otherwise stated, E-Vedhika and/or its licensors own the intellectual property rights for all material on E-Vedhika. All intellectual property rights are reserved. You may access this from E-Vedhika for your own personal use subjected to restrictions set in these terms and conditions.</p>
          
          <h2 className="text-2xl font-bold mt-8">User Comments</h2>
          <p>Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. E-Vedhika does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of E-Vedhika, its agents and/or affiliates.</p>
          
          <h2 className="text-2xl font-bold mt-8">Hyperlinking to our Content</h2>
          <p>The following organizations may link to our Website without prior written approval: Government agencies; Search engines; News organizations; Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses.</p>
        </div>
      </div>
    </div>
  );
}

export function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-8 sm:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-8 bg-white p-8 rounded-3xl shadow-xl">
        <Link to="/" className="text-primary font-bold hover:underline mb-4 inline-block">&larr; Back to Home</Link>
        <h1 className="text-4xl font-black text-slate-900 mb-6 border-b pb-4">About Us</h1>
        
        <div className="prose prose-slate max-w-none space-y-6">
          <p><strong>E-Vedhika: All Problems One Solution</strong></p>
          <p>Welcome to E-Vedhika, the ultimate digital workspace designed specifically for Panchayat Secretaries and local administration officials in Telangana.</p>
          <p>Our mission is to bridge the gap between complex governmental reporting requirements and the everyday operations at the village level. With our robust tools like the UBD Tracker, Farmer Registry, and digital record maintenance, we simplify governance, automate calculations, and make it easier for officials to serve citizens effectively.</p>
          
          <h2 className="text-2xl font-bold mt-8">What We Do</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Digital Integration:</strong> Bring multiple departmental formats and registers into one unified platform.</li>
            <li><strong>Automated Reports:</strong> Generate instant Excel and PDF reports for UBD and Farmer data without manual hassle.</li>
            <li><strong>Real-time Updates:</strong> Get the latest G.O.s, circulars, and departmental updates right at your fingertips.</li>
            <li><strong>Support & Community:</strong> Connect with other Panchayat Secretaries and share useful information.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8">Our Vision</h2>
          <p>We envision a fully digitized, error-free, and transparent Panchayat Raj system where technology handles the redundant tasks, allowing officials to focus on ground-level development and public welfare.</p>
        </div>
      </div>
    </div>
  );
}

export function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-8 sm:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-8 bg-white p-8 rounded-3xl shadow-xl">
        <Link to="/" className="text-primary font-bold hover:underline mb-4 inline-block">&larr; Back to Home</Link>
        <h1 className="text-4xl font-black text-slate-900 mb-6 border-b pb-4">Contact Us</h1>
        
        <div className="prose prose-slate max-w-none space-y-6">
          <p>If you have any questions, suggestions, or need technical support, please feel free to reach out to us using the contact information provided below.</p>
          
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mt-6">
            <h3 className="text-lg font-bold mb-4">Support Channels</h3>
            <p className="mb-2"><strong>Email:</strong> <a href="mailto:rakeshkumardhawan123@gmail.com" className="text-blue-600 hover:underline">rakeshkumardhawan123@gmail.com</a></p>
            <p className="mb-2"><strong>Platform:</strong> E-Vedhika Web Portal</p>
            <p><strong>Response Time:</strong> We typically respond within 24-48 business hours.</p>
          </div>
          
          <p className="mt-8">Your feedback is incredibly valuable to us as we continuously strive to improve the E-Vedhika portal to better serve the needs of Panchayat Secretaries across Telangana.</p>
        </div>
      </div>
    </div>
  );
}
