export const metadata = {
  title: "Terms and Conditions | KirayNow",
  description:
    "Read the Terms and Conditions governing the use of KirayNow rental marketplace platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 mt-16">
      <div className="max-w-5xl mx-auto px-4 py-16">

        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Terms & Conditions
          </h1>
          <p className="mt-6 text-gray-600 max-w-3xl mx-auto">
            Please read these terms carefully before using KirayNow. By accessing
            or using our platform, you agree to be bound by these terms.
          </p>
        </div>

        {/* CONTENT */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 space-y-10 text-gray-700 leading-relaxed">

          {/* 1 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              1. About KirayNow
            </h2>
            <p>
              KirayNow is a rental marketplace platform that connects users with
              independent third-party vendors offering event rental services and
              products. We do not directly provide rental services.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              2. Platform Role & Responsibility
            </h2>
            <p>
              KirayNow acts solely as an intermediary platform. All bookings,
              pricing discussions, service execution, payments, and agreements
              occur directly between the user and the vendor.
            </p>
            <p className="mt-4">
              KirayNow is not responsible for service quality, delays,
              cancellations, disputes, damages, or any issues arising from
              vendor interactions.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              3. Vendor Verification
            </h2>
            <p>
              While we strive to list verified vendors, KirayNow does not
              guarantee the accuracy, completeness, or reliability of vendor
              information. Users are advised to conduct their own due diligence
              before finalizing any booking.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              4. Payments & Transactions
            </h2>
            <p>
              KirayNow does not process payments on behalf of vendors unless
              explicitly stated. Any financial transaction occurs directly
              between the user and the vendor.
            </p>
            <p className="mt-4">
              We are not liable for payment disputes, refunds, or financial
              disagreements.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              5. Cancellations & Refunds
            </h2>
            <p>
              Cancellation and refund policies are determined solely by the
              vendor. Users must confirm cancellation terms before booking.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              6. User Responsibilities
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate information when contacting vendors.</li>
              <li>Communicate clearly regarding service requirements.</li>
              <li>Verify vendor credentials and pricing before confirmation.</li>
              <li>Comply with local laws and venue regulations.</li>
            </ul>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              7. Intellectual Property
            </h2>
            <p>
              All content, branding, design elements, and intellectual property
              on KirayNow are owned by the platform and may not be copied,
              reproduced, or redistributed without permission.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              8. Limitation of Liability
            </h2>
            <p>
              KirayNow shall not be held liable for any direct, indirect,
              incidental, or consequential damages resulting from the use of
              the platform or vendor services.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              9. Modifications to Terms
            </h2>
            <p>
              We reserve the right to update or modify these Terms &
              Conditions at any time. Continued use of the platform constitutes
              acceptance of the revised terms.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              10. Contact Us
            </h2>
            <p>
              For any questions regarding these Terms & Conditions, please
              contact us at:
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
