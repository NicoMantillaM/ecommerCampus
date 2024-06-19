import { productAdded } from "./components/section.js";

let product_added = document.querySelector("#product_added");
let totalItems = document.querySelector("#total_items");
let totalPrice = document.querySelector("#total_price");
let subTotal = document.querySelector("#sub_total");
let sessionStorageValues = Object.values(sessionStorage);
console.log(sessionStorageValues);
addEventListener("DOMContentLoaded", async (e) => {

    // Genera el HTML para cada producto en el carrito y lo añade al contenedor
        // let productHtml = await Promise.all(cart.map(product => productAdded(product)));
    product_added.innerHTML = await productAdded(sessionStorageValues);

    product_added.querySelectorAll(".product__select img").forEach(button => {
        button.addEventListener("click", updateQuantity);
    });

    calculateTotals();

});

const updateQuantity = (e) => {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    let button = e.target;
    let productElement = button.closest(".details__product");
    let spanQuantity = productElement.querySelector("#span_quantity_checkout");
    let quantity = Number(spanQuantity.innerHTML);
    let productId = productElement.dataset.productId;

    if (button.id === "btn_plus_checkout") {
        quantity += 1;
    } else if (button.id === "btn_minus_checkout" && quantity > 1) {
        quantity -= 1;
    }

    spanQuantity.innerHTML = quantity;

    Object.keys(sessionStorage).forEach((key) => {
        const storedValue = sessionStorage.getItem(key);
        if (storedValue) {
          try {
            const data = JSON.parse(storedValue);
            if (data.status === 'OK' && data.request_id && data.data) {
              data.data.quantity = quantity.toString();
              console.log(data);
              
              sessionStorage.setItem(key, JSON.stringify(data));
            }
          } catch (error) {
            console.error(`Error parsing Session Storage value: ${error}`);
          }
        }
      });
    calculateTotals();
};

const calculateTotals = () => {
  let totalItemsCount = 0;
  let totalPriceValue = 0;

  Object.keys(sessionStorage).forEach((key) => {
    const storedValue = sessionStorage.getItem(key);
    if (storedValue) {
      try {
        const data = JSON.parse(storedValue);
        if (data.status === 'OK' && data.request_id && data.data) {
          let quantity = Number(data.data.quantity);
          totalItemsCount += quantity;
          totalPriceValue += quantity * Number(data.data.product_price.replace("$", ""));
        }
      } catch (error) {
        console.error(`Error parsing Session Storage value: ${error}`);
      }
    }
  });

  totalItems.innerHTML = totalItemsCount;
  totalPrice.innerHTML = `$${totalPriceValue.toFixed(2)}`;
  subTotal.innerHTML = `$${totalPriceValue.toFixed(2)}`;
};

