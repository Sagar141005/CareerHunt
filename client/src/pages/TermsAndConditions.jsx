import React from 'react';
import UserNavbar from '../components/UserNavbar';
import Footer from '../components/Footer';

const TermsAndConditions = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <UserNavbar />

      <section className="max-w-4xl mx-auto px-6 sm:px-8 md:px-10 py-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0164FC] dark:text-blue-400 mb-6">
          Terms & Conditions
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm sm:text-base">
          Last Updated: July 6, 2025
        </p>

        <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
          <p>
            These Terms & Conditions govern your use of the Career Hunt platform as a job seeker or recruiter. By using our site or services, you agree to comply with them.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold mt-10 text-[#0164FC] dark:text-blue-400">1. Account Use</h2>
          <ul className="list-disc list-inside ml-4">
            <li>You must be at least 16 years old to use this platform.</li>
            <li>Keep your login credentials secure. You’re responsible for all activities under your account.</li>
            <li>We reserve the right to suspend or terminate accounts for violations.</li>
          </ul>

          <h2 className="text-xl sm:text-2xl font-bold mt-10 text-[#0164FC] dark:text-blue-400">2. Services Provided</h2>
          <p>
            Career Hunt offers tools like AI resume generation, job tracking, and recruiting dashboards. We do not guarantee job placement or candidate quality.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold mt-10 text-[#0164FC] dark:text-blue-400">3. User Conduct</h2>
          <ul className="list-disc list-inside ml-4">
            <li>No false job posts or resumes.</li>
            <li>Do not use the platform to harass, spam, or mislead others.</li>
            <li>Respect privacy and intellectual property rights of others.</li>
          </ul>

          <h2 className="text-xl sm:text-2xl font-bold mt-10 text-[#0164FC] dark:text-blue-400">4. Intellectual Property</h2>
          <p>
            All content, trademarks, and technology on the platform belong to Career Hunt or its licensors. You may not copy, distribute, or reverse-engineer any part of it without permission.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold mt-10 text-[#0164FC] dark:text-blue-400">5. Termination</h2>
          <p>
            We may suspend or terminate your access if you violate these terms. You may also close your account at any time through your dashboard.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold mt-10 text-[#0164FC] dark:text-blue-400">6. Limitation of Liability</h2>
          <p>
            We are not liable for job offers, recruiter decisions, or third-party behavior. Our tools assist, but the final outcomes depend on users.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold mt-10 text-[#0164FC] dark:text-blue-400">7. Modifications</h2>
          <p>
            We may update these terms at any time. Continued use after changes means you agree to the revised terms.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold mt-10 text-[#0164FC] dark:text-blue-400">8. Governing Law</h2>
          <p>
            These terms are governed by the laws of your operating jurisdiction. Disputes will be resolved in accordance with those laws.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold mt-10 text-[#0164FC] dark:text-blue-400">9. Contact Us</h2>
          <p>
            For any questions about these terms, email us at{' '}
            <a href="mailto:legal@claimyourcareer.com" className="text-blue-600 dark:text-blue-400 underline">
              legal@careerhunt.com
            </a>.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsAndConditions;
