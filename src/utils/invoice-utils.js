export const STORAGE_KEY =
  "kiraynow_proforma_invoices_v2";

export const DEFAULT_TERMS = [
  "This is a Proforma Invoice and not a Tax Invoice.",
  "Booking will be confirmed only after receipt of the agreed advance payment.",
  "Balance payment must be cleared before or at the time of delivery/pickup unless otherwise agreed in writing.",
  "Any additional transportation, loading, unloading, labour, overtime or other applicable charges will be billed separately.",
  "Cancellation charges, if applicable, will be as per the agreed booking terms.",
  "Any damage or loss to rented items may be charged separately.",
];

export function createId() {
  try {
    if (
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
    ) {
      return crypto.randomUUID();
    }
  } catch (error) {}

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

export function safeNumber(value) {
  const number = Number(value);

  if (
    !Number.isFinite(number) ||
    number < 0
  ) {
    return 0;
  }

  return number;
}

export function roundMoney(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.round(
    (number + Number.EPSILON) * 100
  ) / 100;
}

export function formatCurrency(value) {
  const amount = roundMoney(value);

  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  ).format(amount);
}

export function formatDate(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "-";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

export function getTodayInputValue() {
  const date = new Date();

  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function generateInvoiceNumber() {
  const now = new Date();

  const day = String(
    now.getDate()
  ).padStart(2, "0");

  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");

  const year = String(
    now.getFullYear()
  ).slice(-2);

  const dateKey =
    `${year}${month}${day}`;

  const sequenceKey =
    `kiraynow_pi_sequence_${dateKey}`;

  let sequence = 0;

  if (
    typeof window !==
    "undefined"
  ) {
    try {
      sequence = Number(
        window.localStorage.getItem(
          sequenceKey
        ) || "0"
      );

      if (
        !Number.isFinite(
          sequence
        ) ||
        sequence < 0
      ) {
        sequence = 0;
      }

      sequence += 1;

      window.localStorage.setItem(
        sequenceKey,
        String(sequence)
      );
    } catch (error) {
      sequence = Number(
        String(Date.now()).slice(-4)
      );
    }
  }

  return `KN-PI-${day}${month}${year}-${String(
    sequence
  ).padStart(3, "0")}`;
}

export function getAdditionalCharges(
  invoice
) {
  const labour = roundMoney(
    safeNumber(
      invoice?.labour ??
        invoice?.labor ??
        invoice?.labourCharge ??
        invoice?.laborCharge
    )
  );

  const transportation =
    roundMoney(
      safeNumber(
        invoice?.transportation ??
          invoice?.transport ??
          invoice?.transportationCharge ??
          invoice?.transportCharge
      )
    );

  return {
    labour,
    transportation,
  };
}

/*
|--------------------------------------------------------------------------
| CALCULATE INVOICE
|--------------------------------------------------------------------------
|
| Rental item amount:
|
| Quantity × Days × Rate
|
| Items
| + Labour
| + Transportation
| = Taxable Subtotal
|
| GST is applied to the complete subtotal.
|
*/

export function calculateInvoice(
  invoice
) {
  const items =
    Array.isArray(
      invoice?.items
    )
      ? invoice.items
      : [];

  const itemsSubtotal =
    roundMoney(
      items.reduce(
        (
          total,
          item
        ) => {
          const quantity =
            safeNumber(
              item?.quantity
            );

          /*
           * Backward compatibility:
           * Old invoices did not have days,
           * so they are treated as 1 day.
           */
          const days =
            safeNumber(
              item?.days
            ) || 1;

          const rate =
            safeNumber(
              item?.rate
            );

          return (
            total +
            quantity *
              days *
              rate
          );
        },
        0
      )
    );

  const {
    labour,
    transportation,
  } = getAdditionalCharges(
    invoice
  );

  const subtotal =
    roundMoney(
      itemsSubtotal +
        labour +
        transportation
    );

  const gstRate =
    invoice?.gstEnabled
      ? safeNumber(
          invoice?.gstRate
        )
      : 0;

  const gstAmount =
    invoice?.gstEnabled
      ? roundMoney(
          (subtotal *
            gstRate) /
            100
        )
      : 0;

  const grandTotal =
    roundMoney(
      subtotal +
        gstAmount
    );

  const advancePaid =
    Math.min(
      safeNumber(
        invoice?.advancePaid
      ),
      grandTotal
    );

  const balance =
    roundMoney(
      Math.max(
        0,
        grandTotal -
          advancePaid
      )
    );

  let status = "UNPAID";

  if (
    grandTotal > 0 &&
    balance <= 0
  ) {
    status = "PAID";
  } else if (
    advancePaid > 0
  ) {
    status =
      "PARTIALLY PAID";
  }

  return {
    subtotal,
    itemsSubtotal,
    labour,
    transportation,
    gstRate,
    gstAmount,
    grandTotal,
    advancePaid,
    balance,
    status,
  };
}

export function loadInvoices() {
  if (
    typeof window ===
    "undefined"
  ) {
    return [];
  }

  try {
    const raw =
      window.localStorage.getItem(
        STORAGE_KEY
      );

    if (!raw) {
      return [];
    }

    const parsed =
      JSON.parse(raw);

    if (
      !Array.isArray(parsed)
    ) {
      return [];
    }

    return parsed;
  } catch (error) {
    console.error(
      "KirayNow PI load error:",
      error
    );

    return [];
  }
}

export function saveInvoices(
  invoices
) {
  if (
    typeof window ===
    "undefined"
  ) {
    return false;
  }

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        invoices
      )
    );

    return true;
  } catch (error) {
    console.error(
      "KirayNow PI save error:",
      error
    );

    return false;
  }
}
