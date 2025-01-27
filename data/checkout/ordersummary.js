import {cart, removeFromCart, updateDeliveryOption} from "../cart.js";
import{products, getMatchingProduct} from "../products.js";
import { formatMoney } from "../utilities/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js"
import {deliveryOptions} from "../deliveryOption.js";
import {paymentSummaryDetails} from "../checkout/paymentsummary.js";

export function orderSummaryDetails() {
  let cartSummaryHTML = "";
  cart.forEach((cartItem) => {
  const productId = cartItem.productId;
    const matchingProduct = getMatchingProduct(productId);
    

    const deliveryOptionId = cartItem.deliveryOptionId;
    let deliveryOption = "";
    deliveryOptions.forEach((option) => {
      if (option.id === deliveryOptionId) {
        deliveryOption = option;
      }
    })
    const todayDate = dayjs();
      let formatdeliveryDate = todayDate.add(deliveryOption.deliveryDay, "days");
      const deliveryDate = formatdeliveryDate.format("dddd, MMMM D YYYY");

    cartSummaryHTML = cartSummaryHTML + `
      
      <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${deliveryDate}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image" src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">
            ${matchingProduct.name}
            </div>
            <div class="product-price">
              GH₵${formatMoney(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label">${cartItem.quantity}</span>
              </span>
            </div>
            <div class="change-btn">
              <span class="update-quantity-link link-primary">
                <img src="./images/change-record-type-svgrepo-com.svg">Change
              </span>
              <span class="delete-quantity-link link-primary js-delete-quantity-link" data-product-id=${matchingProduct.id}>
                <img src="./images/delete-2-svgrepo-com.svg">Delete
              </span>
            </div>
          </div>
          <div>
            <div class="delivery-options">
              <div class="delivery-options-title">
                Choose a delivery option:
              </div>
              ${deliveryOptionHTML(matchingProduct, cartItem)};
              
            </div>
          </div>
        </div>
        <div class="product-delivery">
          ${matchingProduct.delivery}
        </div>
      </div>
      
    `;
    
  });

  function deliveryOptionHTML(matchingProduct, cartItem) {
    let deliveryHTML ='';
    deliveryOptions.forEach((deliveryOption) => {
      const todayDate = dayjs();
      let formatdeliveryDate = todayDate.add(deliveryOption.deliveryDay, "days");
      const deliveryDate = formatdeliveryDate.format("dddd, MMMM D YYYY");
      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
      deliveryHTML +=
      `
        <div class="delivery-option js-delivery-option" data-product-id=${matchingProduct.id} data-delivery-option-id=${deliveryOption.id}>
          <input type="radio" ${isChecked ? 'checked' : ''} class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              ${deliveryDate} (Within Accra)
            </div>
            <div class="delivery-option-price">
              GH₵${formatMoney(deliveryOption.priceCents)}- Delivery Fee
            </div>
          </div>
        </div>
      `
      paymentSummaryDetails();
    })
    return deliveryHTML;
    
  }

  document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

  document.querySelectorAll(".js-delete-quantity-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.remove();
      paymentSummaryDetails();
    })
  })

  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const {deliveryOptionId, productId} = element.dataset;
      updateDeliveryOption(deliveryOptionId, productId)
      orderSummaryDetails();
    })
  })
}
orderSummaryDetails();