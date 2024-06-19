
export const titleProductDetail = async ({ data: dataUpdate } = res) => {
    return /*html*/`
        <article class="article__detail">
            <div class="detail__head">
                <h1>${dataUpdate.product_title}</h1>
                <div class="product__select">
                    <img id="btn_minus" src="../storage/img/minus.svg">
                    <span id="span_quantity">1</span>
                    <img id="btn_plus" src="../storage/img/plus.svg" alt="">
                </div>
            </div>
            <div class="detail__score">
                ${new Array(parseInt(dataUpdate.product_star_rating)).fill(`<img src="../storage/img/star.svg">`).join('')}
                <span>${dataUpdate.product_star_rating}</span>
                <a href="${dataUpdate.product_url}">(${dataUpdate.product_num_ratings} reviews)</a>
            </div>
        </article>`;
}

export const productDetail = async (res) => {
    let { data } = res;
    let {
        category_path,
        about_product,
        product_details,
        product_information,
        product_photos,
        product_variations,
        rating_distribution,
        review_aspects,
        ...dataUpdate
    } = data;

    let description = '';
    let description2 = '';
    if (dataUpdate.product_description) {
        description = dataUpdate.product_description.slice(0, 165);
        description2 = dataUpdate.product_description.slice(166);
    } else {
        description = ("There is no description of this product")
    }

    return /*html*/`
    <details>
        <summary>${(dataUpdate.product_description && dataUpdate.product_description.length >= 165) ? description + "...Read more" : description}
        </summary>
        <p>${description2}</p>
    </details>`;
}


export const productAdded = async (res) => {
    let plantilla =""
    res.forEach((element) => {
        if (element !== null && typeof element === 'string') {
            const data = JSON.parse(element);
            console.log(data.status);
            
            let info = data.data;
            console.log(info);
            if (data.status === 'OK' && data.request_id && info) {
                console.log(info);
                
                plantilla += /*html*/`
                <article class="details__product">
                    <div class="product__imagen">
                        <img src="${info.product_photo}">
                    </div>
                    <div class="product__description">
                        <h3>${(info.product_title).substring(0, 15)}...</h3>
                        <small>⭐ ${info.product_star_rating ? info.product_star_rating : "No Ratings"}</small>
                        <span>$${info.product_price}</span>
                    </div>
                    <div class="product__custom">
                    <img src="../storage/img/option.svg">
                    <div class="product__select">
                        <img src="../storage/img/minusCheckout.svg" id="btn_minus_checkout">
                        <span id="span_quantity_checkout">${info.quantity}</span>
                        <img src="../storage/img/plusCheckout.svg" id="btn_plus_checkout">
                    </div>
                </div>
                </article>
                `;
            }



        }
        
    });
    
    return plantilla;
    // let {data} = res;
    // let {
    //     category_path,
    //     about_product,
    //     product_details,
    //     product_information,
    //     product_photos,
    //     product_variations,
    //     rating_distribution,
    //     review_aspects,
    //     ...dataUpdate
    // } = data;

    // let quantity = res.quantity || 1;

    // return /*html*/`
    // <article class="details__product">
    //     <div class="product__imagen">
    //         <img src="${dataUpdate.product_photo}">
    //     </div>
    //     <div class="product__description">
    //         <h3>${(dataUpdate.product_title).substring(0, 15)}...</h3>
    //         <small>⭐ ${dataUpdate.product_star_rating ? dataUpdate.product_star_rating : "No Ratings"}</small>
    //         <span>$${dataUpdate.product_price}</span>
    //     </div>
    //     <div class="product__custom">
    //     <img src="../storage/img/option.svg">
    //     <div class="product__select">
    //         <img src="../storage/img/minusCheckout.svg" id="btn_minus_checkout">
    //         <span id="span_quantity_checkout">${quantity}</span>
    //         <img src="../storage/img/plusCheckout.svg" id="btn_plus_checkout">
    //     </div>
    // </div>
    // </article>
    // `;
}

