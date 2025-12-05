import React from "react";
import { Link } from "react-router-dom";
import { RiArrowLeftLine, RiTimeLine } from "@remixicon/react";
import Footer from "../components/Footer";

const TermsAndConditions = () => {
  const TermsSection = ({ number, title, children }) => (
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
              Terms & Conditions
            </h1>
            <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-sm">
              <RiTimeLine size={16} />
              <span>Last Updated: July 6, 2025</span>
            </div>
          </div>

          <div className="animate-fade-in-up">
            <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-12 leading-relaxed">
              These Terms & Conditions govern your use of the{" "}
              <strong className="text-neutral-900 dark:text-white">
                Career Hunt
              </strong>{" "}
              platform as a job seeker or recruiter. By accessing our site or
              using our services, you agree to comply with and be bound by these
              terms.
            </p>

            <TermsSection number="01" title="Account Use">
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <span className="w-1.5 h-1.5 mt-2 rounded-full bg-blue-500 flex-shrink-0" />
                  <span>
                    You must be at least 16 years old to use this platform.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="w-1.5 h-1.5 mt-2 rounded-full bg-blue-500 flex-shrink-0" />
                  <span>
                    You are responsible for maintaining the confidentiality of
                    your login credentials and for all activities that occur
                    under your account.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="w-1.5 h-1.5 mt-2 rounded-full bg-blue-500 flex-shrink-0" />
                  <span>
                    We reserve the right to suspend or terminate accounts that
                    violate our community guidelines or these terms.
                  </span>
                </li>
              </ul>
            </TermsSection>

            <TermsSection number="02" title="Services Provided">
              <p>
                Career Hunt provides digital tools including, but not limited
                to, AI resume generation, job application tracking, and
                recruitment dashboards. We act as a facilitator and do not
                guarantee job placement, employment offers, or the specific
                quality of any candidate or employer.
              </p>
            </TermsSection>

            <TermsSection number="03" title="User Conduct">
              <p className="mb-3">
                You agree to use the platform responsibly. Prohibited activities
                include:
              </p>
              <ul className="space-y-2 list-disc list-inside marker:text-neutral-400">
                <li>
                  Posting false, misleading, or fraudulent job listings or
                  resumes.
                </li>
                <li>
                  Using the platform to harass, spam, or solicit users for
                  non-employment purposes.
                </li>
                <li>
                  Infringing upon the privacy or intellectual property rights of
                  others.
                </li>
              </ul>
            </TermsSection>

            <TermsSection number="04" title="Intellectual Property">
              <p>
                All content, trademarks, logos, and technology displayed on the
                platform are the exclusive property of Career Hunt or its
                licensors. You are granted a limited license to access and use
                the platform for its intended purpose, but you may not copy,
                modify, distribute, or reverse-engineer any part of it without
                explicit permission.
              </p>
            </TermsSection>

            <TermsSection number="05" title="Termination">
              <p>
                We may, at our sole discretion, suspend or terminate your access
                to the platform without prior notice if we believe you have
                violated these Terms. You may also voluntarily close your
                account at any time through your dashboard settings.
              </p>
            </TermsSection>

            <TermsSection number="06" title="Limitation of Liability">
              <p>
                To the fullest extent permitted by law, Career Hunt shall not be
                liable for any indirect, incidental, or consequential damages
                arising from your use of the service. We are not responsible for
                the hiring decisions made by recruiters or the behavior of any
                third party on the platform.
              </p>
            </TermsSection>

            <TermsSection number="07" title="Modifications">
              <p>
                We reserve the right to modify these Terms & Conditions at any
                time. Any changes will be effective immediately upon posting.
                Your continued use of the platform after changes constitutes
                your acceptance of the revised terms.
              </p>
            </TermsSection>

            <TermsSection number="08" title="Governing Law">
              <p>
                These terms shall be governed by and construed in accordance
                with the laws of your operating jurisdiction, without regard to
                its conflict of law provisions. Any disputes arising under these
                terms shall be resolved exclusively in the courts of that
                jurisdiction.
              </p>
            </TermsSection>

            <TermsSection number="09" title="Contact Us">
              <p>
                If you have any questions or legal concerns regarding these
                Terms, please contact our legal team at{" "}
                <a
                  href="mailto:legal@careerhunt.com"
                  className="text-blue-600 dark:text-blue-400 font-medium hover:underline decoration-2 underline-offset-2"
                >
                  legal@careerhunt.com
                </a>
                .
              </p>
            </TermsSection>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsAndConditions;
