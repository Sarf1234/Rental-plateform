"use client";

import {
  useEffect,
  useState,
} from "react";

import InvoiceForm from "./InvoiceForm";
import InvoicePreview from "./InvoicePreview";

import {
  calculateInvoice,
  formatCurrency,
  formatDate,
  generateInvoiceNumber,
  loadInvoices,
  saveInvoices,
} from "../../../../utils/invoice-utils";

export default function ProformaPage() {
  const [invoices, setInvoices] =
    useState([]);

  const [
    selectedInvoice,
    setSelectedInvoice,
  ] = useState(null);

  const [
    editingInvoice,
    setEditingInvoice,
  ] = useState(null);

  const [showForm, setShowForm] =
    useState(false);

  const [isReady, setIsReady] =
    useState(false);

  const [storageError, setStorageError] =
    useState(false);

  useEffect(() => {
    const saved =
      loadInvoices();

    setInvoices(saved);
    setIsReady(true);
  }, []);

  function persistInvoices(
    nextInvoices
  ) {
    const success =
      saveInvoices(
        nextInvoices
      );

    if (!success) {
      setStorageError(true);
      return false;
    }

    setStorageError(false);
    setInvoices(
      nextInvoices
    );

    return true;
  }

  /*
    CREATE
  */

  function handleCreateInvoice(
    invoice
  ) {
    const invoiceWithNumber = {
      ...invoice,
      id:
        invoice.id ||
        crypto.randomUUID(),
      invoiceNumber:
        invoice.invoiceNumber ||
        generateInvoiceNumber(),
      createdAt:
        invoice.createdAt ||
        new Date().toISOString(),
      updatedAt:
        new Date().toISOString(),
    };

    const nextInvoices = [
      invoiceWithNumber,
      ...invoices,
    ];

    const saved =
      persistInvoices(
        nextInvoices
      );

    if (!saved) {
      window.alert(
        "Could not save invoice. Please check browser storage."
      );

      return;
    }

    setEditingInvoice(null);
    setShowForm(false);

    setSelectedInvoice(
      invoiceWithNumber
    );
  }

  /*
    EDIT / UPDATE
  */

  function handleUpdateInvoice(
    updatedInvoice
  ) {
    const nextInvoices =
      invoices.map(
        (invoice) =>
          invoice.id ===
          updatedInvoice.id
            ? {
                ...updatedInvoice,

                /*
                  Invoice number NEVER changes.
                */
                invoiceNumber:
                  invoice.invoiceNumber,

                createdAt:
                  invoice.createdAt,

                updatedAt:
                  new Date().toISOString(),
              }
            : invoice
      );

    const saved =
      persistInvoices(
        nextInvoices
      );

    if (!saved) {
      window.alert(
        "Could not save changes."
      );

      return;
    }

    const updated =
      nextInvoices.find(
        (invoice) =>
          invoice.id ===
          updatedInvoice.id
      );

    setEditingInvoice(null);
    setShowForm(false);

    setSelectedInvoice(
      updated
    );
  }

  /*
    SAVE FROM FORM
  */

  function handleFormSave(
    invoice
  ) {
    if (editingInvoice) {
      handleUpdateInvoice(
        invoice
      );
      return;
    }

    handleCreateInvoice(
      invoice
    );
  }

  /*
    EDIT BUTTON
  */

  function handleEditInvoice() {
    if (!selectedInvoice) {
      return;
    }

    setEditingInvoice(
      selectedInvoice
    );

    setSelectedInvoice(null);
    setShowForm(true);
  }

  /*
    ABORT / DELETE
  */

  function handleAbort(
    invoiceId
  ) {
    const nextInvoices =
      invoices.filter(
        (invoice) =>
          invoice.id !==
          invoiceId
      );

    persistInvoices(
      nextInvoices
    );

    setSelectedInvoice(null);
    setEditingInvoice(null);
    setShowForm(false);
  }

  /*
    OPEN
  */

  function openInvoice(
    invoice
  ) {
    setSelectedInvoice(
      invoice
    );

    setShowForm(false);
    setEditingInvoice(null);
  }

  /*
    NEW
  */

  function createNewInvoice() {
    setSelectedInvoice(null);
    setEditingInvoice(null);
    setShowForm(true);
  }

  /*
    CLOSE
  */

  function closeAll() {
    setSelectedInvoice(null);
    setEditingInvoice(null);
    setShowForm(false);
  }

  if (!isReady) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-xl bg-white px-6 py-4 text-sm font-bold shadow">
          Loading KirayNow PI...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">

      {/* HEADER */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div>
            <h1 className="text-2xl font-black tracking-tight">
              KIRAYNOW
            </h1>

            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Proforma Invoice
            </p>
          </div>

          <button
            type="button"
            onClick={
              createNewInvoice
            }
            className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800"
          >
            + New PI
          </button>
        </div>
      </header>

      {/* STORAGE WARNING */}

      {storageError && (
        <div className="mx-auto max-w-7xl px-5 pt-5 sm:px-8">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-800">
            Browser storage is unavailable.
            Changes may not survive refresh.
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">

        {/* FORM */}

        {showForm && (
          <section className="mx-auto max-w-5xl">
            <button
              type="button"
              onClick={
                closeAll
              }
              className="mb-4 text-sm font-bold text-slate-500 hover:text-slate-950"
            >
              ← Back to invoices
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-black">
                {editingInvoice
                  ? "Edit Proforma Invoice"
                  : "Create Proforma Invoice"}
              </h2>

              {editingInvoice && (
                <p className="mt-1 text-sm text-slate-500">
                  Editing{" "}
                  <b>
                    {
                      editingInvoice.invoiceNumber
                    }
                  </b>
                </p>
              )}
            </div>

            <InvoiceForm
              initialInvoice={
                editingInvoice
              }
              onSave={
                handleFormSave
              }
              onCancel={
                closeAll
              }
            />
          </section>
        )}

        {/* EMPTY */}

        {!showForm &&
          invoices.length === 0 && (
            <div className="flex min-h-[500px] items-center justify-center">
              <div className="max-w-md text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 font-black text-white">
                  PI
                </div>

                <h2 className="text-2xl font-black">
                  No Proforma Invoices
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Create your first
                  KirayNow Proforma
                  Invoice.
                </p>

                <button
                  type="button"
                  onClick={
                    createNewInvoice
                  }
                  className="mt-6 rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white"
                >
                  Create First PI
                </button>
              </div>
            </div>
          )}

        {/* LIST */}

        {!showForm &&
          invoices.length > 0 && (
            <section>
              <div className="mb-5 flex items-end justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Local Records
                  </p>

                  <h2 className="mt-1 text-2xl font-black">
                    Proforma Invoices
                  </h2>
                </div>

                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-500 shadow-sm">
                  {invoices.length}{" "}
                  {invoices.length ===
                  1
                    ? "Invoice"
                    : "Invoices"}
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {invoices.map(
                  (invoice) => (
                    <InvoiceCard
                      key={
                        invoice.id
                      }
                      invoice={
                        invoice
                      }
                      onClick={() =>
                        openInvoice(
                          invoice
                        )
                      }
                    />
                  )
                )}
              </div>
            </section>
          )}
      </div>

      {/* PREVIEW */}

      {selectedInvoice && (
        <InvoicePreview
          invoice={
            selectedInvoice
          }
          onClose={
            closeAll
          }
          onEdit={
            handleEditInvoice
          }
          onAbort={
            handleAbort
          }
        />
      )}
    </main>
  );
}

function InvoiceCard({
  invoice,
  onClick,
}) {
  const totals =
    calculateInvoice(
      invoice
    );

  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black">
            {
              invoice.invoiceNumber
            }
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {invoice.customer
              ?.name ||
              "Unnamed Customer"}
          </p>
        </div>

        <Status
          status={
            totals.status
          }
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total
          </p>

          <p className="mt-1 font-black">
            {formatCurrency(
              totals.grandTotal
            )}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Balance
          </p>

          <p className="mt-1 font-black text-orange-600">
            {formatCurrency(
              totals.balance
            )}
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-between text-xs text-slate-400">
        <span>
          {formatDate(
            invoice.createdAt
          )}
        </span>

        <span className="font-bold text-slate-500 group-hover:text-slate-950">
          Open →
        </span>
      </div>
    </button>
  );
}

function Status({
  status,
}) {
  const classes =
    status === "PAID"
      ? "bg-emerald-100 text-emerald-700"
      : status ===
        "PARTIALLY PAID"
      ? "bg-amber-100 text-amber-700"
      : "bg-red-100 text-red-700";

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[9px] font-black ${classes}`}
    >
      {status}
    </span>
  );
}