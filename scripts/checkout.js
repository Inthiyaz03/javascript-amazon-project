import { cart, removeFromCart } from "../data/cart.js";
import { products, getProduct } from "../data/products.js";
import { formatCurrency } from "./utils/pirceCalculation.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { generatePaymentSummary } from "./paymentSummary.js";

const tomorrowDate = dayjs().add(1, 'day').format('dddd, MMMM D');
const afterThreeDaysDate = dayjs().add(3, 'day').format('dddd, MMMM D');
const afterNineeDaysDate = dayjs().add(9, 'day').format('dddd, MMMM D');

let cartSummaryHtml = '';
cart.forEach((cartItem) => {
  const productId = cartItem.productId;
  const matchingProduct = getProduct(productId);

  cartSummaryHtml += `
    <div class="cart-item-container">
      <div class="delivery-date">
        Delivery by ${afterNineeDaysDate}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image" src="${matchingProduct.image}">
        <div class="cart-item-details">
          <div class="product-name">${matchingProduct.name}</div>
          <div class="product-price">$${formatCurrency(matchingProduct.priceCents)}</div>
          <div class="product-quantity">
            <span>Quantity: <span class="quantity-label">${cartItem.quantity}</span></span>
            <span class="update-quantity-link link-primary js-update-button">Update</span>
            <span class="delete-quantity-link link-primary js-delete-quantity" data-product-id="${matchingProduct.id}">Delete</span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">Choose a delivery option:</div>
          <div class="delivery-option">
            <input type="radio" checked class="delivery-option-input" name="${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">${afterNineeDaysDate}</div>
              <div class="delivery-option-price">FREE Shipping</div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio" class="delivery-option-input" name="${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">${afterThreeDaysDate}</div>
              <div class="delivery-option-price">$4.99 - Shipping</div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio" class="delivery-option-input" name="${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">${tomorrowDate}</div>
              <div class="delivery-option-price">$9.99 - Shipping</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
});

document.querySelector('.js-order-summary').innerHTML = cartSummaryHtml;


document.querySelectorAll('.cart-item-container').forEach((container) => {
  const productId = container.querySelector('.delivery-option-input').name;
  const selectedOption = container.querySelector(`input[name="${productId}"]:checked`);

  const selectedDate = selectedOption.closest('.delivery-option').querySelector('.delivery-option-date').textContent;
  const shippingCostText = selectedOption.closest('.delivery-option').querySelector('.delivery-option-price').textContent;

  let shippingCents = 0;
  if (shippingCostText.includes('$4.99')) shippingCents = 499;
  if (shippingCostText.includes('$9.99')) shippingCents = 999;

  const cartItem = cart.find(item => item.productId === productId);
  cartItem.shippingPriceCents = shippingCents;
  cartItem.shippingDate = selectedDate;
});

localStorage.setItem("cart", JSON.stringify(cart));


document.querySelectorAll('.js-delete-quantity').forEach((link) => {
  link.addEventListener('click', () => {
    removeFromCart(link.dataset.productId);
    location.reload();
  });
});


document.querySelectorAll('.delivery-option-input').forEach((radio) => {
  radio.addEventListener('change', () => {
    const productId = radio.name;
    const selectedOption = document.querySelector(`input[name="${productId}"]:checked`);
    const selectedDate = selectedOption.closest('.delivery-option').querySelector('.delivery-option-date').textContent;

    selectedOption.closest('.cart-item-container').querySelector('.delivery-date').textContent = `Delivery by: ${selectedDate}`;

    const shippingCostText = selectedOption.closest('.delivery-option').querySelector('.delivery-option-price').textContent;

    let shippingCents = 0;
    if (shippingCostText.includes('$4.99')) shippingCents = 499;
    if (shippingCostText.includes('$9.99')) shippingCents = 999;
    if (shippingCostText.includes('FREE')) shippingCents = 0;

    const cartItem = cart.find(item => item.productId === productId);
    cartItem.shippingPriceCents = shippingCents;
    cartItem.shippingDate = selectedDate;

    localStorage.setItem("cart", JSON.stringify(cart));
    generatePaymentSummary(); // update dynamically
  });
});

// Calculate summary AFTER defaults are set
generatePaymentSummary();
