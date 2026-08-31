"use client";

import {
  Plus,
  Trash2,
  Save,
  Eye
} from "lucide-react";

const money = (n) =>
  `₹${Number(n || 0).toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  )}`;

export default function InvoiceEditor({
  invoice,
  setInvoice,
  totals,
  onSave,
  onPreview,
  onNew
}) {
  const update = (key, value) => {
    setInvoice({
      ...invoice,
      [key]: value
    });
  };

  const updateCustomer = (key, value) => {
    setInvoice({
      ...invoice,
      customer: {
        ...invoice.customer,
        [key]: value
      }
    });
  };

  const updateEvent = (key, value) => {
    setInvoice({
      ...invoice,
      event: {
        ...invoice.event,
        [key]: value
      }
    });
  };

  const updateItem = (
    id,
    key,
    value
  ) => {
    setInvoice({
      ...invoice,
      items: invoice.items.map(
        (item) =>
          item.id === id
            ? {
                ...item,
                [key]: value
              }
            : item
      )
    });
  };

  const addItem = () => {
    setInvoice({
      ...invoice,
      items: [
        ...invoice.items,
        {
          id: crypto.randomUUID(),
          description: "",
          hsnSac: "",
          qty: 1,
          rate: 0,
          discount: 0
        }
      ]
    });
  };

  const removeItem = (id) => {
    if (invoice.items.length === 1)
      return;

    setInvoice({
      ...invoice,
      items: invoice.items.filter(
        (item) => item.id !== id
      )
    });
  };

  return (
    <section className="kn-editor">

      <div className="kn-editor-title">

        <div>
          <h1>
            Proforma Invoice
          </h1>

          <p>
            Create your KirayNow invoice
          </p>
        </div>

        <div className="kn-actions">

          <button
            className="kn-btn kn-btn-light"
            onClick={onNew}
          >
            New
          </button>

          <button
            className="kn-btn kn-btn-light"
            onClick={onPreview}
          >
            <Eye size={16} />
            Preview
          </button>

          <button
            className="kn-btn kn-btn-dark"
            onClick={() =>
              onSave(invoice)
            }
          >
            <Save size={16} />
            Save
          </button>

        </div>

      </div>

      {/* DOCUMENT */}

      <div className="kn-section">

        <h3>1. Document</h3>

        <div className="kn-grid kn-grid-3">

          <label className="kn-field">
            <span>Document Type</span>

            <select
              value={invoice.documentType}
              onChange={(e) =>
                update(
                  "documentType",
                  e.target.value
                )
              }
            >
              <option value="PROFORMA">
                Proforma Invoice
              </option>
            </select>
          </label>

          <label className="kn-field">
            <span>Invoice ID</span>

            <input
              value={invoice.id}
              readOnly
              className="kn-readonly"
            />
          </label>

          <label className="kn-field">
            <span>Invoice Date</span>

            <input
              type="date"
              value={invoice.invoiceDate}
              onChange={(e) =>
                update(
                  "invoiceDate",
                  e.target.value
                )
              }
            />
          </label>

        </div>

        {/* GST TOGGLE */}

        <div className="kn-gst-toggle">

          <div>
            <strong>
              GST
            </strong>

            <small>
              Apply GST on final taxable
              amount.
            </small>
          </div>

          <div className="kn-segment">

            <button
              className={
                invoice.gstEnabled
                  ? "selected"
                  : ""
              }
              onClick={() =>
                update(
                  "gstEnabled",
                  true
                )
              }
            >
              GST
            </button>

            <button
              className={
                !invoice.gstEnabled
                  ? "selected"
                  : ""
              }
              onClick={() =>
                update(
                  "gstEnabled",
                  false
                )
              }
            >
              NON-GST
            </button>

          </div>

        </div>

        {invoice.gstEnabled && (
          <div className="kn-grid kn-grid-3 kn-top">

            <label className="kn-field">
              <span>GST Rate</span>

              <select
                value={invoice.gstRate}
                onChange={(e) =>
                  update(
                    "gstRate",
                    Number(e.target.value)
                  )
                }
              >
                <option value={5}>
                  5%
                </option>

                <option value={12}>
                  12%
                </option>

                <option value={18}>
                  18%
                </option>

                <option value={28}>
                  28%
                </option>
              </select>
            </label>

            <label className="kn-field">
              <span>Tax Type</span>

              <select
                value={invoice.taxType}
                onChange={(e) =>
                  update(
                    "taxType",
                    e.target.value
                  )
                }
              >
                <option value="CGST_SGST">
                  CGST + SGST
                </option>

                <option value="IGST">
                  IGST
                </option>
              </select>
            </label>

            <label className="kn-field">
              <span>
                Place of Supply
              </span>

              <input
                value={invoice.customer.state}
                onChange={(e) =>
                  updateCustomer(
                    "state",
                    e.target.value
                  )
                }
              />
            </label>

          </div>
        )}

      </div>

      {/* CUSTOMER */}

      <div className="kn-section">

        <h3>
          2. Customer Details
        </h3>

        <div className="kn-grid kn-grid-2">

          <label className="kn-field">
            <span>
              Company / Customer *
            </span>

            <input
              value={
                invoice.customer.company
              }
              onChange={(e) =>
                updateCustomer(
                  "company",
                  e.target.value
                )
              }
            />
          </label>

          <label className="kn-field">
            <span>
              Contact Person
            </span>

            <input
              value={
                invoice.customer.contact
              }
              onChange={(e) =>
                updateCustomer(
                  "contact",
                  e.target.value
                )
              }
            />
          </label>

          <label className="kn-field">
            <span>Phone</span>

            <input
              value={
                invoice.customer.phone
              }
              onChange={(e) =>
                updateCustomer(
                  "phone",
                  e.target.value
                )
              }
            />
          </label>

          <label className="kn-field">
            <span>Email</span>

            <input
              value={
                invoice.customer.email
              }
              onChange={(e) =>
                updateCustomer(
                  "email",
                  e.target.value
                )
              }
            />
          </label>

          {invoice.gstEnabled && (
            <label className="kn-field">
              <span>
                Customer GSTIN
              </span>

              <input
                value={
                  invoice.customer.gstin
                }
                onChange={(e) =>
                  updateCustomer(
                    "gstin",
                    e.target.value.toUpperCase()
                  )
                }
              />
            </label>
          )}

          <label className="kn-field kn-full">
            <span>
              Billing Address
            </span>

            <textarea
              rows={3}
              value={
                invoice.customer.address
              }
              onChange={(e) =>
                updateCustomer(
                  "address",
                  e.target.value
                )
              }
            />
          </label>

        </div>

      </div>

      {/* EVENT */}

      <div className="kn-section">

        <h3>
          3. Event / Order Details
        </h3>

        <div className="kn-grid kn-grid-3">

          <label className="kn-field">
            <span>Event Name</span>

            <input
              value={
                invoice.event.name
              }
              onChange={(e) =>
                updateEvent(
                  "name",
                  e.target.value
                )
              }
            />
          </label>

          <label className="kn-field">
            <span>Event Date</span>

            <input
              type="date"
              value={
                invoice.event.date
              }
              onChange={(e) =>
                updateEvent(
                  "date",
                  e.target.value
                )
              }
            />
          </label>

          <label className="kn-field">
            <span>
              Reference No.
            </span>

            <input
              value={
                invoice.event.reference
              }
              onChange={(e) =>
                updateEvent(
                  "reference",
                  e.target.value
                )
              }
            />
          </label>

          <label className="kn-field kn-full">
            <span>Venue</span>

            <input
              value={
                invoice.event.venue
              }
              onChange={(e) =>
                updateEvent(
                  "venue",
                  e.target.value
                )
              }
            />
          </label>

          <label className="kn-field">
            <span>
              Delivery Date
            </span>

            <input
              type="date"
              value={
                invoice.event.deliveryDate
              }
              onChange={(e) =>
                updateEvent(
                  "deliveryDate",
                  e.target.value
                )
              }
            />
          </label>

          <label className="kn-field">
            <span>
              Pickup Date
            </span>

            <input
              type="date"
              value={
                invoice.event.pickupDate
              }
              onChange={(e) =>
                updateEvent(
                  "pickupDate",
                  e.target.value
                )
              }
            />
          </label>

        </div>

      </div>

      {/* ITEMS */}

      <div className="kn-section">

        <div className="kn-section-title-row">

          <h3>
            4. Items
          </h3>

          <button
            className="kn-btn kn-btn-dark kn-btn-small"
            onClick={addItem}
          >
            <Plus size={15} />
            Add Item
          </button>

        </div>

        <div className="kn-items">

          {invoice.items.map(
            (item, index) => (
              <div
                className="kn-item"
                key={item.id}
              >

                <span className="kn-item-number">
                  {index + 1}
                </span>

                <input
                  placeholder="Description"
                  value={
                    item.description
                  }
                  onChange={(e) =>
                    updateItem(
                      item.id,
                      "description",
                      e.target.value
                    )
                  }
                />

                {invoice.gstEnabled && (
                  <input
                    placeholder="HSN/SAC"
                    value={
                      item.hsnSac
                    }
                    onChange={(e) =>
                      updateItem(
                        item.id,
                        "hsnSac",
                        e.target.value
                      )
                    }
                  />
                )}

                <input
                  type="number"
                  min="0"
                  placeholder="Qty"
                  value={item.qty}
                  onChange={(e) =>
                    updateItem(
                      item.id,
                      "qty",
                      Number(
                        e.target.value
                      )
                    )
                  }
                />

                <input
                  type="number"
                  min="0"
                  placeholder="Rate"
                  value={item.rate}
                  onChange={(e) =>
                    updateItem(
                      item.id,
                      "rate",
                      Number(
                        e.target.value
                      )
                    )
                  }
                />

                <input
                  type="number"
                  min="0"
                  placeholder="Discount"
                  value={item.discount}
                  onChange={(e) =>
                    updateItem(
                      item.id,
                      "discount",
                      Number(
                        e.target.value
                      )
                    )
                  }
                />

                <strong className="kn-item-total">
                  {money(
                    item.qty *
                      item.rate -
                      item.discount
                  )}
                </strong>

                <button
                  className="kn-delete"
                  onClick={() =>
                    removeItem(item.id)
                  }
                >
                  <Trash2 size={16} />
                </button>

              </div>
            )
          )}

        </div>

        <div className="kn-total-box">

          <div>
            <span>
              Subtotal
            </span>

            <strong>
              {money(totals?.subtotal)}
            </strong>
          </div>

          <div>
            <span>
              Discount
            </span>

            <strong>
              - {money(totals?.discount)}
            </strong>
          </div>

          <div>
            <span>
              Taxable Total
            </span>

            <strong>
              {money(totals?.taxable)}
            </strong>
          </div>

          {invoice.gstEnabled &&
            invoice.taxType ===
              "CGST_SGST" && (
              <>
                <div>
                  <span>CGST</span>
                  <strong>
                    {money(totals?.cgst)}
                  </strong>
                </div>

                <div>
                  <span>SGST</span>
                  <strong>
                    {money(totals?.sgst)}
                  </strong>
                </div>
              </>
            )}

          {invoice.gstEnabled &&
            invoice.taxType ===
              "IGST" && (
              <div>
                <span>IGST</span>

                <strong>
                  {money(totals?.igst)}
                </strong>
              </div>
            )}

          <div className="grand">
            <span>
              Grand Total
            </span>

            <strong>
              {money(totals?.total)}
            </strong>
          </div>

        </div>

      </div>

      {/* PAYMENT */}

      <div className="kn-section">

        <h3>
          5. Payment
        </h3>

        <div className="kn-grid kn-grid-3">

          <label className="kn-field">
            <span>
              Amount Paid
            </span>

            <input
              type="number"
              min="0"
              value={
                invoice.paidAmount
              }
              onChange={(e) =>
                update(
                  "paidAmount",
                  Number(
                    e.target.value
                  )
                )
              }
            />
          </label>

          <label className="kn-field">
            <span>
              Payment Mode
            </span>

            <select
              value={
                invoice.paymentMode
              }
              onChange={(e) =>
                update(
                  "paymentMode",
                  e.target.value
                )
              }
            >
              <option>UPI</option>
              <option>
                Bank Transfer
              </option>
              <option>Cash</option>
              <option>Card</option>
              <option>Other</option>
            </select>
          </label>

          <label className="kn-field">
            <span>
              Payment Date
            </span>

            <input
              type="date"
              value={
                invoice.paymentDate
              }
              onChange={(e) =>
                update(
                  "paymentDate",
                  e.target.value
                )
              }
            />
          </label>

        </div>

        <div className="kn-payment-summary">

          <span>
            Total:
            {" "}
            {money(totals?.total)}
          </span>

          <span>
            Paid:
            {" "}
            {money(totals?.paid)}
          </span>

          <strong>
            Balance:
            {" "}
            {money(totals?.balance)}
          </strong>

          <b
            className={`kn-status ${
              totals?.paymentStatus ===
              "PAID"
                ? "paid"
                : totals?.paymentStatus ===
                  "PARTIALLY PAID"
                ? "partial"
                : "unpaid"
            }`}
          >
            {totals?.paymentStatus}
          </b>

        </div>

      </div>

      {/* TERMS */}

      <div className="kn-section">

        <h3>
          6. Terms & Conditions
        </h3>

        <label className="kn-field">

          <span>
            Appears on page 2
          </span>

          <textarea
            rows={9}
            value={invoice.terms}
            onChange={(e) =>
              update(
                "terms",
                e.target.value
              )
            }
          />

        </label>

        <label className="kn-field kn-top">

          <span>Notes</span>

          <textarea
            rows={3}
            value={invoice.notes}
            onChange={(e) =>
              update(
                "notes",
                e.target.value
              )
            }
          />

        </label>

      </div>

      <div className="kn-bottom-actions">

        <button
          className="kn-btn kn-btn-light"
          onClick={onNew}
        >
          New
        </button>

        <button
          className="kn-btn kn-btn-light"
          onClick={onPreview}
        >
          <Eye size={16} />
          Preview
        </button>

        <button
          className="kn-btn kn-btn-dark"
          onClick={() =>
            onSave(invoice)
          }
        >
          <Save size={16} />
          Save Invoice
        </button>

      </div>

    </section>
  );
}