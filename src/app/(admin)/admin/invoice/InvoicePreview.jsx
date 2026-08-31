"use client";

import {
  calculateInvoice,
  formatCurrency,
  formatDate,
} from "../../../../utils/invoice-utils";

export default function InvoicePreview({
  invoice,
  onClose,
  onEdit,
  onAbort,
}) {
  const totals = calculateInvoice(invoice);

  /*
   * ============================================================
   * PRINT
   * ============================================================
   *
   * IMPORTANT:
   *
   * We do NOT copy Tailwind CSS.
   *
   * We generate a completely standalone HTML document.
   *
   * Therefore:
   *
   * Tailwind loaded     -> irrelevant
   * Tailwind not loaded -> irrelevant
   *
   * Print document has its own CSS.
   */

  function handlePrint() {
    const printWindow = window.open(
      "",
      "_blank",
      "width=900,height=1000"
    );

    if (!printWindow) {
      alert(
        "Please allow pop-ups for KirayNow to print the invoice."
      );

      return;
    }

    const html = buildPrintDocument(
      invoice,
      totals
    );

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();

    /*
     * Wait for browser to render the document.
     */
    setTimeout(() => {
      try {
        printWindow.focus();
        printWindow.print();
      } catch (error) {
        console.error(
          "Print failed:",
          error
        );
      }
    }, 500);

    /*
     * Close after print dialog.
     */
    printWindow.onafterprint = () => {
      setTimeout(() => {
        try {
          printWindow.close();
        } catch (error) {}
      }, 100);
    };
  }

  /*
   * ============================================================
   * ABORT
   * ============================================================
   */

  function handleAbort() {
    const confirmed = window.confirm(
      `Are you sure you want to abort ${invoice.invoiceNumber}?\n\nThis invoice will be permanently removed from the local invoice list.`
    );

    if (!confirmed) {
      return;
    }

    onAbort(invoice.id);
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 p-3 sm:p-6">

      <div className="mx-auto max-w-5xl">

        {/* =====================================================
            ACTION BAR
        ====================================================== */}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-xl">

          <div>
            <p className="font-black text-slate-900">
              {invoice.invoiceNumber}
            </p>

            <p className="text-xs text-slate-500">
              Last updated{" "}
              {formatDate(
                invoice.updatedAt ||
                  invoice.createdAt
              )}
            </p>
          </div>


          <div className="flex flex-wrap gap-2">

            <button
              type="button"
              onClick={onEdit}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Edit
            </button>


            <button
              type="button"
              onClick={handlePrint}
              className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Print / Save PDF
            </button>


            <button
              type="button"
              onClick={handleAbort}
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100"
            >
              Abort
            </button>


            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Close
            </button>

          </div>
        </div>


        {/* =====================================================
            SCREEN PREVIEW

            Tailwind is used ONLY here.
        ====================================================== */}

        <div className="overflow-hidden rounded-sm bg-white text-slate-900 shadow-2xl">

          <ScreenInvoice
            invoice={invoice}
            totals={totals}
          />

        </div>

      </div>

    </div>
  );
}


/* =============================================================
   SCREEN INVOICE
============================================================= */

function ScreenInvoice({
  invoice,
  totals,
}) {
  return (
    <div className="bg-white">

      <div className="p-6 sm:p-10">

        {/* HEADER */}

        <div className="flex flex-col justify-between gap-8 border-b-2 border-slate-950 pb-8 sm:flex-row">

          <div>

            <div className="text-3xl font-black tracking-tight">
              KIRAYNOW
            </div>

            <p className="mt-1 text-sm font-medium text-slate-500">
              Rental & Event Solutions
            </p>

            <p className="mt-2 max-w-sm text-xs leading-5 text-slate-500">
              Professional event rental
              services for weddings,
              corporate events and
              special occasions.
            </p>

          </div>


          <div className="sm:text-right">

            {/* <p className="text-lg font-black">
              PROFORMA INVOICE
            </p> */}

            <div className="mt-4 space-y-1 text-sm">

              <p>
                <b>PI No:</b>{" "}
                {invoice.invoiceNumber}
              </p>

              <p>
                <b>Date:</b>{" "}
                {formatDate(
                  invoice.createdAt
                )}
              </p>

            </div>

            <ScreenStatus
              status={totals.status}
            />

          </div>

        </div>


        {/* CUSTOMER + EVENT */}

        <div className="grid border-b border-slate-200 md:grid-cols-2">

          <div className="border-b border-slate-200 py-3 md:border-b-0 md:border-r md:pr-8">

            <ScreenLabel>
              Bill To
            </ScreenLabel>

            <h2 className="text-lg font-bold">
              {invoice.customer?.name ||
                "-"}
            </h2>

            {invoice.customer?.company && (
              <p className="mt-1 text-sm font-semibold">
                {
                  invoice.customer
                    .company
                }
              </p>
            )}

            {invoice.customer?.address && (
              <p className="mt-3 max-w-sm whitespace-pre-line text-sm leading-5 text-slate-600">
                {
                  invoice.customer
                    .address
                }
              </p>
            )}

            {invoice.customer?.phone && (
              <p className="mt-3 text-sm">
                {
                  invoice.customer
                    .phone
                }
              </p>
            )}

            {invoice.customer?.email && (
              <p className="text-sm">
                {
                  invoice.customer
                    .email
                }
              </p>
            )}

            {invoice.customer?.gstin && (
              <p className="mt-3 text-sm font-bold">
                GSTIN:{" "}
                {
                  invoice.customer
                    .gstin
                }
              </p>
            )}

          </div>


          <div className="py-3 md:pl-8">

            <ScreenLabel>
              Event Details
            </ScreenLabel>

            <div className="space-y-2 text-sm">

              {invoice.eventDetails?.name && (
                <p>
                  <b>Event:</b>{" "}
                  {
                    invoice.eventDetails
                      .name
                  }
                </p>
              )}

              {invoice.eventDetails?.date && (
                <p>
                  <b>Event Date:</b>{" "}
                  {formatDate(
                    invoice.eventDetails
                      .date
                  )}
                </p>
              )}

              {invoice.eventDetails?.venue && (
                <p>
                  <b>Venue:</b>{" "}
                  {
                    invoice.eventDetails
                      .venue
                  }
                </p>
              )}

            </div>

          </div>

        </div>


        {/* ITEMS */}

        <div className="py-4 overflow-x-auto">

          <table className="w-full min-w-[650px] border-collapse text-sm">

            <thead>

              <tr className="border-b-2 border-slate-950">

                <th className="w-10 pb-3 text-left">
                  #
                </th>

                <th className="pb-3 text-left">
                  Description
                </th>

                <th className="w-20 pb-3 text-center">
                  Qty
                </th>

                <th className="w-32 pb-3 text-right">
                  Rate
                </th>

                <th className="w-36 pb-3 text-right">
                  Amount
                </th>

              </tr>

            </thead>


            <tbody>

              {invoice.items?.map(
                (item, index) => {

                  const quantity =
                    Number(
                      item.quantity
                    ) || 0;

                  const rate =
                    Number(
                      item.rate
                    ) || 0;

                  const amount =
                    quantity * rate;

                  return (
                    <tr
                      key={
                        item.id ||
                        index
                      }
                      className="border-b border-slate-200"
                    >

                      <td className="py-4 align-top">
                        {index + 1}
                      </td>

                      <td className="py-4 align-top font-medium">
                        {
                          item.description
                        }
                      </td>

                      <td className="py-4 text-center align-top">
                        {quantity}
                      </td>

                      <td className="py-4 text-right align-top">
                        {formatCurrency(
                          rate
                        )}
                      </td>

                      <td className="py-4 text-right align-top font-bold">
                        {formatCurrency(
                          amount
                        )}
                      </td>

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>

        </div>


        {/* TOTALS */}

        <div className="flex justify-end border-b border-slate-200 pb-8">

          <div className="w-full max-w-sm space-y-3 text-sm">

            <ScreenSummary
              label="Subtotal"
              value={formatCurrency(
                totals.subtotal
              )}
            />

            {invoice.gstEnabled && (
              <ScreenSummary
                label={`GST (${invoice.gstRate}%)`}
                value={formatCurrency(
                  totals.gstAmount
                )}
              />
            )}

            <div className="border-t-2 border-slate-950 pt-3">

              <ScreenSummary
                label="Grand Total"
                value={formatCurrency(
                  totals.grandTotal
                )}
                bold
              />

            </div>

            <ScreenSummary
              label="Advance / Paid"
              value={formatCurrency(
                totals.advancePaid
              )}
            />

            <ScreenSummary
              label="Balance Due"
              value={formatCurrency(
                totals.balance
              )}
              highlight
            />

          </div>

        </div>


        {/* PAYMENT + TAX */}

        <div className="grid gap-8 border-b border-slate-200 py-8 md:grid-cols-2">

          <div>

            <ScreenLabel>
              Payment Status
            </ScreenLabel>

            <ScreenStatus
              status={totals.status}
              large
            />

            <p className="mt-3 text-xs leading-5 text-slate-500">
              {getPaymentDescription(
                totals.status
              )}
            </p>

          </div>


          <div>

            <ScreenLabel>
              Tax Type
            </ScreenLabel>

            <p className="text-sm font-bold">
              {invoice.gstEnabled
                ? `GST @ ${invoice.gstRate}%`
                : "Non-GST"}
            </p>

          </div>

        </div>


        {/* TERMS */}

        <div className="py-4">

          <ScreenLabel>
            Terms & Conditions
          </ScreenLabel>

          {Array.isArray(
            invoice.terms
          ) &&
          invoice.terms.length > 0 ? (

            <ol className="space-y-2 text-xs leading-5 text-slate-600">

              {invoice.terms.map(
                (
                  term,
                  index
                ) => (
                  <li
                    key={index}
                  >
                    <span className="font-semibold text-slate-700">
                      {index + 1}.
                    </span>{" "}
                    {term}
                  </li>
                )
              )}

            </ol>

          ) : (

            <p className="text-xs text-slate-400">
              No additional terms
              and conditions
              specified.
            </p>

          )}

        </div>


        {/* IMPORTANT */}

        <div className="border-t border-slate-200 py-8">

          <div className="grid gap-8 md:grid-cols-2">

            <div>

              <ScreenLabel>
                Important
              </ScreenLabel>

              <p className="text-xs leading-5 text-slate-500">
                This document is a
                Proforma Invoice
                generated electronically
                by KirayNow. It is not a
                Tax Invoice.
              </p>

            </div>


            <div>

              <ScreenLabel>
                Payment Note
              </ScreenLabel>

              <p className="text-xs leading-5 text-slate-500">
                Please ensure that all
                payments are made against
                the agreed booking terms.
              </p>

            </div>

          </div>

        </div>


        {/* FOOTER */}

        <div className="border-t border-slate-200 pt-6 text-center">

          <p className="text-xs text-slate-400">
            Thank you for choosing
            KirayNow.
          </p>

          <p className="mt-1 text-[10px] text-slate-400">
            Computer-generated
            document • No signature
            required
          </p>

        </div>

      </div>

    </div>
  );
}


/* =============================================================
   STANDALONE PRINT DOCUMENT
============================================================= */

function buildPrintDocument(
  invoice,
  totals
) {
  const items =
    Array.isArray(
      invoice.items
    )
      ? invoice.items
      : [];

  const terms =
    Array.isArray(
      invoice.terms
    )
      ? invoice.terms
      : [];

  const invoiceNumber =
    escapeHtml(
      invoice.invoiceNumber ||
        ""
    );

  const customer =
    invoice.customer || {};

  const eventDetails =
    invoice.eventDetails || {};

  const gstEnabled =
    Boolean(
      invoice.gstEnabled
    );

  const gstRate =
    Number(
      invoice.gstRate
    ) || 0;

  const status =
    totals.status || "PENDING";

  const statusClass =
    getPrintStatusClass(
      status
    );

  const statusText =
    escapeHtml(status);


  /*
   * ==========================================================
   * ITEMS HTML
   * ==========================================================
   */

  const itemsHtml =
    items.length > 0
      ? items
          .map(
            (item, index) => {
              const quantity =
                Number(
                  item.quantity
                ) || 0;

              const rate =
                Number(
                  item.rate
                ) || 0;

              const amount =
                quantity * rate;

              return `
                <tr class="item-row">

                  <td class="col-number">
                    ${index + 1}
                  </td>

                  <td class="col-description">
                    ${escapeHtml(
                      item.description ||
                        ""
                    )}
                  </td>

                  <td class="col-qty">
                    ${quantity}
                  </td>

                  <td class="col-rate">
                    ${escapeHtml(
                      formatCurrency(
                        rate
                      )
                    )}
                  </td>

                  <td class="col-amount">
                    ${escapeHtml(
                      formatCurrency(
                        amount
                      )
                    )}
                  </td>

                </tr>
              `;
            }
          )
          .join("")
      : `
          <tr>
            <td
              colspan="5"
              class="empty-items"
            >
              No items added.
            </td>
          </tr>
        `;


  /*
   * ==========================================================
   * TERMS HTML
   * ==========================================================
   */

  const termsHtml =
    terms.length > 0
      ? `
          <ol class="terms-list">
            ${terms
              .map(
                (
                  term,
                  index
                ) => `
                  <li class="term-item">
                    

                    <span>
                      ${escapeHtml(
                        term
                      )}
                    </span>
                  </li>
                `
              )
              .join("")}
          </ol>
        `
      : `
          <p class="empty-terms">
            No additional terms and
            conditions specified.
          </p>
        `;


  /*
   * ==========================================================
   * GST HTML
   * ==========================================================
   */

  const gstRow =
    gstEnabled
      ? `
          <div class="summary-row">
            <span>
              GST (${gstRate}%)
            </span>

            <strong>
              ${escapeHtml(
                formatCurrency(
                  totals.gstAmount
                )
              )}
            </strong>
          </div>
        `
      : "";


  /*
   * ==========================================================
   * PAYMENT DESCRIPTION
   * ==========================================================
   */

  const paymentDescription =
    escapeHtml(
      getPaymentDescription(
        status
      )
    );


  /*
   * ==========================================================
   * COMPLETE PRINT DOCUMENT
   * ==========================================================
   */

  return `
<!DOCTYPE html>

<html lang="en">

<head>

  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>
    ${invoiceNumber}
  </title>


  <style>

    /*
     * ========================================================
     * PAGE
     * ========================================================
     */

    @page {
      size: A4;
      margin: 0;
    }


    /*
     * ========================================================
     * RESET
     * ========================================================
     */

    * {
      box-sizing: border-box;
    }


    html,
    body {
      margin: 0;
      padding: 0;

      width: 100%;

      background: #ffffff;

      color: #0f172a;

      font-family:
        Arial,
        Helvetica,
        sans-serif;

      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }


    body {
      font-size: 10.5px;
      line-height: 1.45;
    }


    /*
     * ========================================================
     * INVOICE
     * ========================================================
     */

    .invoice {
      width: 210mm;

      margin: 0 auto;

      background: #ffffff;

      padding: 12mm;

      overflow: visible;
    }


    /*
     * IMPORTANT:
     *
     * Do NOT set fixed height.
     *
     * Browser is allowed to continue
     * onto page 2, 3, 4...
     */

    .invoice-content {
      width: 100%;
    }


    /*
     * ========================================================
     * HEADER
     * ========================================================
     */

    .header {
      display: flex;

      justify-content: space-between;

      gap: 20mm;

      padding-bottom: 7mm;

      border-bottom: 2px solid #0f172a;

      page-break-inside: avoid;

      break-inside: avoid;
    }


    .brand {
      flex: 1;
    }


    .brand-name {
      margin: 0;

      font-size: 25px;

      line-height: 1;

      font-weight: 900;

      letter-spacing: -0.5px;
    }


    .brand-subtitle {
      margin-top: 2px;

      color: #64748b;

      font-size: 10px;

      font-weight: 600;
    }


    .brand-description {
      max-width: 72mm;

      margin-top: 13px;

      color: #64748b;

      font-size: 8.5px;

      line-height: 1.6;
    }


    .invoice-meta {
      min-width: 60mm;

      text-align: right;
    }


    .invoice-title {
      margin: 0;

      font-size: 18px;

      line-height: 1.2;

      font-weight: 900;
    }


    .meta-row {
      margin-top: 4px;

      font-size: 9.5px;
    }


    .status {
      display: inline-block;

      margin-top: 8px;

      padding: 3px 9px;

      border-radius: 999px;

      font-size: 8px;

      font-weight: 900;
    }


    .status-paid {
      background: #d1fae5;
      color: #047857;
    }


    .status-partial {
      background: #fef3c7;
      color: #b45309;
    }


    .status-pending {
      background: #fee2e2;
      color: #b91c1c;
    }


    /*
     * ========================================================
     * TWO COLUMN
     * ========================================================
     */

    .two-column {
      display: grid;

      grid-template-columns: 1fr 1fr;

      width: 100%;
    }


    .two-column > .column {
      min-width: 0;
    }


    .bill-to {
      padding: 4mm 8mm 4mm 0;

      border-right: 1px solid #e2e8f0;
    }


    .event-details {
      padding: 4mm 0 4mm 8mm;
    }


    /*
     * ========================================================
     * LABEL
     * ========================================================
     */

    .label {
      margin-bottom: 2mm;

      color: #94a3b8;

      font-size: 7px;

      font-weight: 900;

      letter-spacing: 1.5px;

      text-transform: uppercase;
    }


    /*
     * ========================================================
     * CUSTOMER
     * ========================================================
     */

    .customer-name {
      margin: 0;

      font-size: 13px;

      font-weight: 800;
    }


    .customer-company {
      margin-top: 2px;

      font-size: 9.5px;

      font-weight: 700;
    }


    .customer-address {
      max-width: 80mm;

      margin-top: 2px;

      color: #475569;

      font-size: 9px;

      line-height: 1;

      white-space: pre-line;
    }


    .customer-contact {
      margin-top: 6px;

      font-size: 9px;

      line-height: 1.6;
    }


    .customer-gstin {
      margin-top: 6px;

      font-size: 9px;

      font-weight: 800;
    }


    .event-row {
      margin-bottom: 5px;

      font-size: 9.5px;
    }


    /*
     * ========================================================
     * ITEMS
     * ========================================================
     */

    .items-section {
      padding: 2mm 0;
    }


    .items-table {
      width: 100%;

      border-collapse: collapse;

      table-layout: fixed;

      font-size: 9px;
    }


    .items-table thead {
      display: table-header-group;
    }


    .items-table tr {
      page-break-inside: avoid;

      break-inside: avoid;
    }


    .items-table th {
      padding-bottom: 3mm;

      border-bottom: 2px solid #0f172a;

      font-size: 8px;

      font-weight: 900;

      text-align: left;
    }


    .items-table td {
      padding: 3.5mm 0;

      border-bottom: 1px solid #e2e8f0;

      vertical-align: top;

      overflow-wrap: anywhere;
    }


    .col-number {
      width: 8mm;

      text-align: left;
    }


    .col-description {
      width: auto;

      padding-right: 5mm !important;
    }


    .col-qty {
      width: 15mm;

      text-align: center !important;
    }


    .col-rate {
      width: 32mm;

      text-align: right !important;
    }


    .col-amount {
      width: 35mm;

      text-align: right !important;

      font-weight: 800;
    }


    .empty-items {
      padding: 8mm 0;

      color: #94a3b8;

      text-align: center;
    }


    /*
     * ========================================================
     * TOTALS
     * ========================================================
     */

    .totals-section {
      display: flex;

      justify-content: flex-end;

      padding: 6mm 0 7mm;

      border-bottom: 1px solid #e2e8f0;

      page-break-inside: avoid;

      break-inside: avoid;
    }


    .totals-box {
      width: 72mm;
    }


    .summary-row {
      display: flex;

      justify-content: space-between;

      gap: 10mm;

      margin-bottom: 2.5mm;

      font-size: 9.5px;
    }


    .grand-total {
      padding-top: 3mm;

      margin-top: 3mm;

      border-top: 2px solid #0f172a;

      font-size: 13px;

      font-weight: 900;
    }


    .balance {
      color: #ea580c;

      font-weight: 800;
    }


    /*
     * ========================================================
     * PAYMENT
     * ========================================================
     */

    .payment-section {
      padding: 4mm 0;

      border-bottom: 1px solid #e2e8f0;

      page-break-inside: avoid;

      break-inside: avoid;
    }


    .payment-column {
      min-width: 0;
    }


    .payment-status {
      display: inline-block;

      margin-top: 2px;

      padding: 4px 10px;

      border-radius: 999px;

      font-size: 9px;

      font-weight: 900;
    }


    .payment-description {
      max-width: 80mm;

      margin-top: 5px;

      color: #64748b;

      font-size: 8.5px;

      line-height: 1.5;
    }


    .tax-type {
      font-size: 9.5px;

      font-weight: 800;
    }


    /*
     * ========================================================
     * TERMS
     * ========================================================
     *
     * NO fixed height.
     *
     * Browser can move this section
     * to the next page naturally.
     */

    .terms-section {
      padding: 7mm 0;

      page-break-inside: auto;

      break-inside: auto;
    }


    .terms-list {
      margin: 0;

      padding-left: 6mm;

      color: #475569;

      font-size: 8.5px;

      line-height: 1.6;
    }


    .term-item {
      margin-bottom: 2mm;

      padding-left: 1mm;

      page-break-inside: avoid;

      break-inside: avoid;
    }


    .term-number {
      color: #334155;

      font-weight: 800;
    }


    .empty-terms {
      color: #94a3b8;

      font-size: 8.5px;
    }


    /*
     * ========================================================
     * IMPORTANT
     * ========================================================
     */

    .important-section {
      padding: 7mm 0;

      border-top: 1px solid #e2e8f0;

      page-break-inside: avoid;

      break-inside: avoid;
    }


    .important-text {
      color: #64748b;

      font-size: 8.5px;

      line-height: 1.6;
    }


    /*
     * ========================================================
     * FOOTER
     * ========================================================
     */

    .footer {
      padding-top: 5mm;

      border-top: 1px solid #e2e8f0;

      text-align: center;

      page-break-inside: avoid;

      break-inside: avoid;
    }


    .footer-main {
      color: #94a3b8;

      font-size: 8.5px;
    }


    .footer-small {
      margin-top: 1mm;

      color: #94a3b8;

      font-size: 7px;
    }


    /*
     * ========================================================
     * PRINT
     * ========================================================
     */

    @media print {

      html,
      body {
        width: 210mm;

        margin: 0;

        padding: 0;
      }


      .invoice {
        width: 210mm;

        margin: 0;

        padding: 12mm;
      }


      /*
       * Do NOT force one page.
       */

      .invoice-content {
        width: 100%;
      }

    }


  </style>

</head>


<body>

  <main class="invoice">

    <div class="invoice-content">


      <!-- ==================================================
           HEADER
      =================================================== -->

      <header class="header">

        <div class="brand">

          <h1 class="brand-name">
            KIRAYNOW
          </h1>

          <div class="brand-subtitle">
            Rental & Event Solutions
          </div>

          <div class="brand-description">
            Professional event rental
            services for weddings,
            corporate events and
            special occasions.
          </div>

        </div>


        <div class="invoice-meta">

      

          <div class="meta-row">
            <strong>PI No:</strong>
            ${invoiceNumber}
          </div>

          <div class="meta-row">
            <strong>Date:</strong>
            ${escapeHtml(
              formatDate(
                invoice.createdAt
              )
            )}
          </div>

          <span
            class="status ${statusClass}"
          >
            ${statusText}
          </span>

        </div>

      </header>


      <!-- ==================================================
           CUSTOMER + EVENT
      =================================================== -->

      <section class="two-column">

        <div class="column bill-to">

          <div class="label">
            Bill To
          </div>

          <h3 class="customer-name">
            ${escapeHtml(
              customer.name ||
                "-"
            )}
          </h3>

          ${
            customer.company
              ? `
                <div class="customer-company">
                  ${escapeHtml(
                    customer.company
                  )}
                </div>
              `
              : ""
          }


          ${
            customer.address
              ? `
                <div class="customer-address">
                  ${escapeHtml(
                    customer.address
                  )}
                </div>
              `
              : ""
          }


          ${
            customer.phone
              ? `
                <div class="customer-contact">
                  ${escapeHtml(
                    customer.phone
                  )}
                </div>
              `
              : ""
          }


          ${
            customer.email
              ? `
                <div class="customer-contact">
                  ${escapeHtml(
                    customer.email
                  )}
                </div>
              `
              : ""
          }


          ${
            customer.gstin
              ? `
                <div class="customer-gstin">
                  GSTIN:
                  ${escapeHtml(
                    customer.gstin
                  )}
                </div>
              `
              : ""
          }

        </div>


        <div class="column event-details">

          <div class="label">
            Event Details
          </div>


          ${
            eventDetails.name
              ? `
                <div class="event-row">
                  <strong>Event:</strong>
                  ${escapeHtml(
                    eventDetails.name
                  )}
                </div>
              `
              : ""
          }


          ${
            eventDetails.date
              ? `
                <div class="event-row">
                  <strong>Event Date:</strong>
                  ${escapeHtml(
                    formatDate(
                      eventDetails.date
                    )
                  )}
                </div>
              `
              : ""
          }


          ${
            eventDetails.venue
              ? `
                <div class="event-row">
                  <strong>Venue:</strong>
                  ${escapeHtml(
                    eventDetails.venue
                  )}
                </div>
              `
              : ""
          }

        </div>

      </section>


      <!-- ==================================================
           ITEMS
      =================================================== -->

      <section class="items-section">

        <table class="items-table">

          <thead>

            <tr>

              <th class="col-number">
                #
              </th>

              <th class="col-description">
                Description
              </th>

              <th class="col-qty">
                Qty
              </th>

              <th class="col-rate">
                Rate
              </th>

              <th class="col-amount">
                Amount
              </th>

            </tr>

          </thead>


          <tbody>

            ${itemsHtml}

          </tbody>

        </table>

      </section>


      <!-- ==================================================
           TOTALS
      =================================================== -->

      <section class="totals-section">

        <div class="totals-box">

          <div class="summary-row">

            <span>
              Subtotal
            </span>

            <strong>
              ${escapeHtml(
                formatCurrency(
                  totals.subtotal
                )
              )}
            </strong>

          </div>


          ${gstRow}


          <div class="summary-row grand-total">

            <span>
              Grand Total
            </span>

            <strong>
              ${escapeHtml(
                formatCurrency(
                  totals.grandTotal
                )
              )}
            </strong>

          </div>


          <div class="summary-row">

            <span>
              Advance / Paid
            </span>

            <strong>
              ${escapeHtml(
                formatCurrency(
                  totals.advancePaid
                )
              )}
            </strong>

          </div>


          <div class="summary-row balance">

            <span>
              Balance Due
            </span>

            <strong>
              ${escapeHtml(
                formatCurrency(
                  totals.balance
                )
              )}
            </strong>

          </div>

        </div>

      </section>


      <!-- ==================================================
           PAYMENT + TAX
      =================================================== -->

      <section class="payment-section">

        <div class="two-column">

          <div class="payment-column">

            <div class="label">
              Payment Status
            </div>

            <span
              class="payment-status ${statusClass}"
            >
              ${statusText}
            </span>

            <div class="payment-description">
              ${paymentDescription}
            </div>

          </div>


          <div class="payment-column">

            <div class="label">
              Tax Type
            </div>

            <div class="tax-type">
              ${
                gstEnabled
                  ? `GST @ ${gstRate}%`
                  : "Non-GST"
              }
            </div>

          </div>

        </div>

      </section>


      <!-- ==================================================
           TERMS & CONDITIONS
      =================================================== -->

      <section class="terms-section">

        <div class="label">
          Terms & Conditions
        </div>

        ${termsHtml}

      </section>


      <!-- ==================================================
           IMPORTANT
      =================================================== -->

      <section class="important-section">

        <div class="two-column">

          <div>

            <div class="label">
              Important
            </div>

            <div class="important-text">
              This document is a
              Proforma Invoice generated
              electronically by KirayNow.
              It is not a Tax Invoice.
            </div>

          </div>


          <div>

            <div class="label">
              Payment Note
            </div>

            <div class="important-text">
              Please ensure that all
              payments are made against
              the agreed booking terms.
            </div>

          </div>

        </div>

      </section>


      <!-- ==================================================
           FOOTER
      =================================================== -->

      <footer class="footer">

        <div class="footer-main">
          Thank you for choosing
          KirayNow.
        </div>

        <div class="footer-small">
          Computer-generated document
          • No signature required
        </div>

      </footer>


    </div>

  </main>

</body>

</html>
  `;
}


/* =============================================================
   SCREEN HELPERS
============================================================= */

function ScreenLabel({
  children,
}) {
  return (
    <p className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
      {children}
    </p>
  );
}


function ScreenSummary({
  label,
  value,
  bold = false,
  highlight = false,
}) {
  return (
    <div
      className={`flex justify-between ${
        bold
          ? "text-lg font-black"
          : ""
      } ${
        highlight
          ? "text-orange-600"
          : ""
      }`}
    >
      <span>{label}</span>

      <span>{value}</span>
    </div>
  );
}


function ScreenStatus({
  status,
  large = false,
}) {
  let classes =
    "bg-red-100 text-red-700";

  if (status === "PAID") {
    classes =
      "bg-emerald-100 text-emerald-700";
  }

  if (
    status ===
    "PARTIALLY PAID"
  ) {
    classes =
      "bg-amber-100 text-amber-700";
  }

  return (
    <span
      className={`mt-3 inline-flex rounded-full px-3 py-1 font-black ${classes} ${
        large
          ? "text-sm"
          : "text-[10px]"
      }`}
    >
      {status}
    </span>
  );
}


/* =============================================================
   STATUS HELPERS
============================================================= */

function getPrintStatusClass(
  status
) {
  if (status === "PAID") {
    return "status-paid";
  }

  if (
    status ===
    "PARTIALLY PAID"
  ) {
    return "status-partial";
  }

  return "status-pending";
}


function getPaymentDescription(
  status
) {
  if (status === "PAID") {
    return "Payment has been received in full.";
  }

  if (
    status ===
    "PARTIALLY PAID"
  ) {
    return "Partial payment has been received. The remaining balance is due as agreed.";
  }

  return "Payment is currently pending.";
}


/* =============================================================
   HTML ESCAPE
============================================================= */

function escapeHtml(
  value
) {
  return String(value ?? "")
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );
}