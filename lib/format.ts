export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatPackage(value: number) {
  return `${value.toFixed(value % 1 === 0 ? 0 : 1)} LPA`;
}
