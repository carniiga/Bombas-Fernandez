const productsContainer = document.querySelector(".lista-productos");
const categories = document.querySelector(".categorias-bombas");
const menuBars = document.getElementById("bars")
const menu = document.querySelector(".nav-items")
const cartButton = document.getElementById("cart");
const cartMenu = document.querySelector(".cart-menu");
const closeBtn = document.getElementById("close-btn");
const cartProductContainer = document.querySelector(".card-cart-products");
const addProductCart = document.querySelector(".agregar-carrito");
const totalPrice = document.querySelector(".total");
const buyBtn = document.querySelector(".btn-buy")
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const saveLocalStorage = cartList => {
  localStorage.setItem('cart', JSON.stringify(cartList));
};
let cartProductAdd =[]
const renderCardProduct = (product) =>{
    const {marca,
        modelo,
        cardImg,
        price,
        id} = product
    return `
    <div class="card-product" >
                <img src="${cardImg}" alt="">
                <h4 class="bomba-marca" >${marca}</h4>
                <p class="bomba-modelo"> <b>${modelo}</b></p>
                <div class="precio-add">
                    <p class="bomba-precio">${price}</p>
                    <div class="button">
                    <button class="agregar-carrito" id=${id}>+</button>
                    </div>
                </div>
            </div> 
    `
}
const buy = ()=>{
    if(!cart.length) return;
    if(window.confirm("desea hacer esta compra?")){
        localStorage.removeItem("cart")
        window.location.reload();
    }
}
const renderCardCartProduct = (product) =>{
    const {
        marca,
        modelo,
        cardImg,
        price,
        id,
        cantidad
    }  = product
    return `
    <div class="cart-card">
            <img  src="${cardImg}" alt="">
            <div class="card_product_desc">
                <h4 class="card_product_marca">${marca}</h4>
                <p class="card_product_modelo"> <b>${modelo}</b>
                <p class="_product_precio"> AR$ ${price*cantidad.toFixed(3)}</p>
            </div>
            <div class="add-delete">
            <button class="suma" id=${id}>+</button>
                <p class="count">${cantidad}</p>
                <button class="resta" id=${id}>-</button>
            </div>
        </div>
    `
}

const renderCart = (cartList) =>{
    if(!cart.length){
        cartProductContainer.innerHTML= `<p class ="msg-cart">no tiene productos en el carrito</p>`;
        totalPrice.innerHTML="TOTAL : AR$ 0"
        return;
    }
    cartProductContainer.innerHTML = cartList.map(renderCardCartProduct).join("");
    showTotal(cart)
}

const openMenu = () =>{
   if(cartMenu.classList.contains("show")){
    return;
   }else{
    menu.classList.toggle("show")
   }
}
const closeCart = () =>{
    cartMenu.classList.remove("show")
    // menu.classList.toggle("show")
}

const opencart = () =>{
   if(cartMenu.classList.contains("show")){
    return
   }else{
    cartMenu.classList.add("show")
    menu.classList.remove("show")
   }
}
const showTotal = cartProducts => {
    totalPrice.innerHTML = `AR$ ${cartProducts
      .reduce((acc, cur) => acc + Number(cur.price) * cur.cantidad, 0)
      .toFixed(3)} `;

  };

const addProduct = (e) => { 
    if(e.target.classList != "agregar-carrito") 
    return;
    const product = {
        id:e.target.id,
        marca: e.path[3].children[1].innerText,
        modelo: e.path[3].children[2].innerText,
        cardImg: e.path[3].children[0].currentSrc,
        price: e.path[3].children[3].firstElementChild.innerHTML,

    };
    const existeItemCart = cart.find(item => item.id === product.id);
    
    if(existeItemCart){
        cart = cart.map(item => {
            return item.id === product.id
            ? {... item,cantidad : Number(item.cantidad)+1}
            : item;
        })
    }else{
        cart = [...cart,{...product, cantidad :1}];
    }
    
    saveLocalStorage(cart);
    renderCart(cart);
    showTotal(cart)

}
const categoryDefault = () =>{
    let defaultCate = [];
    productsData.forEach(products =>{
        if(products.category === "Presurizadoras"){
            defaultCate.push(products)
        }
    })
    productsContainer.innerHTML= defaultCate.map(renderCardProduct).join("");
}


 const clickedCategory = (e) =>{
    let productCategory = [] 
    let categorySelected = e.target.innerHTML;
    productsData.forEach(product =>{
        if(!categorySelected){
            return;
        }
        else{
            if(categorySelected === product.category){
                productCategory.push(product)
            }
        }
        
    })
    productsContainer.innerHTML= productCategory.map(renderCardProduct).join("");
 }
 const handlerButtonQuantity = (e) =>{  
    if(e.target.className==="resta"){
        const existeItemCart = cart.find(item => item.id === e.target.id)
        if(existeItemCart.cantidad  <=1){
            if (window.confirm("quiere eliminar este producto del carrito?")){
             cart = cart.filter(product => product.id !== existeItemCart.id);
             saveLocalStorage(cart)
             renderCart(cart);
             showTotal(cart);
             return;
            }
         }
         cart = cart.map((item)=>{
            return item.id === existeItemCart.id
            ? {...item,cantidad : Number(item.cantidad)-1}
            : item;
        })
       

    }else if (e.target.className==="suma"){
        const existeItemCart = cart.find(item => item.id === e.target.id)
        cart = cart.map((item) =>{
            return item.id === existeItemCart.id
            ? {...item ,cantidad : Number(item.cantidad)+1 }
            : item;
        });
    }
    saveLocalStorage(cart)
    renderCart(cart);
    showTotal(cart);
};
    



const init = () =>{
    menuBars.addEventListener("click",openMenu)
    categoryDefault();
    document.addEventListener("DOMContentLoaded",renderCart(cart))
    productsContainer.addEventListener("click",addProduct)
    closeBtn.addEventListener("click",closeCart)
    cartButton.addEventListener("click", opencart);
    categories.addEventListener("click", clickedCategory);
    document.addEventListener("DOMContentLoaded",renderCardProduct)
    cartProductContainer.addEventListener("click", handlerButtonQuantity)
    buyBtn.addEventListener("click",buy);
}

init ();