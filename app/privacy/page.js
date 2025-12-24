"use client";

import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="bg-gray-50 font-sans min-h-screen py-8 sm:py-12">
      <div className="w-full max-w-4xl mx-auto p-6 sm:p-10 bg-white rounded-2xl shadow-lg">
        <header className="border-b pb-6 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 text-center">Privacy Policy</h1>
          <p className="text-center text-sm text-gray-500 mt-2">Last Updated: October 14, 2025</p>
        </header>

        <main className="space-y-8 text-gray-700">
          <p>
            Welcome to Sparky’s privacy policy (“Privacy Policy” or “Policy”). This Policy describes how Sparky (“Company”, “we”, “us”, or “our”) collects, uses, shares, and protects your personal data when you use our website, mobile application, or services (“Platform” or “Services”). By accessing or using our Services, you consent to the practices described in this Policy.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">1. WHAT DATA DO WE COLLECT?</h2>
            <div className="space-y-2 pl-4 border-l-2 border-gray-200">
              <p>(a) <strong>Identity and Contact Information:</strong> Name, phone number, email address, residential address, government-issued ID (for technicians), and profile details.</p>
              <p>(b) <strong>Service Information:</strong> Bookings, service requests, preferences, feedback, and communication history.</p>
              <p>(c) <strong>Payment Information:</strong> Payment method details (processed securely via third-party providers; we do not store card details).</p>
              <p>(d) <strong>Location Data:</strong> Address and GPS information for accurate technician assignment and service delivery.</p>
              <p>(e) <strong>Device & Technical Information:</strong> IP address, browser type, operating system, device identifiers, and usage statistics.</p>
              <p>(f) <strong>Cookies & Tracking Data:</strong> Data collected via cookies and similar technologies for analytics, security, and personalization.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. HOW DO WE COLLECT YOUR DATA?</h2>
            <div className="space-y-2 pl-4 border-l-2 border-gray-200">
              <p>(a) When you register on our Platform, create an account, or update your profile.</p>
              <p>(b) When you request, book, or avail of our Services.</p>
              <p>(c) When technicians register to provide services through our Platform.</p>
              <p>(d) When you communicate with us via email, calls, or support channels.</p>
              <p>(e) Automatically, through cookies, log files, and analytics tools.</p>
              <p>(f) From third parties, such as payment gateways, background verification agencies, or social login providers (if used).</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">3. HOW DO WE USE YOUR PERSONAL DATA?</h2>
            <div className="space-y-2 pl-4 border-l-2 border-gray-200">
              <p>We will only use your personal data when the law allows us to. We use it to provide Services, enable Professional Services, and comply with legal obligations, including:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>To verify your identity and manage your account.</li>
                <li>To provide and manage the Services you request.</li>
                <li>To enable technicians to deliver services to you.</li>
                <li>To track transactions and process secure payments.</li>
                <li>To communicate with you regarding bookings, updates, and support.</li>
                <li>To send you promotional offers and marketing (where permitted).</li>
                <li>To monitor trends and personalize your experience.</li>
                <li>To improve our Services and business models.</li>
                <li>To resolve disputes and respond to service requests.</li>
                <li>To secure our Platform and prevent fraud.</li>
                <li>To comply with legal obligations and enforce our Terms & Conditions.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">4. HOW DO WE SHARE YOUR PERSONAL DATA?</h2>
            <div className="space-y-2 pl-4 border-l-2 border-gray-200">
              <p>We may share your data with:</p>
               <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Technicians/Service Providers to fulfill your service requests.</li>
                <li>Payment Processors for secure transaction handling.</li>
                <li>Third-Party Vendors like analytics providers and cloud storage.</li>
                <li>Legal Authorities when required by law.</li>
                <li>Business Transfers in case of mergers or acquisitions.</li>
              </ul>
              <p>We do not sell your personal data to third parties.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">5. DATA RETENTION</h2>
            <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                <p>We retain your personal data only as long as necessary to fulfill the purposes outlined in this Policy, unless a longer retention period is required by law.</p>
            </div>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">6. DATA SECURITY</h2>
            <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                <p>We implement appropriate technical, organizational, and administrative measures to protect your personal data. However, no method of transmission over the internet is completely secure.</p>
            </div>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">7. YOUR RIGHTS</h2>
            <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                <p>Depending on your jurisdiction, you may have the right to access, update, delete, or restrict the processing of your personal data, and to opt out of marketing communications.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">8. COOKIES & TRACKING TECHNOLOGIES</h2>
            <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                <p>We use cookies and similar tools to enhance user experience, monitor usage patterns, and deliver targeted ads. You may disable cookies in your browser settings.</p>
            </div>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">9. CHILDREN’S PRIVACY</h2>
            <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                <p>Our Services are not intended for booking by individuals under 18, though parents and guardians can book for them. We do not knowingly collect personal data from children.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">10. CHANGES TO THIS POLICY</h2>
            <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                <p>We may update this Privacy Policy from time to time. Any modifications will be posted on this page. We recommend all users to carefully review the latest terms to understand the current rules and policies.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">11. CONTACT US</h2>
            <div className="space-y-2 pl-4 border-l-2 border-gray-200">
              <p>If you have any questions or concerns regarding this Policy, please contact us at:</p>
              {/* <p>📧 Email: [Insert Email]</p>
              <p>📞 Phone: [Insert Number]</p>
              <p>🏢 Address: [Insert Office Address]</p> */}
            </div>
          </section>
          
        </main>
      </div>
    </div>
  );
}