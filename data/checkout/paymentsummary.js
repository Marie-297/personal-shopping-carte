import {cart} from "../cart.js";
import { deliveryOptions } from "../deliveryOption.js";
import {getMatchingProduct, products} from "../products.js";
import { formatMoney } from "../utilities/money.js";

export function paymentSummaryDetails() {
  let productPriceCents = 0;
  let productname = "";
  let itemSummary = '';
  let deliveryOption = "";
  let deliveryFee = "";
  let totalPrice = 0;
  let orderTotal = 0;
  
  cart.forEach((cartItem) => {
    const product = getMatchingProduct(cartItem.productId);
    productPriceCents = product.priceCents * cartItem.quantity
    productname = product.name;
    itemSummary += `
      <div class="orderdetails">
        <div class="itemname">${productname}</div>
        <div class="itemquantity">${cartItem.quantity}</div>
      </div>
      <div class="payment-summary-money js-payment-money">${formatMoney(productPriceCents)}</div>
    `
    totalPrice += productPriceCents;
    orderTotal = totalPrice + deliveryFee;
    
    const deliveryOptionId = cartItem.deliveryOptionId;
    deliveryOptions.forEach((option) => {
      if (option.id === deliveryOptionId) {
        deliveryOption = option;
      }
      deliveryFee = deliveryOption.priceCents;
    })
  })
  
  const paymentSummaryHTML =
    `
      <div class="payment-summary-title">
        Order Summary
      </div>

      <div class="payment-summary-row payment-summary-row-title">
        <div class="orderdetails">
          <div class="item">Item</div>
          <div class="Qty">Qty</div>
        </div>
        <div class="payment-summary-money">Amount(GH₵)</div>
      </div>
      <div class="payment-summary-row payment-summary-row-container">
        ${itemSummary}
      </div>

      <div class="payment-summary-row subtotal-row">
        <div>Total :</div>
        <div class="payment-summary-money">${formatMoney(totalPrice)}</div>
      </div>

      <div class="payment-summary-row">
        <div>Delivery :</div>
        <div class="payment-summary-money">${formatMoney(deliveryFee)}</div>
      </div>

      <div class="payment-summary-row">
        <div>Estimated tax:</div>
        <div class="payment-summary-money">GH₵0.00</div>
      </div>

      <div class="payment-summary-row total-row">
        <div>Order total:</div>
        <div class="payment-summary-money">GH₵${formatMoney(orderTotal)}</div>
      </div>

      <button class="place-order-button button-primary">
        Place your order
      </button>
    `
    console.log(deliveryFee);
  
  document.querySelector(".js-payment-summary").innerHTML = paymentSummaryHTML;
}