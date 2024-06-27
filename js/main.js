import { menuListCategoryIndex } from "./components/menu.js";
import { galleryIndex, ingreso } from "./components/gallery.js";
import { getAllProductName, getAllCategory, getAllProductRandom } from "./module/app.js";
import { getProductId } from "./module/detail.js";


let input__search = document.querySelector("#input__search");
let main__article = document.querySelector(".main__article");
let nav__ul = document.querySelector(".nav__ul");
let header = document.querySelector(".header");

let searchProducts = async e => {
    let params = new URLSearchParams(location.search);
    let dataSearch = { search : e.target.value, id: params.get('id')}
    input__search.value = null;
    let res = "";
    
    if (input__search.dataset.opc == "random") {
        res = await getAllProductRandom({});
        delete input__search.dataset.opc;
        history.pushState(null, "", "?id=fashion");
        console.log(dataSearch);
    } else {
        res = await getAllProductName(dataSearch);
    }
    
    // Transformación de los datos antes de pasarlos a galleryIndex
    let transformedRes = transformProductData(res);

    main__article.innerHTML = galleryIndex(transformedRes, params.get('id'));
    header.innerHTML = ingreso();

    let { data: { products } } = res;
    let asin = products.map(value => ({ id: value.asin }));

    let proceso = new Promise(async (resolve, reject) => {
        for (let i = 0; i < asin.length; i++) {
            if (localStorage.getItem(asin[i].id)) continue;
            let data = await getProductId(asin[i]);
            localStorage.setItem(asin[i].id, JSON.stringify(data));
        }
        resolve({ message: "Datos buscados correctamente" });
    });

    Promise.all([proceso]).then(res => { console.log(res); });
}

// Función para transformar los datos de productos
function transformProductData(res) {
    let { data: { products } } = res;
    // Mapear los productos y transformar los valores null
    let transformedProducts = products.map(product => ({
        ...product,
        product_price: product.product_price === null ? "$0" : product.product_price,
        rating_star: product.rating_star === null ? "0" : product.rating_star
    }));
    return { ...res, data: { products: transformedProducts } };
}

addEventListener("DOMContentLoaded", async e => {
    if (!localStorage.getItem("getAllCategory")) {
        localStorage.setItem("getAllCategory", JSON.stringify(await getAllCategory()));
    }
    nav__ul.innerHTML = await menuListCategoryIndex(JSON.parse(localStorage.getItem("getAllCategory")));
  
    history.pushState(null, "", "?id=fashion");
    input__search.value = "zapato";
    const eventoChange = new Event('change');
    input__search.dispatchEvent(eventoChange);
})

input__search.addEventListener("change", searchProducts);