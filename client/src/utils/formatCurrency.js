// Formats a number as South African Rand, matching the business's locale
export const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(value);
