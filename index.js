//traimos el contenedor donde van  a ir las cards de productos//
const productsContainer = document.querySelector(".lista-productos");
//este es el contenedor de las listas de las categorias//
const categories = document.querySelector(".categorias-bombas");
//el menu de hamburguesa (icono)//
const menuBars = document.getElementById("bars")
//los items del navbar//
const menu = document.querySelector(".nav-items")
//el item carrito que va a mostrar el cartmenu
const cartButton = document.getElementById("cart");
//el cartmenu donde se van a renderizar los productos agregados
const cartMenu = document.querySelector(".cart-menu");
//la X para cerrar el menu 
const closeBtn = document.getElementById("close-btn");
//el contenedor donde se van a renderizar las card de los productos en el cart
const cartProductContainer = document.querySelector(".card-cart-products");
//el boton + de agregar al cart
const addProductCart = document.querySelector(".agregar-carrito");
//el total de valor de todos los productos agregados
const totalPrice = document.querySelector(".total");
//el boton para concretar la compra
const buyBtn = document.querySelector(".btn-buy")
//creamos el localstorage para agregar o quitar productos del cart. 
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const saveLocalStorage = cartList => {
  localStorage.setItem('cart', JSON.stringify(cartList));
};



//creamos una funcion donde destructuramos lo que vamos a necesitar de data.js para poder renderizar las cards cuando clickeemos en las categorias. retorna un html 
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
//esta funcion se encarga de verificar si el carro esta vacio , si está lleno   y clickea en comprar,  se mostrará una alerta para confirmar, si es asi se  borra el item cart y lo que contenga adentro. luego ejecutamos un refresco de ventana 
const buy = ()=>{
    if(!cart.length) return;
    if(window.confirm("desea hacer esta compra?")){
        localStorage.removeItem("cart")
        window.location.reload();
    }
}
//esta funcion se encarga de renderizar las cartas en el carrito cuando le clickemos al + de las cards de los productos.De la misma forma tambien desestructuramos lo que vamos a necesitar en el objeto de data.js
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

//esto verifica si el carro está vacio va a mostrar un mensaje avisando. asi mismo el precio del total va a ser $0. caso contrario se realiza un mapeo del cartlist y se llama a la funcion que se encarga de renderizar las cards de los productos en el CART.luego actualiza el total $ 
const renderCart = (cartList) =>{
    if(!cart.length){
        cartProductContainer.innerHTML= `<p class ="msg-cart">no tiene productos en el carrito</p>`;
        totalPrice.innerHTML="TOTAL : AR$ 0"
        return;
    }
    cartProductContainer.innerHTML = cartList.map(renderCardCartProduct).join("");
    showTotal(cart)
}

//esta funcion se encarga de abrir el menu de hamburguesa, si ya está abierto termina, y si no le agregamos un toggle para tambien cerrarlo cuando lo volves a seleccionar.
const openMenu = () =>{
   if(cartMenu.classList.contains("show")){
    return;
   }else{
    menu.classList.toggle("show")
   }
}

//cuando se le haga click a la X en el cartmenu se cierra el carrito
const closeCart = () =>{
    cartMenu.classList.remove("show")
    // menu.classList.toggle("show")
}
//esta funcion es para abrir el carrito, si tiene la clase "show" que se encarga de mostrarlo no va a ser nada. si no la tiene se la agrega y al menu de hamburguesa se la remueve para asi no se muestren las dos al mismo tiempo. 
const opencart = () =>{
   if(cartMenu.classList.contains("show")){
    return
   }else{
    cartMenu.classList.add("show")
    menu.classList.remove("show")
   }
}
//showtotal se encarga de sumar el precio d todos los items seleccionados para comprar. 
const showTotal = cartProducts => {
    totalPrice.innerHTML = `AR$ ${cartProducts
      .reduce((acc, cur) => acc + Number(cur.price) * cur.cantidad, 0)
      .toFixed(3)} `;

  };
//esta funcion se  encarga de mostrar los productos en el cartmenu segun la card seleccionada mediante su boton de +. se realiza un objeto para luego despues renderizarlo en el cartmenu. 
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
    //en esta constante vamos a buscar con el metodo find , si el producto (de la card) es igual al item.id del carrito 
    const existeItemCart = cart.find(item => item.id === product.id);
    //si existe ese id. se le agrega al card con la cantidad . 
    if(existeItemCart){
        cart = cart.map(item => {
            return item.id === product.id
            ? {... item,cantidad : Number(item.cantidad)}
            : item;
        })
    }else{
        cart = [...cart,{...product, cantidad :1}];
    }
    //luego se actualiza el local storage  se renderiza las cards y se actualiza el total del valor de los productos.
    saveLocalStorage(cart);
    renderCart(cart);
    showTotal(cart)

}
//en esta funcion  lo que hacemos es que el renderizado por default de la pagina sea "presurizadoras" se crea una variable donde despues de recorrer data y sus categorias se agregan a la lista para luego renderizar en forma de cards
const categoryDefault = () =>{
    let defaultCate = [];
    productsData.forEach(products =>{
        if(products.category === "Presurizadoras"){
            defaultCate.push(products)
        }
    })
    productsContainer.innerHTML= defaultCate.map(renderCardProduct).join("");
}

// esta funcion se encarga  de mostrar los productos segun la categoria clickeada,  se crea una lista vacia para agregar los productos que tengan la misma categoria seleccionada. luego se renderiza las cards 
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
 //esta funcion se encarga de manipular la cantidad de productos que el usuario quiera comprar, apretando el + o -. asi mismo si se apreta el  + se suma 1 al contador o si es - se resta.

 const handlerButtonQuantity = (e) =>{  
    if(e.target.className==="resta"){
        //se verifica si el boton tocado contiene el mismo id del producto en el cart. si es asi es el producto  que el usuario desea manipular.
        const existeItemCart = cart.find(item => item.id === e.target.id)
        //si la cantidad es menor a 1 se le muestra al usuario una ventana de confirmacion si desea eliminar el producto de la lista.si asi lo desea, se elimina del localstorage y del mismo cart-menu
        if(existeItemCart.cantidad  <=1){
            if (window.confirm("quiere eliminar este producto del carrito?")){
             cart = cart.filter(product => product.id !== existeItemCart.id);
             saveLocalStorage(cart)
             renderCart(cart);
             showTotal(cart);
             return;
            }
         }
         //en otro caso accedemos a la cantidad, del item seleccionado para restar de a 1 si desea comprar menos productos.
         cart = cart.map((item)=>{
            return item.id === existeItemCart.id
            ? {...item,cantidad : Number(item.cantidad)-1}
            : item;
        })
       
    //caso contrario si desea sumar mas cantidad del mismo producto,  se suma +1 
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
    


//en esta funcion INIT es donde se inician todas las funciones ya vistas arriba. para tener una mejor prolijidad y para interpretar de forma mas ordenada el codigo. 
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