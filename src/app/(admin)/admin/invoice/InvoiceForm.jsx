"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  DEFAULT_TERMS,
  calculateInvoice,
  createId,
  formatCurrency,
  getTodayInputValue,
  safeNumber,
} from "../../../../utils/invoice-utils";

export default function InvoiceForm({
  initialInvoice,
  onSave,
  onCancel,
}) {
  const isEditing = Boolean(
    initialInvoice
  );

  const [customer, setCustomer] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    address: "",
    gstin: "",
  });

  const [eventDetails, setEventDetails] =
    useState({
      name: "",
      date: "",
      venue: "",
    });

  const [items, setItems] = useState([
    {
      id: createId(),
      description: "",
      quantity: 1,
      rate: 0,
    },
  ]);

  const [gstEnabled, setGstEnabled] =
    useState(false);

  const [gstRate, setGstRate] =
    useState(18);

  const [advancePaid, setAdvancePaid] =
    useState(0);

  const [terms, setTerms] = useState(
    DEFAULT_TERMS.join("\n")
  );

  const [error, setError] =
    useState("");

  /*
    Load existing invoice when Edit is clicked.
  */
  useEffect(() => {
    if (!initialInvoice) {
      return;
    }

    setCustomer({
      name:
        initialInvoice.customer?.name ||
        "",
      company:
        initialInvoice.customer?.company ||
        "",
      phone:
        initialInvoice.customer?.phone ||
        "",
      email:
        initialInvoice.customer?.email ||
        "",
      address:
        initialInvoice.customer?.address ||
        "",
      gstin:
        initialInvoice.customer?.gstin ||
        "",
    });

    setEventDetails({
      name:
        initialInvoice.eventDetails?.name ||
        "",
      date:
        initialInvoice.eventDetails?.date ||
        "",
      venue:
        initialInvoice.eventDetails?.venue ||
        "",
    });

    setItems(
      Array.isArray(initialInvoice.items) &&
        initialInvoice.items.length
        ? initialInvoice.items.map(
            (item) => ({
              id:
                item.id || createId(),
              description:
                item.description || "",
              quantity:
                safeNumber(
                  item.quantity
                ) || 1,
              rate: safeNumber(
                item.rate
              ),
            })
          )
        : [
            {
              id: createId(),
              description: "",
              quantity: 1,
              rate: 0,
            },
          ]
    );

    setGstEnabled(
      Boolean(initialInvoice.gstEnabled)
    );

    setGstRate(
      safeNumber(
        initialInvoice.gstRate
      ) || 18
    );

    setAdvancePaid(
      safeNumber(
        initialInvoice.advancePaid
      )
    );

    setTerms(
      Array.isArray(
        initialInvoice.terms
      )
        ? initialInvoice.terms.join(
            "\n"
          )
        : DEFAULT_TERMS.join("\n")
    );
  }, [initialInvoice]);

  const totals = useMemo(
    () =>
      calculateInvoice({
        items,
        gstEnabled,
        gstRate,
        advancePaid,
      }),
    [
      items,
      gstEnabled,
      gstRate,
      advancePaid,
    ]
  );

  function updateCustomer(
    field,
    value
  ) {
    setCustomer((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function updateEvent(
    field,
    value
  ) {
    setEventDetails((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function updateItem(
    id,
    field,
    value
  ) {
    setItems((previous) =>
      previous.map((item) => {
        if (item.id !== id) {
          return item;
        }

        if (
          field === "quantity" ||
          field === "rate"
        ) {
          return {
            ...item,
            [field]: Math.max(
              0,
              Number(value) || 0
            ),
          };
        }

        return {
          ...item,
          [field]: value,
        };
      })
    );
  }

  function addItem() {
    setItems((previous) => [
      ...previous,
      {
        id: createId(),
        description: "",
        quantity: 1,
        rate: 0,
      },
    ]);
  }

  function removeItem(id) {
    if (items.length === 1) {
      setItems([
        {
          id: createId(),
          description: "",
          quantity: 1,
          rate: 0,
        },
      ]);

      return;
    }

    setItems((previous) =>
      previous.filter(
        (item) => item.id !== id
      )
    );
  }

  function handleAdvanceChange(
    value
  ) {
    const amount = Math.max(
      0,
      Number(value) || 0
    );

    setAdvancePaid(
      Math.min(
        amount,
        totals.grandTotal
      )
    );
  }

  function validate() {
    if (!customer.name.trim()) {
      return "Customer name is required.";
    }

    const validItems = items.filter(
      (item) =>
        item.description.trim() &&
        safeNumber(
          item.quantity
        ) > 0 &&
        safeNumber(item.rate) >= 0
    );

    if (!validItems.length) {
      return "Please add at least one valid item.";
    }

    if (totals.grandTotal <= 0) {
      return "Invoice total must be greater than ₹0.";
    }

    if (
      gstEnabled &&
      (gstRate <= 0 ||
        gstRate > 100)
    ) {
      return "Please enter a valid GST rate.";
    }

    if (
      advancePaid < 0 ||
      advancePaid >
        totals.grandTotal
    ) {
      return "Advance cannot be greater than total.";
    }

    return "";
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationError =
      validate();

    if (validationError) {
      setError(validationError);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    const cleanItems = items
      .filter(
        (item) =>
          item.description.trim() &&
          safeNumber(
            item.quantity
          ) > 0
      )
      .map((item) => ({
        id: item.id,
        description:
          item.description.trim(),
        quantity:
          safeNumber(
            item.quantity
          ),
        rate:
          safeNumber(item.rate),
      }));

    const invoice = {
      ...(initialInvoice || {}),

      customer: {
        name: customer.name.trim(),
        company:
          customer.company.trim(),
        phone:
          customer.phone.trim(),
        email:
          customer.email.trim(),
        address:
          customer.address.trim(),
        gstin:
          customer.gstin
            .trim()
            .toUpperCase(),
      },

      eventDetails: {
        name:
          eventDetails.name.trim(),
        date:
          eventDetails.date ||
          getTodayInputValue(),
        venue:
          eventDetails.venue.trim(),
      },

      items: cleanItems,

      gstEnabled,

      gstRate: gstEnabled
        ? safeNumber(gstRate)
        : 0,

      advancePaid: Math.min(
        safeNumber(
          advancePaid
        ),
        totals.grandTotal
      ),

      terms: terms
        .split("\n")
        .map((term) =>
          term.trim()
        )
        .filter(Boolean),

      updatedAt:
        new Date().toISOString(),

      createdAt:
        initialInvoice?.createdAt ||
        new Date().toISOString(),
    };

    onSave(invoice);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* CUSTOMER */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionTitle
          number="01"
          title="Customer Details"
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Customer Name *"
            value={customer.name}
            onChange={(e) =>
              updateCustomer(
                "name",
                e.target.value
              )
            }
            placeholder="Rahul Sharma"
          />

          <Input
            label="Company"
            value={customer.company}
            onChange={(e) =>
              updateCustomer(
                "company",
                e.target.value
              )
            }
            placeholder="ABC Events Pvt. Ltd."
          />

          <Input
            label="Phone"
            value={customer.phone}
            onChange={(e) =>
              updateCustomer(
                "phone",
                e.target.value
              )
            }
            placeholder="+91 98765 43210"
          />

          <Input
            label="Email"
            type="email"
            value={customer.email}
            onChange={(e) =>
              updateCustomer(
                "email",
                e.target.value
              )
            }
            placeholder="client@example.com"
          />

          <Input
            label="GSTIN"
            value={customer.gstin}
            onChange={(e) =>
              updateCustomer(
                "gstin",
                e.target.value
              )
            }
            placeholder="22AAAAA0000A1Z5"
            maxLength={15}
          />

          <Input
            label="Address"
            value={customer.address}
            onChange={(e) =>
              updateCustomer(
                "address",
                e.target.value
              )
            }
            placeholder="Billing address"
          />
        </div>
      </section>

      {/* EVENT */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionTitle
          number="02"
          title="Event / Booking Details"
        />

        <div className="grid gap-4 md:grid-cols-3">
          <Input
            label="Event Name"
            value={
              eventDetails.name
            }
            onChange={(e) =>
              updateEvent(
                "name",
                e.target.value
              )
            }
            placeholder="Wedding Event"
          />

          <Input
            label="Event Date"
            type="date"
            value={
              eventDetails.date
            }
            onChange={(e) =>
              updateEvent(
                "date",
                e.target.value
              )
            }
          />

          <Input
            label="Venue"
            value={
              eventDetails.venue
            }
            onChange={(e) =>
              updateEvent(
                "venue",
                e.target.value
              )
            }
            placeholder="The Grand Hotel"
          />
        </div>
      </section>

      {/* ITEMS */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <SectionTitle
            number="03"
            title="Items / Services"
          />

          <button
            type="button"
            onClick={addItem}
            className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800"
          >
            + Add Item
          </button>
        </div>

        <div className="space-y-3">
          {items.map(
            (item, index) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="mb-3 flex justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Item {index + 1}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      removeItem(
                        item.id
                      )
                    }
                    className="text-xs font-bold text-red-500"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-[1fr_120px_160px_160px]">
                  <Input
                    label="Description"
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
                    placeholder="Chiavari Chairs"
                  />

                  <Input
                    label="Qty"
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      item.quantity
                    }
                    onChange={(e) =>
                      updateItem(
                        item.id,
                        "quantity",
                        e.target.value
                      )
                    }
                  />

                  <Input
                    label="Rate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.rate}
                    onChange={(e) =>
                      updateItem(
                        item.id,
                        "rate",
                        e.target.value
                      )
                    }
                  />

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Amount
                    </label>

                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-bold">
                      {formatCurrency(
                        safeNumber(
                          item.quantity
                        ) *
                          safeNumber(
                            item.rate
                          )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* GST + PAYMENT */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionTitle
          number="04"
          title="Tax & Payment"
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-bold">
              Tax Type
            </p>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
              <div>
                <p className="font-bold">
                  {gstEnabled
                    ? "GST Enabled"
                    : "Non-GST"}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  GST is applied on subtotal.
                </p>
              </div>

              <button
                type="button"
                aria-label="Toggle GST"
                aria-pressed={
                  gstEnabled
                }
                onClick={() =>
                  setGstEnabled(
                    (value) =>
                      !value
                  )
                }
                className={`relative h-7 w-12 rounded-full ${
                  gstEnabled
                    ? "bg-slate-950"
                    : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                    gstEnabled
                      ? "left-6"
                      : "left-1"
                  }`}
                />
              </button>
            </div>

            {gstEnabled && (
              <div className="mt-4">
                <label className="mb-1 block text-sm font-medium">
                  GST Rate
                </label>

                <select
                  value={gstRate}
                  onChange={(e) =>
                    setGstRate(
                      Number(
                        e.target.value
                      )
                    )
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
                >
                  <option value="5">
                    5%
                  </option>
                  <option value="12">
                    12%
                  </option>
                  <option value="18">
                    18%
                  </option>
                  <option value="28">
                    28%
                  </option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Advance / Amount Paid
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={advancePaid}
              onChange={(e) =>
                handleAdvanceChange(
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
            />

            <div className="mt-4 space-y-3 rounded-xl bg-slate-50 p-4">
              <SummaryRow
                label="Subtotal"
                value={formatCurrency(
                  totals.subtotal
                )}
              />

              {gstEnabled && (
                <SummaryRow
                  label={`GST (${gstRate}%)`}
                  value={formatCurrency(
                    totals.gstAmount
                  )}
                />
              )}

              <SummaryRow
                label="Grand Total"
                value={formatCurrency(
                  totals.grandTotal
                )}
                bold
              />

              <SummaryRow
                label="Advance Paid"
                value={formatCurrency(
                  totals.advancePaid
                )}
              />

              <SummaryRow
                label="Balance Due"
                value={formatCurrency(
                  totals.balance
                )}
                highlight
              />

              <div className="pt-2 text-center">
                <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold">
                  {totals.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TERMS */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionTitle
          number="05"
          title="Terms & Conditions"
        />

        <textarea
          value={terms}
          onChange={(e) =>
            setTerms(e.target.value)
          }
          rows={8}
          className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 outline-none focus:border-slate-950"
        />

        <p className="mt-2 text-xs text-slate-400">
          One term per line.
        </p>
      </section>

      {/* ACTIONS */}

      <div className="flex flex-col-reverse gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl border border-slate-300 bg-white py-4 font-bold text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="flex-1 rounded-xl bg-slate-950 py-4 font-bold text-white hover:bg-slate-800"
        >
          {isEditing
            ? "Save Changes"
            : "Generate Proforma Invoice"}
        </button>
      </div>
    </form>
  );
}

function SectionTitle({
  number,
  title,
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-xs font-bold text-white">
        {number}
      </span>

      <h2 className="text-lg font-bold">
        {title}
      </h2>
    </div>
  );
}

function Input({
  label,
  className = "",
  ...props
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        {...props}
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-slate-950 focus:ring-1 focus:ring-slate-950"
      />
    </div>
  );
}

function SummaryRow({
  label,
  value,
  bold = false,
  highlight = false,
}) {
  return (
    <div
      className={`flex justify-between ${
        bold
          ? "text-base font-bold"
          : "text-sm"
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