import { buttonCartDetails } from "./components/footer.js";
import { galleryCategory } from "./components/gallery.js";
import { productDetail,titleProductDetail } from "./components/section.js";
import { getProductId } from "./module/detail.js";

let producto_inf = {};


let main__section_gallery = document.querySelector("#main__section_gallery");
let main__section__title = document.querySelector("#main__section__title");
let product__information = document.querySelector(".product__information");
let footer__ul = document.querySelector(".footer__ul");
addEventListener("DOMContentLoaded", async (e) => {
    let params = new URLSearchParams(location.search);
    let id = params.get('id');
    if (!localStorage.getItem(id)) localStorage.setItem(id, JSON.stringify(await getProductId({ id })));
    let info = JSON.parse(localStorage.getItem(id));
    main__section_gallery.innerHTML = await galleryCategory(info);
    main__section__title.innerHTML = await titleProductDetail(info);

    producto_inf.productos = info;

    let btn_minus = document.querySelector("#btn_minus");
    let btn_plus = document.querySelector("#btn_plus");
    product__information.innerHTML = await productDetail(info);
    footer__ul.innerHTML = await buttonCartDetails(info);

    btn_minus.addEventListener("click", updateQuantity);
    btn_plus.addEventListener("click", updateQuantity);

    footer__ul.addEventListener("click", async (e) => {
        // e.preventDefault()
        let id = params.get('id');
        let productInfo = producto_inf.productos;
        let span_quantity = document.querySelector("#span_quantity");
        let quantity = Number(span_quantity.innerHTML);

        // Añade la cantidad seleccionada al objeto productInfo
        producto_inf.productos.data.quantity = quantity;
        console.log(producto_inf);
        

        // Obtiene los productos actuales del carrito
        let cart = JSON.parse(sessionStorage.getItem('cart')) || [];

        // Verifica si el producto ya está en el carrito
        let existingProductIndex = cart.findIndex(p => p.data.id === productInfo.data.id);
        if (existingProductIndex !== -1) {
            // Si ya existe, actualiza la cantidad
            cart[existingProductIndex].quantity += quantity;
        } else {
            // Si no existe, añádelo al carrito
            cart.push({ ...productInfo, quantity });
        }
        // Guarda el carrito actualizado en sessionStorage
        sessionStorage.setItem(id, JSON.stringify(producto_inf.productos));

        await updateCartDisplay();
    });
});

const updateQuantity = (e) => {
    let span_quantity = document.querySelector("#span_quantity");
    let price_discount = document.querySelector("#price_discount");
    let price_original = document.querySelector("#price_original");
    let params = new URLSearchParams(location.search);
    let id = params.get('id');
    let res = JSON.parse(localStorage.getItem(id)).data;

    let product_original_price = res.product_original_price ? Number(res.product_original_price.replace("$", "")) : undefined;
    let product_price = Number(res.product_price.replace("$", ""));

    if (e.target.id === "btn_plus") span_quantity.innerHTML = Number(span_quantity.innerHTML) + 1;
    if (e.target.id === "btn_minus" && Number(span_quantity.innerHTML) > 1) span_quantity.innerHTML = Number(span_quantity.innerHTML) - 1;

    price_discount.innerHTML = `${(product_price * Number(span_quantity.innerHTML)).toFixed(2)}`;
    if (product_original_price) price_original.innerHTML = `${(product_original_price * Number(span_quantity.innerHTML)).toFixed(2)}`;
};
document.addEventListener('click', function(e) {
    if (e.target.id === 'btn_plus_checkout' || e.target.id === 'btn_minus_checkout') {
        updateCheckoutQuantity(e);
    }
});

const updateCheckoutQuantity = (e) => {
    let span_quantity_checkout = document.querySelector("#span_quantity_checkout");
    if (e.target.id === 'btn_plus') span_quantity.innerHTML = Number(span_quantity.innerHTML) + 1;
    if (e.target.id === 'btn_minus' && Number(span_quantity.innerHTML) > 1) span_quantity.innerHTML = Number(span_quantity.innerHTML) - 1;
};
const updateCartDisplay = async () => {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    // let productHtml = await Promise.all(cart.map(product => productAdded(product)));
    // product_added.innerHTML = productHtml.join('');

    // product_added.querySelectorAll(".product__select img").forEach(button => {
    //     button.addEventListener("click", updateQuantity);
    // });

    // calculateTotals();
};