import { cart, addTocart } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/pirceCalculation.js';
updateQuantity();
const productsGrid = document.querySelector(".products-grid");


function renderProducts() {
  let html = "";

  products.forEach(product => {
    html += `
    <div class="product-container">
    <div class="product-image-container">
    <img class="product-image" src="${product.image}" />
    </div>

    <div class="product-name limit-text-to-2-lines">
    ${product.name}
    </div>


    <div class="product-rating-container">
    <img class="product-rating-stars" src="images/ratings/rating-${
    product.rating.stars * 10
    }.png" />
    <div class="product-rating-count link-primary">
    ${product.rating.count}
    </div>
    </div>


    <div class="product-price">
    $${formatCurrency(product.priceCents)}
    </div>


    <div class="product-quantity-container">
    <select>
    ${Array.from({ length: 10 }, (_, i) => {
    const n = i + 1;
    return `<option value="${n}" ${n === 1 ? "selected" : ""}>${n}</option>`;
    }).join("")}
    </select>
    </div>


    <div class="product-spacer"></div>


    <div class="added-to-cart">
    <img src="images/icons/checkmark.png" />
    Added
    </div>


    <button class="add-to-cart-button button-primary"
    data-product-name ="${product.name}"
    data-product-id="${product.id}"
    >
    Add to Cart
    </button>
    </div>
    `;
  });


  productsGrid.innerHTML = html;
}


renderProducts();

function updateQuantity(){
let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  })
  document.querySelector('.js-cart-quantity')
  .innerHTML = cartQuantity;
}

document.querySelectorAll('.add-to-cart-button')
  .forEach((button) =>{
    button.addEventListener('click',() =>{
      
      addTocart(button);
      updateQuantity();
      
      });
    
});
