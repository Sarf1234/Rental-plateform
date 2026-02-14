export const metadata = {
  title: "Privacy Policy | KirayNow",
  description:
    "Learn how KirayNow collects, uses, and protects your personal information while using our rental marketplace platform.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 mt-16">
      <div className="max-w-5xl mx-auto px-4 py-16">

        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Privacy Policy
          </h1>
          <p className="mt-6 text-gray-600 max-w-3xl mx-auto">
            At KirayNow, we value your privacy and are committed to protecting
            your personal information. This policy explains how we collect,
            use, and safeguard your data.
          </p>
        </div>

        {/* CONTENT */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 space-y-10 text-gray-700 leading-relaxed">

          {/* 1 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              1. Information We Collect
            </h2>
            <p>
              When you use KirayNow, we may collect personal information such
              as your name, phone number, email address, and location details.
              This information is collected when you contact vendors or submit
              inquiries through our platform.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To connect you with relevant rental vendors.</li>
              <li>To improve platform functionality and user experience.</li>
              <li>To respond to inquiries and support requests.</li>
              <li>To maintain transparency within the rental marketplace.</li>
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              3. Information Sharing
            </h2>
            <p>
              KirayNow shares user information only with relevant vendors to
              facilitate service inquiries and bookings. We do not sell or rent
              your personal information to third parties.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              4. Third-Party Vendors
            </h2>
            <p>
              Once you contact a vendor, further communication and service
              execution occur directly between you and the vendor. KirayNow is
              not responsible for how vendors use or handle your data outside
              the platform.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              5. Cookies & Analytics
            </h2>
            <p>
              We may use cookies and analytics tools to improve performance,
              monitor traffic, and enhance user experience. These tools help us
              understand how visitors interact with our platform.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              6. Data Security
            </h2>
            <p>
              We implement reasonable security measures to protect your
              information. However, no digital platform can guarantee complete
              security.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              7. User Rights
            </h2>
            <p>
              You may request correction or deletion of your personal
              information by contacting us directly.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              8. Changes to This Policy
            </h2>
            <p>
              KirayNow reserves the right to update this Privacy Policy at any
              time. Continued use of the platform constitutes acceptance of any
              changes.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              9. Contact Information
            </h2>
            <p>
              For questions regarding this Privacy Policy, please contact us:
            </p>
            <p className="mt-2 font-medium">
              Email: support@kiraynow.com
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
