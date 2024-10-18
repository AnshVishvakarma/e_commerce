const cartbtn = document.querySelector(".cart-btn");
const closeCartbtn = document.querySelector(".close-cart");
const clearCartbtn = document.querySelector(".clear-cart ");
const cartDOM = document.querySelector(".cart");
const cartItem = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productDOM = document.querySelector(".products-center");
const cartoverlay = document.querySelector(".cart-overlay");
const fawindowclose = document.querySelector(".fa-window-close");


// cart-overlay
// const dataid = document. querySelectorAll("data-id");

// cart
let cart = [];
console.log(cart);
//buttons
let buttonsDOM = [];

//getting the products

class products {
  async getProducts() {
    try {
      let result = await fetch("products.json");
      let data = await result.json();
      let products = data.items;
      products = products.map((item) => {
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        console.log(image);
        return { title, price, id, image };
      });
      return products;
    } catch (error) {
      console.log("error in 37", error);
    }

    //
  }
}

//display produts
class UI {
  displayproduct(product) {
    let result = "";
    product.forEach((product) => {
      console.log(product.image);
      result += `
   <article class="product">
   <div class="img-container">
           <img src="${product.image}" alt="product" class="product-img">
           <button class="bag-btn" data-id="${product.id}">
              <i class="fas fa-shopping-cart"></i>
               add to bag
           </button>
   </div>     
  <h3>${product.title}</h3>
  <h4>$${product.price}</h4>
 </article>
   
   `;
    });
    productDOM.innerHTML = result;
  }

  getbagbuttons() {
    let buttons = [...document.querySelectorAll(".bag-btn")];
    buttonsDOM = buttons;
    buttons.forEach((button) => {
      let id = button.dataset.id;
      let inCart = cart.find((item) => item.id === id);
      if (inCart) {
        button.innerHTML = "in cart";
        button.disabled = true;
      }
      //get product form products
      else
      button.addEventListener("click", (event) => {
        event.target.innerText = "In Cart";
        event.target.disabled = true;
          let cartItem = { ...storage.getProducts(id), amount: 1 };
          cart = [...cart, cartItem];

          //save cart in local storage
          storage.saveCart(cart);

          //set cart values
          this.setCartValues(cart);

          
          // this.displaycarditem(cartItem)
          this.displayproduct(cart);
          // show the cart
          this.addCartItem(cartItem);
          // this.addCartItem(cart);

          this.showcart();
        });
    });
  }

  //-----
  setCartValues(cart) {
    try {
      let tempTotal = 0;
      let itemsTotal = 0;
      cart.map((item) => {
        tempTotal += item.price * item.amount;
        itemsTotal += item.amount;
      });
      cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
      cartItem.innerHTML = itemsTotal;

      
    } catch (e) {
      console.log(e);
    }
  }
  //----
  addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
   <img src="${item.image}" alt="procuts">
   <div>
     <h4>${item.title}</h4>
     <h4>${item.price}</h4>
     <span class="remove-cart" data-id=${item.id}>remove</span>
   </div>
   <div>
     <i class="fas fa-chevron-up" data-id=${item.id}></i>
     <p class="cart-amount">${item.amount}</p>
     <i class="fas fa-chevron-down" data-id=${item.id}></i>

   </div>
   `;
    cartContent.appendChild(div);
  }
  showcart() {
    cartoverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }
  setupAPP() {
    cart = storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartbtn.addEventListener("click", this.showcart);
    closeCartbtn.addEventListener("click", this.hideCard);
  }
  populateCart(cart) {
    cart.forEach((item) => this.addCartItem(item));
  }
  hideCard() {
    cartoverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }
  cartLogic() {
    try {
      clearcard.addEventListener("click", () => {
        this.clearCard();
      });
    } catch (e) {
      console.log(e);
    }

    cartContent.addEventListener("click", (event) => {
      if (event.target.classList.contains("remove-item")) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        cartContent.removeChild(removeItem.parentElement.parentElement);

        this.removeItem(id);
      } else if (event.target.classList.contains("fa-chevron-up")) {
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        let tempItem = cart.find((item) => item.id === id);
        tempItem.amount = tempItem.amount + 1;
        storage.saveCart(cart);
        this.setCartValues(cart);
        addAmount.nextElementSibling.innerText = tempItem.amount;

      } else if (event.target.classList.contains("fa-chevron-down")) {
        let lowerAmount = event.target;
        let id = lowerAmount.dataset.id;
        let tempItem = cart.find((item) => item.id === id);

        tempItem.amount = tempItem.amount - 1;
        if (tempItem.amount > 0) {
          Storage.saveCart(cart);
          this.setCartValues(cart);

          lowerAmount.previousElementSibling.innerText = tempItem.amount;
        } else {
          cartContent.removeChild(lowerAmount.parentElement.parentElement);
          this.removeItem(id);
        }
      }
    });
    storage.savaproduct(products);
  }

  clearCard() {
    let cartItem = cart.map((item) => item.id);
    cartItem.forEach((id) => this.removeItem(id));
    console.log(cartContent.children.length);
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
    this.hideCard();
  }
  removeItem(id) {
    cart = cart.filter((item) => item.id !== id);

    this.setCartValues(cart);
    storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `
   <i class="fas fa-shopping-cart"></i>add to cart
   `;
  }
  getSingleButton(id) {
    return buttonsDOM.find((button) => button.dataset.id === id);
  }
}

//localstorage
class storage {
  static savaproduct(products) {
    try {
      localStorage.setItem("product", JSON.stringify(products));
    } catch (error) {
      console.log("your are in savaproduct ", error);
    }
  }

  static getProducts(id) {
    try {
      let products = JSON.parse(localStorage.getItem("product"));
      // Find the product with the specified id
      return products.find((products) => products.id === id);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }

  //  static saveCart(cart){
  //          localStorage.setItem("cart") ? JSON.parse(localStorage.getItem("cart")):[]
  //       }

  static saveCart(cart) {
    try {
      // Get existing cart data (if any), handling potential parsing errors
      const existingCart = localStorage.getItem("cart")
        ? JSON.parse(localStorage.getItem("cart"))
        : {};

      // Update or create the cart with the provided items
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to local storage:", error);
      // Optionally consider alternative storage or fallback mechanisms here
    }
  }
}

//ducument
document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();

  const product = new products();
  ui.setupAPP();

  product
    .getProducts()
    .then((products) => {
      console.log(products);
      ui.displayproduct(products);
      storage.savaproduct(products);
    })

    .then(() => {
      ui.getbagbuttons();
      ui.cartLogic();
    });
});
