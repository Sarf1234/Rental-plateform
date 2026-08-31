"use client";

import {
  Download,
  Printer,
  XCircle
} from "lucide-react";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const money = (n) =>
  `₹${Number(n || 0).toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  )}`;

function formatDate(value) {
  if (!value) return "-";

  const [year, month, day] =
    value.split("-");

  return `${day}/${month}/${year}`;
}

function amountWords(number) {
  const n = Math.round(
    Number(number || 0)
  );

  if (!n) return "Zero";

  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen"
  ];

  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety"
  ];

  function twoDigit(num) {
    if (num < 20)
      return ones[num];

    return (
      tens[Math.floor(num / 10)] +
      (num % 10
        ? ` ${ones[num % 10]}`
        : "")
    );
  }

  function threeDigit(num) {
    if (num < 100)
      return twoDigit(num);

    return (
      `${ones[Math.floor(num / 100)]} Hundred` +
      (num % 100
        ? ` ${twoDigit(num % 100)}`
        : "")
    );
  }

  let x = n;
  let result = "";

  if (Math.floor(x / 10000000)) {
    result +=
      `${twoDigit(
        Math.floor(x / 10000000)
      )} Crore `;

    x %= 10000000;
  }

  if (Math.floor(x / 100000)) {
    result +=
      `${twoDigit(
        Math.floor(x / 100000)
      )} Lakh `;

    x %= 100000;
  }

  if (Math.floor(x / 1000)) {
    result +=
      `${twoDigit(
        Math.floor(x / 1000)
      )} Thousand `;

    x %= 1000;
  }

  if (x) {
    result += threeDigit(x);
  }

  return result.trim();
}

export default function InvoicePreview({
  invoice,
  settings,
  totals,
  onAbort
}) {
  const downloadPDF = async () => {
    const pages =
      document.querySelectorAll(
        ".kn-pdf-page"
      );

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    for (
      let index = 0;
      index < pages.length;
      index++
    ) {
      const canvas =
        await html2canvas(
          pages[index],
          {
            scale: 2,
            backgroundColor:
              "#ffffff",
            useCORS: true
          }
        );

      const image =
        canvas.toDataURL(
          "image/jpeg",
          0.95
        );

      if (index > 0) {
        pdf.addPage();
      }

      pdf.addImage(
        image,
        "JPEG",
        0,
        0,
        210,
        297
      );
    }

    pdf.save(
      `${invoice.id}.pdf`
    );
  };

  return (
    <section className="kn-preview">

      <div className="kn-preview-toolbar">

        <div>
          <strong>
            Live Preview
          </strong>

          <small>
            2-page A4 invoice
          </small>
        </div>

        <div className="kn-actions">

          <button
            className="kn-btn kn-btn-light"
            onClick={() =>
              window.print()
            }
          >
            <Printer size={16} />
            Print
          </button>

          <button
            className="kn-btn kn-btn-dark"
            onClick={downloadPDF}
          >
            <Download size={16} />
            PDF
          </button>

          <button
            className="kn-btn kn-btn-danger"
            onClick={() =>
              onAbort(invoice.id)
            }
          >
            <XCircle size={16} />
            Abort
          </button>

        </div>

      </div>

      <div className="kn-paper-stage">

        {/* PAGE 1 */}

        <div className="kn-pdf-page kn-paper">

          <div className="kn-paper-header">

            <div className="kn-print-brand">

              <div className="kn-print-logo">
                K
              </div>

              <div>
                <h1>
                  {settings.businessName ||
                    "KirayNow"}
                </h1>

                <p>
                  {settings.tagline}
                </p>

                <small>
                  {settings.address}
                </small>

                <small>
                  {settings.phone}
                  {settings.phone &&
                    settings.email
                    ? " · "
                    : ""}
                  {settings.email}
                </small>
              </div>

            </div>

            <div className="kn-print-title">

              <strong>
                PROFORMA INVOICE
              </strong>

              <b>
                {invoice.id}
              </b>

              <span>
                Date:{" "}
                {formatDate(
                  invoice.invoiceDate
                )}
              </span>

            </div>

          </div>

          <div className="kn-paper-line" />

          <div className="kn-bill-grid">

            <div className="kn-bill-box">

              <label>
                BILL FROM
              </label>

              <strong>
                {settings.businessName ||
                  "KirayNow"}
              </strong>

              <span>
                {settings.address}
              </span>

              {settings.gstin && (
                <span>
                  GSTIN:{" "}
                  {settings.gstin}
                </span>
              )}

              {settings.pan && (
                <span>
                  PAN: {settings.pan}
                </span>
              )}

            </div>

            <div className="kn-bill-box">

              <label>
                BILL TO
              </label>

              <strong>
                {invoice.customer
                  .company ||
                  "Customer Name"}
              </strong>

              {invoice.customer
                .contact && (
                <span>
                  Attn:{" "}
                  {invoice.customer.contact}
                </span>
              )}

              <span>
                {invoice.customer.address}
              </span>

              {invoice.customer.phone && (
                <span>
                  {invoice.customer.phone}
                </span>
              )}

              {invoice.customer.email && (
                <span>
                  {invoice.customer.email}
                </span>
              )}

              {invoice.gstEnabled &&
                invoice.customer
                  .gstin && (
                  <span>
                    GSTIN:{" "}
                    {
                      invoice.customer
                        .gstin
                    }
                  </span>
                )}

            </div>

          </div>

          <div className="kn-event-strip">

            {invoice.event.name && (
              <div>
                <label>
                  EVENT
                </label>

                <b>
                  {invoice.event.name}
                </b>
              </div>
            )}

            {invoice.event.date && (
              <div>
                <label>
                  EVENT DATE
                </label>

                <b>
                  {formatDate(
                    invoice.event.date
                  )}
                </b>
              </div>
            )}

            {invoice.event.venue && (
              <div>
                <label>
                  VENUE
                </label>

                <b>
                  {invoice.event.venue}
                </b>
              </div>
            )}

            {invoice.event.reference && (
              <div>
                <label>
                  REFERENCE
                </label>

                <b>
                  {invoice.event.reference}
                </b>
              </div>
            )}

          </div>

          <table className="kn-invoice-table">

            <thead>

              <tr>
                <th>#</th>
                <th>Description</th>

                {invoice.gstEnabled && (
                  <th>
                    HSN/SAC
                  </th>
                )}

                <th>
                  Qty
                </th>

                <th>
                  Rate
                </th>

                <th>
                  Discount
                </th>

                <th>
                  Amount
                </th>
              </tr>

            </thead>

            <tbody>

              {invoice.items.map(
                (item, index) => (
                  <tr key={item.id}>

                    <td>
                      {index + 1}
                    </td>

                    <td>
                      {item.description ||
                        "Item"}
                    </td>

                    {invoice.gstEnabled && (
                      <td>
                        {item.hsnSac ||
                          "-"}
                      </td>
                    )}

                    <td>
                      {item.qty}
                    </td>

                    <td>
                      {money(
                        item.rate
                      )}
                    </td>

                    <td>
                      {money(
                        item.discount
                      )}
                    </td>

                    <td>
                      {money(
                        item.qty *
                          item.rate -
                          item.discount
                      )}
                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

          <div className="kn-paper-bottom">

            <div className="kn-words">

              <label>
                AMOUNT IN WORDS
              </label>

              <strong>
                Indian Rupees{" "}
                {amountWords(
                  totals?.total
                )}{" "}
                Only
              </strong>

              {invoice.notes && (
                <>
                  <label className="kn-note-label">
                    NOTES
                  </label>

                  <p>
                    {invoice.notes}
                  </p>
                </>
              )}

            </div>

            <div className="kn-summary">

              <div>
                <span>
                  Subtotal
                </span>

                <b>
                  {money(
                    totals?.subtotal
                  )}
                </b>
              </div>

              <div>
                <span>
                  Discount
                </span>

                <b>
                  -{" "}
                  {money(
                    totals?.discount
                  )}
                </b>
              </div>

              <div>
                <span>
                  Taxable Amount
                </span>

                <b>
                  {money(
                    totals?.taxable
                  )}
                </b>
              </div>

              {invoice.gstEnabled &&
                invoice.taxType ===
                  "CGST_SGST" && (
                  <>
                    <div>
                      <span>
                        CGST @{" "}
                        {invoice.gstRate /
                          2}
                        %
                      </span>

                      <b>
                        {money(
                          totals?.cgst
                        )}
                      </b>
                    </div>

                    <div>
                      <span>
                        SGST @{" "}
                        {invoice.gstRate /
                          2}
                        %
                      </span>

                      <b>
                        {money(
                          totals?.sgst
                        )}
                      </b>
                    </div>
                  </>
                )}

              {invoice.gstEnabled &&
                invoice.taxType ===
                  "IGST" && (
                  <div>
                    <span>
                      IGST @{" "}
                      {invoice.gstRate}%
                    </span>

                    <b>
                      {money(
                        totals?.igst
                      )}
                    </b>
                  </div>
                )}

              <div className="kn-grand">
                <span>
                  TOTAL
                </span>

                <b>
                  {money(
                    totals?.total
                  )}
                </b>
              </div>

            </div>

          </div>

          <div className="kn-payment-box">

            <div>
              <label>
                PAYMENT STATUS
              </label>

              <strong>
                {totals?.paymentStatus}
              </strong>
            </div>

            <div>
              <label>
                PAID
              </label>

              <strong>
                {money(
                  totals?.paid
                )}
              </strong>
            </div>

            <div>
              <label>
                BALANCE
              </label>

              <strong>
                {money(
                  totals?.balance
                )}
              </strong>
            </div>

            <div>
              <label>
                PAYMENT MODE
              </label>

              <strong>
                {invoice.paymentMode}
              </strong>
            </div>

          </div>

          <div className="kn-paper-footer">

            <span>
              {settings.footer}
            </span>

            <span>
              Page 1 of 2
            </span>

          </div>

        </div>

        {/* PAGE 2 */}

        <div className="kn-pdf-page kn-paper">

          <div className="kn-paper-header">

            <div className="kn-print-brand">

              <div className="kn-print-logo">
                K
              </div>

              <div>
                <h1>
                  {settings.businessName ||
                    "KirayNow"}
                </h1>

                <p>
                  {settings.tagline}
                </p>
              </div>

            </div>

            <div className="kn-print-title">

              <strong>
                TERMS &
                CONDITIONS
              </strong>

              <b>
                {invoice.id}
              </b>

            </div>

          </div>

          <div className="kn-paper-line" />

          <div className="kn-terms">

            <h2>
              Terms & Conditions
            </h2>

            <div className="kn-terms-text">
              {invoice.terms}
            </div>

            {(invoice.event
              .deliveryDate ||
              invoice.event
                .pickupDate) && (
              <div className="kn-info-box">

                <h3>
                  Rental Schedule
                </h3>

                {invoice.event
                  .deliveryDate && (
                  <div>
                    <span>
                      Delivery Date
                    </span>

                    <b>
                      {formatDate(
                        invoice.event
                          .deliveryDate
                      )}
                    </b>
                  </div>
                )}

                {invoice.event
                  .pickupDate && (
                  <div>
                    <span>
                      Pickup Date
                    </span>

                    <b>
                      {formatDate(
                        invoice.event
                          .pickupDate
                      )}
                    </b>
                  </div>
                )}

              </div>
            )}

            {(settings.bankName ||
              settings.accountNumber ||
              settings.ifsc ||
              settings.upi) && (
              <div className="kn-info-box">

                <h3>
                  Payment Details
                </h3>

                {settings.bankName && (
                  <div>
                    <span>
                      Bank
                    </span>

                    <b>
                      {settings.bankName}
                    </b>
                  </div>
                )}

                {settings.accountNumber && (
                  <div>
                    <span>
                      Account No.
                    </span>

                    <b>
                      {
                        settings.accountNumber
                      }
                    </b>
                  </div>
                )}

                {settings.ifsc && (
                  <div>
                    <span>
                      IFSC
                    </span>

                    <b>
                      {settings.ifsc}
                    </b>
                  </div>
                )}

                {settings.upi && (
                  <div>
                    <span>
                      UPI
                    </span>

                    <b>
                      {settings.upi}
                    </b>
                  </div>
                )}

              </div>
            )}

            <div className="kn-signatures">

              <div>
                <div className="kn-sign-line" />

                <span>
                  Customer /
                  Authorized
                  Representative
                </span>
              </div>

              <div>
                <div className="kn-sign-line" />

                <span>
                  Authorized
                  Signatory —{" "}
                  {
                    settings.businessName
                  }
                </span>
              </div>

            </div>

          </div>

          <div className="kn-paper-footer">

            <span>
              {settings.footer}
            </span>

            <span>
              Page 2 of 2
            </span>

          </div>

        </div>

      </div>

    </section>
  );
}