import { cart } from "../data/cart.js";
import { getProduct } from "../data/products.js";
import { formatCurrency } from "./utils/pirceCalculation.js";


export function generatePaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;
  let totalItems = 0;

  cart.forEach(cartItem => {
    const product = getProduct(cartItem.productId);
    productPriceCents += product.priceCents * cartItem.quantity;
    shippingPriceCents += cartItem.shippingPriceCents || 0; // if not selected, assume 0
    totalItems += cartItem.quantity;
  });

  const subtotalCents = productPriceCents + shippingPriceCents;
  const taxCents = Math.round(subtotalCents * 0.10);
  const totalCents = subtotalCents + taxCents;

  document.querySelector('.js-total-items-count').innerHTML = totalItems;
  document.querySelector('.js-payment-product-price').innerHTML = `$${formatCurrency(productPriceCents)}`;
  document.querySelector('.js-payment-shipping').innerHTML = `$${formatCurrency(shippingPriceCents)}`;
  document.querySelector('.js-payment-subtotal').innerHTML = `$${formatCurrency(subtotalCents)}`;
  document.querySelector('.js-payment-tax').innerHTML = `$${formatCurrency(taxCents)}`;
  document.querySelector('.js-payment-total').innerHTML = `$${formatCurrency(totalCents)}`;
}

