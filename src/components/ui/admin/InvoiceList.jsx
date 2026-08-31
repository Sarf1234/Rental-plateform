"use client";

import {
  Copy,
  Eye,
  FilePlus2,
  Search,
  Trash2
} from "lucide-react";

import { useMemo, useState } from "react";

function calculate(invoice) {
  const subtotal =
    invoice.items.reduce(
      (sum, item) =>
        sum +
        Number(item.qty || 0) *
          Number(item.rate || 0),
      0
    );

  const discount =
    invoice.items.reduce(
      (sum, item) =>
        sum +
        Number(item.discount || 0),
      0
    );

  const taxable =
    Math.max(
      0,
      subtotal - discount
    );

  const gst = invoice.gstEnabled
    ? taxable *
      Number(invoice.gstRate || 0) /
      100
    : 0;

  const total =
    taxable + gst;

  const paid = Math.min(
    Math.max(
      Number(invoice.paidAmount || 0),
      0
    ),
    total
  );

  const balance =
    total - paid;

  let status = "UNPAID";

  if (
    paid >= total &&
    total > 0
  ) {
    status = "PAID";
  } else if (paid > 0) {
    status = "PARTIALLY PAID";
  }

  return {
    total,
    paid,
    balance,
    status
  };
}

const money = (n) =>
  `₹${Number(n || 0).toLocaleString(
    "en-IN",
    {
      maximumFractionDigits: 2
    }
  )}`;

export default function InvoiceList({
  invoices,
  onNew,
  onOpen,
  onPreview,
  onDuplicate,
  onAbort
}) {
  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("ALL");

  const filtered =
    useMemo(
      () =>
        invoices.filter(
          (invoice) => {
            const result =
              calculate(invoice);

            const query =
              search.toLowerCase();

            const matchesSearch =
              !query ||
              invoice.id
                .toLowerCase()
                .includes(query) ||
              invoice.customer.company
                .toLowerCase()
                .includes(query);

            const matchesFilter =
              filter === "ALL" ||
              result.status ===
                filter;

            return (
              matchesSearch &&
              matchesFilter
            );
          }
        ),
      [invoices, search, filter]
    );

  return (
    <section className="kn-list">

      <div className="kn-list-head">

        <div>
          <h1>
            Saved Invoices
          </h1>

          <p>
            Stored locally in this
            browser.
          </p>
        </div>

        <button
          className="kn-btn kn-btn-dark"
          onClick={onNew}
        >
          <FilePlus2 size={16} />
          New Invoice
        </button>

      </div>

      <div className="kn-list-filters">

        <div className="kn-search">

          <Search size={17} />

          <input
            placeholder="Search invoice or customer..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

        <select
          value={filter}
          onChange={(e) =>
            setFilter(
              e.target.value
            )
          }
        >
          <option value="ALL">
            All
          </option>

          <option value="UNPAID">
            Unpaid
          </option>

          <option value="PARTIALLY PAID">
            Partially Paid
          </option>

          <option value="PAID">
            Paid
          </option>
        </select>

      </div>

      {filtered.length === 0 ? (

        <div className="kn-empty">

          <FilePlus2 size={30} />

          <h3>
            No invoices
          </h3>

          <p>
            Create your first
            invoice.
          </p>

          <button
            className="kn-btn kn-btn-dark"
            onClick={onNew}
          >
            Create Invoice
          </button>

        </div>

      ) : (

        <div className="kn-invoice-list">

          {filtered.map(
            (invoice) => {
              const result =
                calculate(invoice);

              return (
                <div
                  className="kn-list-row"
                  key={invoice.id}
                >

                  <div>
                    <strong>
                      {invoice.id}
                    </strong>

                    <span>
                      {
                        invoice.customer
                          .company ||
                        "No customer"
                      }
                    </span>

                    <small>
                      {
                        invoice.invoiceDate
                      }
                    </small>
                  </div>

                  <div>
                    <strong>
                      {money(
                        result.total
                      )}
                    </strong>

                    <span
                      className={`kn-status ${
                        result.status ===
                        "PAID"
                          ? "paid"
                          : result.status ===
                            "PARTIALLY PAID"
                          ? "partial"
                          : "unpaid"
                      }`}
                    >
                      {result.status}
                    </span>
                  </div>

                  <div>
                    <small>
                      Balance
                    </small>

                    <strong>
                      {money(
                        result.balance
                      )}
                    </strong>
                  </div>

                  <div className="kn-row-actions">

                    <button
                      title="Open"
                      onClick={() =>
                        onOpen(invoice)
                      }
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      title="Preview"
                      onClick={() =>
                        onPreview(
                          invoice
                        )
                      }
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      title="Duplicate"
                      onClick={() =>
                        onDuplicate(
                          invoice
                        )
                      }
                    >
                      <Copy size={16} />
                    </button>

                    <button
                      className="danger"
                      title="Abort"
                      onClick={() =>
                        onAbort(
                          invoice.id
                        )
                      }
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>

                </div>
              );
            }
          )}

        </div>

      )}

    </section>
  );
}