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
  const isEditing =
    Boolean(initialInvoice);


  /*
  |--------------------------------------------------------------------------
  | CUSTOMER
  |--------------------------------------------------------------------------
  */

  const [customer, setCustomer] =
    useState({
      name: "",
      company: "",
      phone: "",
      email: "",
      address: "",
      gstin: "",
    });


  /*
  |--------------------------------------------------------------------------
  | EVENT
  |--------------------------------------------------------------------------
  */

  const [eventDetails, setEventDetails] =
    useState({
      name: "",
      date: "",
      venue: "",
    });


  /*
  |--------------------------------------------------------------------------
  | ITEMS
  |--------------------------------------------------------------------------
  */

  const [items, setItems] =
    useState([
      {
        id: createId(),
        description: "",
        quantity: 1,
        rate: 0,
      },
    ]);


  /*
  |--------------------------------------------------------------------------
  | ADDITIONAL CHARGES
  |--------------------------------------------------------------------------
  */

  const [labour, setLabour] =
    useState(0);

  const [transportation, setTransportation] =
    useState(0);


  /*
  |--------------------------------------------------------------------------
  | GST
  |--------------------------------------------------------------------------
  */

  const [gstEnabled, setGstEnabled] =
    useState(false);

  const [gstRate, setGstRate] =
    useState(18);


  /*
  |--------------------------------------------------------------------------
  | PAYMENT
  |--------------------------------------------------------------------------
  */

  const [advancePaid, setAdvancePaid] =
    useState(0);


  /*
  |--------------------------------------------------------------------------
  | TERMS
  |--------------------------------------------------------------------------
  */

  const [terms, setTerms] =
    useState(
      DEFAULT_TERMS.join("\n")
    );


  /*
  |--------------------------------------------------------------------------
  | ERROR
  |--------------------------------------------------------------------------
  */

  const [error, setError] =
    useState("");


  /*
  |--------------------------------------------------------------------------
  | LOAD EXISTING INVOICE
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!initialInvoice) {
      return;
    }


    /*
     * Customer
     */

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


    /*
     * Event
     */

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


    /*
     * Items
     */

    setItems(
      Array.isArray(
        initialInvoice.items
      ) &&
        initialInvoice.items.length
        ? initialInvoice.items.map(
            (item) => ({
              id:
                item.id ||
                createId(),

              description:
                item.description ||
                "",

              quantity:
                safeNumber(
                  item.quantity
                ) || 1,

              rate:
                safeNumber(
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


    /*
     * Labour
     *
     * Supports old field names too.
     */

    setLabour(
      safeNumber(
        initialInvoice.labour ??
          initialInvoice.labor ??
          initialInvoice.labourCharge ??
          initialInvoice.laborCharge
      )
    );


    /*
     * Transportation
     *
     * Supports old field names too.
     */

    setTransportation(
      safeNumber(
        initialInvoice.transportation ??
          initialInvoice.transport ??
          initialInvoice.transportationCharge ??
          initialInvoice.transportCharge
      )
    );


    /*
     * GST
     */

    setGstEnabled(
      Boolean(
        initialInvoice.gstEnabled
      )
    );


    setGstRate(
      safeNumber(
        initialInvoice.gstRate
      ) || 18
    );


    /*
     * Advance
     */

    setAdvancePaid(
      safeNumber(
        initialInvoice.advancePaid
      )
    );


    /*
     * Terms
     */

    setTerms(
      Array.isArray(
        initialInvoice.terms
      )
        ? initialInvoice.terms.join(
            "\n"
          )
        : DEFAULT_TERMS.join(
            "\n"
          )
    );
  }, [initialInvoice]);


  /*
  |--------------------------------------------------------------------------
  | LIVE CALCULATION
  |--------------------------------------------------------------------------
  */

  const totals = useMemo(
    () =>
      calculateInvoice({
        items,

        labour,

        transportation,

        gstEnabled,

        gstRate,

        advancePaid,
      }),
    [
      items,
      labour,
      transportation,
      gstEnabled,
      gstRate,
      advancePaid,
    ]
  );


  /*
  |--------------------------------------------------------------------------
  | CUSTOMER UPDATE
  |--------------------------------------------------------------------------
  */

  function updateCustomer(
    field,
    value
  ) {
    setCustomer(
      (previous) => ({
        ...previous,
        [field]: value,
      })
    );

    setError("");
  }


  /*
  |--------------------------------------------------------------------------
  | EVENT UPDATE
  |--------------------------------------------------------------------------
  */

  function updateEvent(
    field,
    value
  ) {
    setEventDetails(
      (previous) => ({
        ...previous,
        [field]: value,
      })
    );
  }


  /*
  |--------------------------------------------------------------------------
  | ITEM UPDATE
  |--------------------------------------------------------------------------
  */

  function updateItem(
    id,
    field,
    value
  ) {
    setItems(
      (previous) =>
        previous.map(
          (item) => {
            if (
              item.id !== id
            ) {
              return item;
            }


            if (
              field ===
                "quantity" ||
              field === "rate"
            ) {
              return {
                ...item,

                [field]:
                  Math.max(
                    0,
                    Number(
                      value
                    ) || 0
                  ),
              };
            }


            return {
              ...item,
              [field]: value,
            };
          }
        )
    );

    setError("");
  }


  /*
  |--------------------------------------------------------------------------
  | ADD ITEM
  |--------------------------------------------------------------------------
  */

  function addItem() {
    setItems(
      (previous) => [
        ...previous,

        {
          id: createId(),
          description: "",
          quantity: 1,
          rate: 0,
        },
      ]
    );
  }


  /*
  |--------------------------------------------------------------------------
  | REMOVE ITEM
  |--------------------------------------------------------------------------
  */

  function removeItem(id) {
    if (
      items.length === 1
    ) {
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


    setItems(
      (previous) =>
        previous.filter(
          (item) =>
            item.id !== id
        )
    );
  }


  /*
  |--------------------------------------------------------------------------
  | LABOUR
  |--------------------------------------------------------------------------
  */

  function handleLabourChange(
    value
  ) {
    const amount =
      Math.max(
        0,
        Number(value) || 0
      );

    setLabour(amount);

    setError("");
  }


  /*
  |--------------------------------------------------------------------------
  | TRANSPORTATION
  |--------------------------------------------------------------------------
  */

  function handleTransportationChange(
    value
  ) {
    const amount =
      Math.max(
        0,
        Number(value) || 0
      );

    setTransportation(
      amount
    );

    setError("");
  }


  /*
  |--------------------------------------------------------------------------
  | ADVANCE
  |--------------------------------------------------------------------------
  */

  function handleAdvanceChange(
    value
  ) {
    const amount =
      Math.max(
        0,
        Number(value) || 0
      );


    setAdvancePaid(
      Math.min(
        amount,
        totals.grandTotal
      )
    );

    setError("");
  }


  /*
  |--------------------------------------------------------------------------
  | VALIDATION
  |--------------------------------------------------------------------------
  */

  function validate() {
    /*
     * Customer
     */

    if (
      !customer.name.trim()
    ) {
      return (
        "Customer name is required."
      );
    }


    /*
     * Valid rental items
     */

    const validItems =
      items.filter(
        (item) =>
          item.description.trim() &&
          safeNumber(
            item.quantity
          ) > 0 &&
          safeNumber(
            item.rate
          ) >= 0
      );


    /*
     * At least one billable
     * thing must exist.
     *
     * This allows:
     *
     * Items
     * OR Labour
     * OR Transportation
     */

    const hasAdditionalCharges =
      safeNumber(labour) >
        0 ||
      safeNumber(
        transportation
      ) > 0;


    if (
      !validItems.length &&
      !hasAdditionalCharges
    ) {
      return (
        "Please add at least one valid item, labour charge or transportation charge."
      );
    }


    /*
     * Total
     */

    if (
      totals.grandTotal <= 0
    ) {
      return (
        "Invoice total must be greater than ₹0."
      );
    }


    /*
     * GST
     */

    if (
      gstEnabled &&
      (
        gstRate <= 0 ||
        gstRate > 100
      )
    ) {
      return (
        "Please enter a valid GST rate."
      );
    }


    /*
     * Advance
     */

    if (
      advancePaid < 0 ||
      advancePaid >
        totals.grandTotal
    ) {
      return (
        "Advance cannot be greater than total."
      );
    }


    return "";
  }


  /*
  |--------------------------------------------------------------------------
  | SUBMIT
  |--------------------------------------------------------------------------
  */

  function handleSubmit(
    event
  ) {
    event.preventDefault();


    const validationError =
      validate();


    if (
      validationError
    ) {
      setError(
        validationError
      );


      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });


      return;
    }


    /*
     * Clean items
     */

    const cleanItems =
      items
        .filter(
          (item) =>
            item.description.trim() &&
            safeNumber(
              item.quantity
            ) > 0
        )
        .map(
          (item) => ({
            id: item.id,

            description:
              item.description.trim(),

            quantity:
              safeNumber(
                item.quantity
              ),

            rate:
              safeNumber(
                item.rate
              ),
          })
        );


    /*
     * Final invoice object
     */

    const invoice = {
      ...(initialInvoice || {}),


      /*
       * Customer
       */

      customer: {
        name:
          customer.name.trim(),

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


      /*
       * Event
       */

      eventDetails: {
        name:
          eventDetails.name.trim(),

        date:
          eventDetails.date ||
          getTodayInputValue(),

        venue:
          eventDetails.venue.trim(),
      },


      /*
       * Items
       */

      items:
        cleanItems,


      /*
       * Labour
       */

      labour:
        safeNumber(
          labour
        ),


      /*
       * Transportation
       */

      transportation:
        safeNumber(
          transportation
        ),


      /*
       * GST
       */

      gstEnabled,

      gstRate:
        gstEnabled
          ? safeNumber(
              gstRate
            )
          : 0,


      /*
       * Advance
       */

      advancePaid:
        Math.min(
          safeNumber(
            advancePaid
          ),
          totals.grandTotal
        ),


      /*
       * Terms
       */

      terms:
        terms
          .split("\n")
          .map(
            (term) =>
              term.trim()
          )
          .filter(Boolean),


      /*
       * Dates
       */

      updatedAt:
        new Date().toISOString(),

      createdAt:
        initialInvoice?.createdAt ||
        new Date().toISOString(),
    };


    onSave(invoice);
  }


  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="space-y-6"
    >

      {/* ==================================================
          ERROR
      =================================================== */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}


      {/* ==================================================
          CUSTOMER
      =================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <SectionTitle
          number="01"
          title="Customer Details"
        />


        <div className="grid gap-4 md:grid-cols-2">

          <Input
            label="Customer Name *"
            value={
              customer.name
            }
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
            value={
              customer.company
            }
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
            value={
              customer.phone
            }
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
            value={
              customer.email
            }
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
            value={
              customer.gstin
            }
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
            value={
              customer.address
            }
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


      {/* ==================================================
          EVENT
      =================================================== */}

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


      {/* ==================================================
          ITEMS
      =================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">

          <SectionTitle
            number="03"
            title="Items / Services"
          />


          <button
            type="button"
            onClick={
              addItem
            }
            className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800"
          >
            + Add Item
          </button>

        </div>


        <div className="space-y-3">

          {items.map(
            (
              item,
              index
            ) => (

              <div
                key={
                  item.id
                }
                className="rounded-xl border border-slate-200 p-4"
              >

                <div className="mb-3 flex justify-between">

                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Item{" "}
                    {index + 1}
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
                    value={
                      item.rate
                    }
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


      {/* ==================================================
          ADDITIONAL CHARGES
      =================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <SectionTitle
          number="04"
          title="Additional Charges"
        />


        <p className="mb-5 text-sm text-slate-500">
          Add labour and transportation charges separately. These charges will be included in the subtotal and GST calculation when GST is enabled.
        </p>


        <div className="grid gap-4 md:grid-cols-2">

          {/* LABOUR */}

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

            <div className="mb-3">

              <p className="font-bold text-slate-900">
                Labour Charges
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Loading, unloading, setup, dismantling, manpower, etc.
              </p>

            </div>


            <div className="relative">

              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                ₹
              </span>


              <input
                type="number"
                min="0"
                step="0.01"
                value={
                  labour
                }
                onChange={(e) =>
                  handleLabourChange(
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-8 pr-3 font-bold outline-none focus:border-slate-950 focus:ring-1 focus:ring-slate-950"
                placeholder="0"
              />

            </div>

          </div>


          {/* TRANSPORTATION */}

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

            <div className="mb-3">

              <p className="font-bold text-slate-900">
                Transportation Charges
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Delivery, pickup, vehicle and transportation charges.
              </p>

            </div>


            <div className="relative">

              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                ₹
              </span>


              <input
                type="number"
                min="0"
                step="0.01"
                value={
                  transportation
                }
                onChange={(e) =>
                  handleTransportationChange(
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-8 pr-3 font-bold outline-none focus:border-slate-950 focus:ring-1 focus:ring-slate-950"
                placeholder="0"
              />

            </div>

          </div>

        </div>


        {/* ADDITIONAL CHARGE SUMMARY */}

        {(labour > 0 ||
          transportation > 0) && (

          <div className="mt-5 rounded-xl bg-slate-950 p-4 text-white">

            <div className="flex justify-between text-sm">

              <span className="text-slate-300">
                Additional Charges
              </span>

              <span className="font-black">
                {formatCurrency(
                  labour +
                    transportation
                )}
              </span>

            </div>

          </div>

        )}

      </section>


      {/* ==================================================
          TAX + PAYMENT
      =================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <SectionTitle
          number="05"
          title="Tax & Payment"
        />


        <div className="grid gap-6 lg:grid-cols-2">

          {/* TAX */}

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
                  {gstEnabled
                    ? "GST will be applied on items, labour and transportation."
                    : "No GST will be added to this PI."}
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
                  value={
                    gstRate
                  }
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


          {/* PAYMENT */}

          <div>

            <label className="mb-1 block text-sm font-medium">
              Advance / Amount Paid
            </label>


            <input
              type="number"
              min="0"
              step="0.01"
              value={
                advancePaid
              }
              onChange={(e) =>
                handleAdvanceChange(
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
            />


            <div className="mt-4 space-y-3 rounded-xl bg-slate-50 p-4">

              <SummaryRow
                label="Item Subtotal"
                value={formatCurrency(
                  totals.itemsSubtotal
                )}
              />


              {labour > 0 && (

                <SummaryRow
                  label="Labour"
                  value={formatCurrency(
                    totals.labour
                  )}
                />

              )}


              {transportation >
                0 && (

                <SummaryRow
                  label="Transportation"
                  value={formatCurrency(
                    totals.transportation
                  )}
                />

              )}


              <div className="border-t border-slate-200 pt-3">

                <SummaryRow
                  label="Subtotal"
                  value={formatCurrency(
                    totals.subtotal
                  )}
                  bold
                />

              </div>


              {gstEnabled && (

                <SummaryRow
                  label={`GST (${gstRate}%)`}
                  value={formatCurrency(
                    totals.gstAmount
                  )}
                />

              )}


              <div className="border-t-2 border-slate-900 pt-3">

                <SummaryRow
                  label="Grand Total"
                  value={formatCurrency(
                    totals.grandTotal
                  )}
                  bold
                />

              </div>


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

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    totals.status ===
                    "PAID"
                      ? "bg-emerald-100 text-emerald-700"
                      : totals.status ===
                        "PARTIALLY PAID"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {
                    totals.status
                  }
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ==================================================
          TERMS
      =================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <SectionTitle
          number="06"
          title="Terms & Conditions"
        />


        <textarea
          value={
            terms
          }
          onChange={(e) =>
            setTerms(
              e.target.value
            )
          }
          rows={8}
          className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 outline-none focus:border-slate-950"
        />


        <p className="mt-2 text-xs text-slate-400">
          One term per line.
        </p>

      </section>


      {/* ==================================================
          ACTIONS
      =================================================== */}

      <div className="flex flex-col-reverse gap-3 sm:flex-row">

        <button
          type="button"
          onClick={
            onCancel
          }
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


/*
|--------------------------------------------------------------------------
| SECTION TITLE
|--------------------------------------------------------------------------
*/

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


/*
|--------------------------------------------------------------------------
| INPUT
|--------------------------------------------------------------------------
*/

function Input({
  label,
  className = "",
  ...props
}) {
  return (
    <div
      className={
        className
      }
    >

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


/*
|--------------------------------------------------------------------------
| SUMMARY
|--------------------------------------------------------------------------
*/

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

      <span>
        {label}
      </span>

      <span>
        {value}
      </span>

    </div>
  );
}