export function formatMoney(priceCents) {
  return ((Math.round(priceCents)).toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}