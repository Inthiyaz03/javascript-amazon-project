export let cart = JSON.parse(localStorage.getItem("cart")) || [];

export function addTocart(button) {
  const productId = button.dataset.productId;

  let matchingItem = cart.find(item => item.productId === productId);

  const quantitySelect = button.closest('.product-container')
    .querySelector('select');
  const selectedQuantity = parseInt(quantitySelect.value);

  if (matchingItem) {
    matchingItem.quantity += selectedQuantity;
  } else {
    cart.push({
      productId: productId,
      quantity: selectedQuantity
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}

export function removeFromCart(productId) {
  cart = cart.filter(item => item.productId !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
}


