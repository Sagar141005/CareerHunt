import React from "react";
import { Link } from "react-router-dom";
import { RiArrowLeftLine, RiTimeLine } from "@remixicon/react";
import Footer from "../components/Footer";

const PrivacyPolicy = () => {
  const PolicySection = ({ number, title, children }) => (
    <div className="mb-10 scroll-mt-24" id={`section-${number}`}>
      <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-3">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 text-sm font-bold font-mono">
          {number}
        </span>
        {title}
      </h2>
      <div className="pl-11 text-neutral-600 dark:text-neutral-400 leading-7 text-[15px] sm:text-base">
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300 flex flex-col">
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <RiArrowLeftLine size={18} /> Back to Home
          </Link>
        </div>
      </div>

      <main className="flex-grow py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-16 text-center sm:text-left border-b border-neutral-200 dark:border-neutral-800 pb-10">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight mb-6">
              Privacy Policy
            </h1>
            <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-sm">
              <RiTimeLine size={16} />
              <span>Last updated: July 6, 2025</span>
            </div>
          </div>

          <div className="animate-fade-in-up">
            <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-12 leading-relaxed">
              At{" "}
              <strong className="text-neutral-900 dark:text-white">
                Career Hunt
              </strong>
              , we value your privacy. This Privacy Policy explains how we
              collect, use, and protect your information when using our platform
              as a job seeker or recruiter.
            </p>

            <PolicySection number="01" title="Information We Collect">
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <span className="w-1.5 h-1.5 mt-2 rounded-full bg-blue-500 flex-shrink-0" />
                  <span>
                    <strong className="text-neutral-900 dark:text-white">
                      Account Info:
                    </strong>{" "}
                    Name, email, password, and role preference.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="w-1.5 h-1.5 mt-2 rounded-full bg-blue-500 flex-shrink-0" />
                  <span>
                    <strong className="text-neutral-900 dark:text-white">
                      Resume Data:
                    </strong>{" "}
                    Uploaded documents, parsed text, and AI tool inputs.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="w-1.5 h-1.5 mt-2 rounded-full bg-blue-500 flex-shrink-0" />
                  <span>
                    <strong className="text-neutral-900 dark:text-white">
                      Job Interactions:
                    </strong>{" "}
                    Saved jobs, application history, and search preferences.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="w-1.5 h-1.5 mt-2 rounded-full bg-blue-500 flex-shrink-0" />
                  <span>
                    <strong className="text-neutral-900 dark:text-white">
                      Technical Data:
                    </strong>{" "}
                    IP address, browser type, device info, and usage statistics.
                  </span>
                </li>
              </ul>
            </PolicySection>

            <PolicySection number="02" title="How We Use Your Information">
              <p className="mb-4">
                We use the collected data to provide and improve our services,
                including:
              </p>
              <ul className="grid sm:grid-cols-2 gap-3">
                {[
                  "Create and manage your account",
                  "Generate personalized resumes",
                  "Match candidates with jobs",
                  "Improve platform performance",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 p-3 rounded-lg bg-neutral-100 dark:bg-neutral-900 text-sm font-medium"
                  >
                    <span className="text-blue-500">✓</span> {item}
                  </li>
                ))}
              </ul>
            </PolicySection>

            <PolicySection number="03" title="Data Sharing">
              <p className="mb-3">
                We do not sell your personal data. We may share it strictly
                with:
              </p>
              <ul className="space-y-2 list-disc list-inside marker:text-neutral-400">
                <li>
                  Recruiters (only if you apply or opt-in to public visibility).
                </li>
                <li>
                  Trusted service providers (analytics, AI processing, hosting).
                </li>
                <li>
                  Legal authorities, if required by law to protect our rights.
                </li>
              </ul>
            </PolicySection>

            <PolicySection number="04" title="Cookies & Tracking">
              <p>
                We use cookies and similar technologies to authenticate users,
                analyze traffic, and personalize content. You can control cookie
                settings directly through your browser preferences at any time.
              </p>
            </PolicySection>

            <PolicySection number="05" title="Data Retention">
              <p>
                We retain your personal data only as long as necessary to
                provide our services and for legitimate business purposes. You
                may request the deletion of your account and data at any time
                via your dashboard settings.
              </p>
            </PolicySection>

            <PolicySection number="06" title="Your Rights">
              <p className="mb-3">
                Depending on your location, you have the right to:
              </p>
              <ul className="space-y-2 list-disc list-inside marker:text-neutral-400">
                <li>Access, correct, or delete your personal data.</li>
                <li>Opt-out of marketing communications.</li>
                <li>Restrict processing of your data.</li>
              </ul>
            </PolicySection>

            <PolicySection number="07" title="Children’s Privacy">
              <p>
                Our platform is not intended for users under the age of 16. We
                do not knowingly collect personal identifiable information from
                children. If we discover such data, we will delete it
                immediately.
              </p>
            </PolicySection>

            <PolicySection number="08" title="Policy Updates">
              <p>
                We may update this Privacy Policy from time to time. Significant
                changes will be communicated via email or a prominent notice on
                our platform. Continued use of the service implies acceptance of
                the updated terms.
              </p>
            </PolicySection>

            <PolicySection number="09" title="Contact Us">
              <p>
                For questions, concerns, or data requests, please reach out to
                our privacy team at{" "}
                <a
                  href="mailto:support@careerhunt.com"
                  className="text-blue-600 dark:text-blue-400 font-medium hover:underline decoration-2 underline-offset-2"
                >
                  support@careerhunt.com
                </a>
                .
              </p>
            </PolicySection>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
