import React from 'react';
import UserNavbar from '../components/UserNavbar';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <UserNavbar />

      <section className="max-w-4xl mx-auto px-6 sm:px-8 md:px-10 py-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0164FC] dark:text-blue-400 mb-6">
          Privacy Policy
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm sm:text-base">
          Effective Date: July 6, 2025
        </p>

        <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
          <p>
            At <strong>Career Hunt</strong>, we value your privacy. This Privacy Policy explains how we collect, use, and protect your information when using our platform as a job seeker or recruiter.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold mt-10 text-[#0164FC] dark:text-blue-400">1. Information We Collect</h2>
          <ul className="list-disc list-inside ml-4">
            <li><strong>Account Info:</strong> Name, email, password, and role.</li>
            <li><strong>Resume Data:</strong> Documents and AI tool inputs.</li>
            <li><strong>Job Interactions:</strong> Saved jobs and application history.</li>
            <li><strong>Technical Data:</strong> IP address, device, and usage stats.</li>
          </ul>

          <h2 className="text-xl sm:text-2xl font-bold mt-10 text-[#0164FC] dark:text-blue-400">2. How We Use Your Information</h2>
          <ul className="list-disc list-inside ml-4">
            <li>Create and manage your account.</li>
            <li>Generate personalized resumes and suggestions.</li>
            <li>Match candidates with relevant jobs and recruiters.</li>
            <li>Improve performance and user experience.</li>
          </ul>

          <h2 className="text-xl sm:text-2xl font-bold mt-10 text-[#0164FC] dark:text-blue-400">3. Data Sharing</h2>
          <p>We do not sell your personal data. We may share it with:</p>
          <ul className="list-disc list-inside ml-4">
            <li>Recruiters if you've applied or opted-in to visibility.</li>
            <li>Service providers (e.g. analytics, AI, hosting).</li>
            <li>Authorities, if legally required.</li>
          </ul>

          <h2 className="text-xl sm:text-2xl font-bold mt-10 text-[#0164FC] dark:text-blue-400">4. Cookies & Tracking</h2>
          <p>
            We use cookies and similar tools to authenticate users and understand behavior. You can control cookie settings in your browser.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold mt-10 text-[#0164FC] dark:text-blue-400">5. Data Retention</h2>
          <p>We retain data as long as needed to provide our services. You can delete your account anytime.</p>

          <h2 className="text-xl sm:text-2xl font-bold mt-10 text-[#0164FC] dark:text-blue-400">6. Your Rights</h2>
          <ul className="list-disc list-inside ml-4">
            <li>Access, correct, or delete your data.</li>
            <li>Disable marketing communications.</li>
            <li>Control cookie preferences.</li>
          </ul>

          <h2 className="text-xl sm:text-2xl font-bold mt-10 text-[#0164FC] dark:text-blue-400">7. Children’s Privacy</h2>
          <p>Our platform is not intended for users under 16. We do not knowingly collect data from children.</p>

          <h2 className="text-xl sm:text-2xl font-bold mt-10 text-[#0164FC] dark:text-blue-400">8. Policy Updates</h2>
          <p>We may update this policy. Major changes will be notified via email or on the platform.</p>

          <h2 className="text-xl sm:text-2xl font-bold mt-10 text-[#0164FC] dark:text-blue-400">9. Contact Us</h2>
          <p>
            For questions or concerns, reach out to us at{' '}
            <a href="mailto:support@claimyourcareer.com" className="text-blue-600 dark:text-blue-400 underline">
              support@careerhunt.com
            </a>.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
